<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Invoice;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * List all customer bookings from PostgreSQL (Admin & Operator only)
     */
    public function index(Request $request)
    {
        $query = Booking::with(['invoice', 'hotelReservation', 'transportReservation']);

        if ($request->has('status') && in_array($request->status, ['Confirmed', 'Pending', 'Completed', 'Cancelled'])) {
            $query->where('booking_status', $request->status);
        }

        $bookings = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'count' => $bookings->count(),
            'data' => $bookings
        ]);
    }

    /**
     * Register a new Tour Booking via Guest Checkout with security validation
     */
    public function storeGuestBooking(Request $request)
    {
        $validated = $request->validate([
            'tour_package_id' => 'required|string|max:100',
            'tour_title' => 'required|string|max:255',
            'customer' => 'required|array',
            'customer.full_name' => 'required|string|max:150',
            'customer.email' => 'required|email:rfc,dns|max:150',
            'customer.phone' => 'required|string|max:30',
            'customer.nationality' => 'nullable|string|max:80',
            'customer.emergency_contact' => 'nullable|string|max:100',
            'passengers' => 'required|array|min:1|max:50',
            'passengers.*.name' => 'required|string|max:150',
            'passengers.*.age' => 'required|integer|min:0|max:120',
            'passengers.*.id_number' => 'nullable|string|max:50',
            'travel_date' => 'required|date|after:today',
            'num_pax' => 'required|integer|min:1|max:50',
            'total_price' => 'required|numeric|min:100',
            'special_requests' => 'nullable|string|max:500',
            'payment_choice' => 'required|string|in:full,deposit',
            'payment_method' => 'required|string|in:GCash,Maya,Bank Transfer,Credit Card'
        ]);

        // Verify package exists & validate calculated pricing integrity
        $package = DB::table('tour_packages')->where('id', $validated['tour_package_id'])->first();
        if ($package) {
            $expectedTotal = (float) $package->price_per_pax * (int) $validated['num_pax'];
            // If submitted total deviates significantly from calculated base, use validated base
            if (abs($expectedTotal - (float) $validated['total_price']) > 50) {
                $validated['total_price'] = $expectedTotal;
            }
        }

        $bookingRef = 'TT-' . date('Y') . '-' . rand(1000, 9999);
        $depositRequired = $validated['total_price'] * 0.30;

        $booking = Booking::create([
            'id' => (string) Str::uuid(),
            'booking_ref' => $bookingRef,
            'tour_package_id' => $validated['tour_package_id'],
            'tour_title' => $validated['tour_title'],
            'customer' => $validated['customer'],
            'passengers' => $validated['passengers'],
            'travel_date' => $validated['travel_date'],
            'num_pax' => $validated['num_pax'],
            'total_price' => $validated['total_price'],
            'deposit_required' => $depositRequired,
            'special_requests' => $validated['special_requests'] ?? null,
            'booking_status' => 'Confirmed',
            'payment_status' => 'Unpaid',
            'created_at' => now(),
        ]);

        // Auto-generate invoice record in PostgreSQL
        $invoice = Invoice::create([
            'id' => (string) Str::uuid(),
            'booking_id' => $booking->id,
            'invoice_number' => 'INV-' . date('Y') . '-' . rand(100, 999),
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(7)->toDateString(),
            'total_amount' => $validated['total_price'],
            'amount_paid' => 0,
            'balance_due' => $validated['total_price'],
            'status' => 'Unpaid',
            'payments' => []
        ]);

        // Security Audit Log
        Log::info("New Tour Booking Created [{$bookingRef}]", [
            'booking_id' => $booking->id,
            'tour' => $booking->tour_title,
            'customer_email' => $booking->customer['email'] ?? 'N/A',
            'ip' => $request->ip(),
            'amount' => $booking->total_price
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking successfully registered',
            'booking_ref' => $bookingRef,
            'data' => $booking->load('invoice')
        ], 201);
    }

    /**
     * Secure Self-Service Tracking (Row-Level Access Check: requires ref + email/phone match)
     */
    public function trackGuestBooking(Request $request)
    {
        $validated = $request->validate([
            'booking_ref' => 'required|string|max:30',
            'email_or_phone' => 'required|string|max:100'
        ]);

        $query = Booking::with(['invoice', 'hotelReservation', 'transportReservation'])
            ->where('booking_ref', trim($validated['booking_ref']));

        $booking = $query->first();

        if (! $booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'No booking found matching the provided reference number.',
                'code' => 404
            ], 404);
        }

        // Row-Level Security Verification: Compare lead customer email or phone
        $identifier = strtolower(trim($validated['email_or_phone']));
        $customerEmail = strtolower($booking->customer['email'] ?? '');
        $customerPhone = preg_replace('/[^0-9]/', '', $booking->customer['phone'] ?? '');
        $searchPhone = preg_replace('/[^0-9]/', '', $identifier);

        $isAuthorized = ($customerEmail === $identifier) || 
                        ($searchPhone && str_contains($customerPhone, $searchPhone)) ||
                        ($customerEmail && str_contains($customerEmail, $identifier));

        if (! $isAuthorized) {
            Log::warning("Unauthorized tracking lookup attempt on booking [{$validated['booking_ref']}]", [
                'ip' => $request->ip(),
                'provided_identifier' => $identifier
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Access Denied: The email or phone number does not match the passenger manifest on record.',
                'code' => 403
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $booking
        ]);
    }

    /**
     * Show specific booking details (Protected for Operator/Admin)
     */
    public function show($id)
    {
        $booking = Booking::with(['invoice', 'hotelReservation', 'transportReservation'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $booking
        ]);
    }

    /**
     * Update Booking Status (Operator action with audit log)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Confirmed,Pending,Completed,Cancelled'
        ]);

        $booking = Booking::findOrFail($id);
        $oldStatus = $booking->booking_status;
        $booking->booking_status = $request->status;
        $booking->save();

        Log::info("Booking Status Changed [{$booking->booking_ref}]: {$oldStatus} -> {$request->status}", [
            'operator' => $request->user()->email,
            'ip' => $request->ip()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Booking status updated to {$request->status}",
            'data' => $booking
        ]);
    }
}

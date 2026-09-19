<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class VoucherController extends Controller
{
    /**
     * Issue Hotel Voucher for Booking (Protected: Operator/Admin)
     */
    public function issueHotelVoucher(Request $request, $bookingId)
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:150',
            'room_type' => 'required|string|max:100',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'special_instructions' => 'nullable|string|max:500'
        ]);

        $booking = Booking::findOrFail($bookingId);
        $voucherCode = 'HTL-' . strtoupper(Str::random(8));

        Log::info("Hotel Voucher Issued [{$voucherCode}] for Booking {$booking->booking_ref} at {$validated['hotel_name']}", [
            'issued_by' => $request->user()->email
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Hotel reservation voucher generated successfully',
            'voucher_code' => $voucherCode,
            'hotel_details' => $validated
        ]);
    }

    /**
     * Issue Transport / Vehicle Dispatch Voucher (Protected: Operator/Admin)
     */
    public function issueTransportVoucher(Request $request, $bookingId)
    {
        $validated = $request->validate([
            'vehicle_type' => 'required|string|max:100',
            'driver_name' => 'required|string|max:100',
            'driver_contact' => 'required|string|max:50',
            'plate_number' => 'required|string|max:30',
            'pickup_location' => 'required|string|max:150',
            'pickup_time' => 'required|string|max:30'
        ]);

        $booking = Booking::findOrFail($bookingId);
        $voucherCode = 'TRN-' . strtoupper(Str::random(8));

        Log::info("Transport Voucher Issued [{$voucherCode}] for Booking {$booking->booking_ref} - Driver: {$validated['driver_name']}", [
            'issued_by' => $request->user()->email
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Transport dispatch voucher generated successfully',
            'voucher_code' => $voucherCode,
            'transport_details' => $validated
        ]);
    }
}

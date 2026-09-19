<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;

class ItineraryController extends Controller
{
    /**
     * Show booking itinerary details
     */
    public function show($bookingId)
    {
        $booking = Booking::findOrFail($bookingId);
        return response()->json([
            'status' => 'success',
            'booking_id' => $bookingId,
            'tour_title' => $booking->tour_title,
            'travel_date' => $booking->travel_date,
            'assigned_guide' => $booking->assigned_guide ?? 'Unassigned'
        ]);
    }

    /**
     * Assign Tour Guide to Booking (Protected: Operator/Admin)
     */
    public function assignGuide(Request $request, $bookingId)
    {
        $validated = $request->validate([
            'guide_name' => 'required|string|max:100',
            'guide_contact' => 'nullable|string|max:50',
            'briefing_notes' => 'nullable|string|max:500'
        ]);

        $booking = Booking::findOrFail($bookingId);
        $booking->assigned_guide = $validated['guide_name'];
        $booking->save();

        Log::info("Tour Guide Assigned to Booking [{$booking->booking_ref}]: {$validated['guide_name']}", [
            'assigned_by' => $request->user()->email
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Tour guide '{$validated['guide_name']}' successfully assigned to booking {$booking->booking_ref}."
        ]);
    }
}

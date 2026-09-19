<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    /**
     * List all published feedbacks
     */
    public function index()
    {
        $feedbacks = DB::table('customer_feedbacks')
            ->where('status', 'Approved')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $feedbacks]);
    }

    /**
     * Store new customer feedback (public, sanitized)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_ref' => 'nullable|string|max:30',
            'customer_name' => 'required|string|max:100',
            'tour_title' => 'required|string|max:200',
            'overall_rating' => 'required|integer|min:1|max:5',
            'guide_rating' => 'required|integer|min:1|max:5',
            'hotel_rating' => 'required|integer|min:1|max:5',
            'transport_rating' => 'required|integer|min:1|max:5',
            'nps_score' => 'required|integer|min:1|max:10',
            'review_text' => 'required|string|max:1000',
            'travel_date' => 'nullable|date'
        ]);

        $id = (string) Str::uuid();

        DB::table('customer_feedbacks')->insert([
            'id' => $id,
            'booking_ref' => $validated['booking_ref'] ?? null,
            'customer_name' => $validated['customer_name'],
            'tour_title' => $validated['tour_title'],
            'overall_rating' => $validated['overall_rating'],
            'guide_rating' => $validated['guide_rating'],
            'hotel_rating' => $validated['hotel_rating'],
            'transport_rating' => $validated['transport_rating'],
            'nps_score' => $validated['nps_score'],
            'review_text' => $validated['review_text'],
            'travel_date' => $validated['travel_date'] ?? now()->toDateString(),
            'status' => 'Approved',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        Log::info("Customer Feedback Submitted for [{$validated['tour_title']}] - Rating: {$validated['overall_rating']} Stars", [
            'author' => $validated['customer_name'],
            'nps' => $validated['nps_score']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you! Your feedback has been submitted successfully.',
            'id' => $id
        ], 201);
    }

    /**
     * Moderate / Approve feedback (Protected)
     */
    public function moderate(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Approved,Hidden,Flagged'
        ]);

        DB::table('customer_feedbacks')->where('id', $id)->update([
            'status' => $validated['status'],
            'updated_at' => now()
        ]);

        return response()->json(['status' => 'success', 'message' => 'Feedback moderation status updated']);
    }
}

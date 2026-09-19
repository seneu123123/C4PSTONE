<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class TourPackageController extends Controller
{
    /**
     * Public Catalog of Active Tour Packages
     */
    public function index()
    {
        $packages = DB::table('tour_packages')->where('status', 'Active')->get();
        return response()->json(['status' => 'success', 'data' => $packages]);
    }

    /**
     * Get specific tour package
     */
    public function show($id)
    {
        $package = DB::table('tour_packages')->where('id', $id)->first();
        if (!$package) {
            return response()->json(['status' => 'error', 'message' => 'Tour package not found'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $package]);
    }

    /**
     * Create new package (Protected: Admin/Operator)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'destination' => 'required|string|max:100',
            'category' => 'required|string|in:Island Hopping,Adventure & Nature,Heritage & Culture,Luxury & Wellness,City Tour',
            'duration_days' => 'required|integer|min:1|max:30',
            'duration_nights' => 'required|integer|min:0|max:30',
            'price_per_pax' => 'required|numeric|min:100|max:1000000',
            'max_capacity' => 'required|integer|min:1|max:100',
            'inclusions' => 'nullable|array',
            'exclusions' => 'nullable|array',
            'itinerary' => 'nullable|array'
        ]);

        $id = (string) Str::uuid();
        $code = 'PKG-' . strtoupper(Str::random(6));

        DB::table('tour_packages')->insert([
            'id' => $id,
            'code' => $code,
            'title' => $validated['title'],
            'destination' => $validated['destination'],
            'category' => $validated['category'],
            'duration_days' => $validated['duration_days'],
            'duration_nights' => $validated['duration_nights'],
            'price_per_pax' => $validated['price_per_pax'],
            'max_capacity' => $validated['max_capacity'],
            'inclusions' => json_encode($request->input('inclusions', [])),
            'exclusions' => json_encode($request->input('exclusions', [])),
            'itinerary' => json_encode($request->input('itinerary', [])),
            'status' => 'Active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Log::info("Tour Package Created [{$code}]: {$validated['title']}", [
            'created_by' => $request->user()->email,
            'price' => $validated['price_per_pax']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tour package created successfully',
            'id' => $id,
            'code' => $code
        ], 201);
    }

    /**
     * Update package (Protected: Admin/Operator)
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:150',
            'destination' => 'sometimes|string|max:100',
            'category' => 'sometimes|string|in:Island Hopping,Adventure & Nature,Heritage & Culture,Luxury & Wellness,City Tour',
            'price_per_pax' => 'sometimes|numeric|min:100',
            'status' => 'sometimes|string|in:Active,Inactive,Draft'
        ]);

        $exists = DB::table('tour_packages')->where('id', $id)->exists();
        if (!$exists) {
            return response()->json(['status' => 'error', 'message' => 'Tour package not found'], 404);
        }

        DB::table('tour_packages')->where('id', $id)->update(array_merge($validated, [
            'updated_at' => now()
        ]));

        Log::info("Tour Package Updated [{$id}]", [
            'updated_by' => $request->user()->email,
            'changes' => array_keys($validated)
        ]);

        return response()->json(['status' => 'success', 'message' => 'Tour package updated successfully']);
    }

    /**
     * Delete package (Protected: Admin/Operator)
     */
    public function destroy(Request $request, $id)
    {
        $package = DB::table('tour_packages')->where('id', $id)->first();
        if (!$package) {
            return response()->json(['status' => 'error', 'message' => 'Package not found'], 404);
        }

        DB::table('tour_packages')->where('id', $id)->delete();

        Log::warning("Tour Package Deleted [{$id}]: {$package->title}", [
            'deleted_by' => $request->user()->email
        ]);

        return response()->json(['status' => 'success', 'message' => 'Tour package deleted successfully']);
    }
}

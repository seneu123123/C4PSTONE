<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Default Admin User
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@holidaytravelers.ph'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Seed Sample Tour Packages
        $packages = [
            [
                'id' => Str::uuid()->toString(),
                'code' => 'PKG-ELNIDO',
                'title' => 'El Nido Island Hopping Paradise',
                'destination' => 'El Nido, Palawan',
                'category' => 'Island Hopping',
                'duration_days' => 4,
                'duration_nights' => 3,
                'price_per_pax' => 14500.00,
                'max_capacity' => 15,
                'inclusions' => json_encode([
                    '3 Nights Hotel Accommodation with Breakfast',
                    'El Nido Tour A & Tour C with Picnic Lunch',
                    'Roundtrip Puerto Princesa Airport Transfers',
                    'Environmental Fees & Kayak Rental'
                ]),
                'exclusions' => json_encode([
                    'Airfare to/from Puerto Princesa',
                    'Personal Expenses & Tips',
                    'Travel Insurance'
                ]),
                'banner_url' => 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86',
                'rating' => 4.90,
                'review_count' => 128,
                'status' => 'Active',
                'featured' => true,
                'itinerary' => json_encode([
                    ['day' => 1, 'title' => 'Arrival & Transfer to El Nido', 'description' => 'Land at PPS Airport, 5-hr scenic van transfer to El Nido, check-in.'],
                    ['day' => 2, 'title' => 'Tour A: Big Lagoon & Secret Lagoon', 'description' => 'Explore Big Lagoon kayaking, Secret Lagoon, Shimizu Island picnic lunch.'],
                    ['day' => 3, 'title' => 'Tour C: Hidden Beach & Matinloc', 'description' => 'Discover Hidden Beach, Helicopter Island, Matinloc Shrine snorkeling.'],
                    ['day' => 4, 'title' => 'Departure', 'description' => 'Free time for souvenir shopping before transfer back to PPS Airport.']
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'PKG-BORACAY',
                'title' => 'Boracay Beach Getaway & Water Sports',
                'destination' => 'Boracay, Aklan',
                'category' => 'Beach & Leisure',
                'duration_days' => 3,
                'duration_nights' => 2,
                'price_per_pax' => 9800.00,
                'max_capacity' => 20,
                'inclusions' => json_encode([
                    '2 Nights Beachfront Hotel Accommodation',
                    'Daily Buffet Breakfast',
                    'Caticlan Airport Express Transfers (Land & Boat)',
                    'Parasailing & Sunset Paraw Sailing Session'
                ]),
                'exclusions' => json_encode([
                    'Airfare to Caticlan',
                    'Dinners & Personal Drinks'
                ]),
                'banner_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
                'rating' => 4.85,
                'review_count' => 95,
                'status' => 'Active',
                'featured' => true,
                'itinerary' => json_encode([
                    ['day' => 1, 'title' => 'Boracay Arrival & Sunset Paraw', 'description' => 'Land at MPH, speedboat to island station, check-in, 5PM Paraw Sailing.'],
                    ['day' => 2, 'title' => 'Island Hopping & Parasailing', 'description' => 'Puka Beach visit, Crocodile Island snorkeling, afternoon 15-min parasail.'],
                    ['day' => 3, 'title' => 'Beach Free Time & Departure', 'description' => 'Morning White Beach walk, checkout, express boat transfer to Caticlan.']
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'PKG-BOHOL',
                'title' => 'Bohol Countryside & Tarsier Sanctuary Tour',
                'destination' => 'Bohol',
                'category' => 'Eco & Cultural',
                'duration_days' => 3,
                'duration_nights' => 2,
                'price_per_pax' => 8500.00,
                'max_capacity' => 12,
                'inclusions' => json_encode([
                    '2 Nights Resort Accommodation in Panglao',
                    'Full Day Countryside Tour with Loboc River Buffet Cruise',
                    'Panglao Island Hopping & Dolphin Watching',
                    'All Entrance Fees & Private Vehicle Transfers'
                ]),
                'exclusions' => json_encode([
                    'Airfare / Ferry Tickets',
                    'Souvenirs'
                ]),
                'banner_url' => 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
                'rating' => 4.92,
                'review_count' => 82,
                'status' => 'Active',
                'featured' => false,
                'itinerary' => json_encode([
                    ['day' => 1, 'title' => 'Tagbilaran Arrival & Panglao Check-in', 'description' => 'Airport pickup, drop off at Alona Beach resort, leisure night.'],
                    ['day' => 2, 'title' => 'Countryside Tour & Chocolate Hills', 'description' => 'Visit Tarsier Sanctuary, Chocolate Hills, Bilar Man-Made Forest, Loboc Lunch.'],
                    ['day' => 3, 'title' => 'Dolphin Watching & Departure', 'description' => '6 AM Dolphin Watching at Balicasag Island, Virgin Island sandbar, airport transfer.']
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($packages as $package) {
            DB::table('tour_packages')->updateOrInsert(
                ['code' => $package['code']],
                $package
            );
        }
    }
}

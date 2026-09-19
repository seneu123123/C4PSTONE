<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PostgreSQL Schema Migration for Customer Bookings
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('booking_ref')->unique(); // TT-2026-8942
            $table->uuid('tour_package_id')->index();
            $table->string('tour_title');
            $table->jsonb('customer'); // JSONB { full_name, email, phone }
            $table->jsonb('passengers'); // JSONB passenger list
            $table->date('travel_date');
            $table->integer('num_pax');
            $table->decimal('total_price', 12, 2);
            $table->decimal('deposit_required', 12, 2);
            $table->string('booking_status')->default('Confirmed'); // Confirmed, Pending, Completed, Cancelled
            $table->string('payment_status')->default('Unpaid'); // Paid, Partial, Unpaid
            $table->string('assigned_guide')->nullable();
            $table->jsonb('hotel_reservation')->nullable();
            $table->jsonb('transport_reservation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

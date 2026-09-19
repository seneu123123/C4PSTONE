<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PostgreSQL Schema Migration for Tour Packages
     */
    public function up(): void
    {
        Schema::create('tour_packages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->string('title');
            $table->string('destination');
            $table->string('category'); // Island Hopping, Heritage, etc.
            $table->integer('duration_days');
            $table->integer('duration_nights');
            $table->decimal('price_per_pax', 12, 2);
            $table->integer('max_capacity');
            $table->jsonb('inclusions'); // PostgreSQL JSONB array
            $table->jsonb('exclusions');
            $table->text('banner_url')->nullable();
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('review_count')->default(0);
            $table->string('status')->default('Active'); // Active, Draft, Archived
            $table->boolean('featured')->default(false);
            $table->jsonb('itinerary'); // JSONB array of daily activities
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_packages');
    }
};

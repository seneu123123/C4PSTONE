<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SanctumAuthController;
use App\Http\Controllers\Api\TourPackageController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ItineraryController;
use App\Http\Controllers\Api\VoucherController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\SecurityAuditController;

/*
|--------------------------------------------------------------------------
| REST API Routes - Holiday Travelers Travel & Tours Inc.
| Capstone Tour Operations & Customer Booking System
| Security: Sanctum Auth, Rate Limiting, RBAC & Row-Level Authorization
|--------------------------------------------------------------------------
*/

// ==========================================
// 1. PUBLIC AUTHENTICATION (Strict Throttle: 5 req/min)
// ==========================================
Route::prefix('v1/auth')->middleware('throttle:5,1')->group(function () {
    Route::post('/register', [SanctumAuthController::class, 'register']);
    Route::post('/login', [SanctumAuthController::class, 'login']);
});

// ==========================================
// 2. PUBLIC CATALOG & GUEST TRACKING (Rate-limited)
// ==========================================
Route::prefix('v1')->group(function () {
    // Tour Packages Catalog (60 req/min)
    Route::get('/packages', [TourPackageController::class, 'index'])->middleware('throttle:60,1');
    Route::get('/packages/{id}', [TourPackageController::class, 'show'])->middleware('throttle:60,1');

    // Customer Guest Booking Creation (15 req/min)
    Route::post('/bookings/guest', [BookingController::class, 'storeGuestBooking'])->middleware('throttle:15,1');

    // Secure Self-Service Booking Tracker (Row-Level Check: requires matching ref + email/phone)
    Route::post('/bookings/track', [BookingController::class, 'trackGuestBooking'])->middleware('throttle:30,1');

    // Public Feedback Feed & Review Submission
    Route::get('/feedbacks', [FeedbackController::class, 'index'])->middleware('throttle:60,1');
    Route::post('/feedbacks', [FeedbackController::class, 'store'])->middleware('throttle:10,1');
});

// ==========================================
// 3. PROTECTED OPERATOR & ADMIN ROUTES (Sanctum Token + RBAC)
// ==========================================
Route::prefix('v1')->middleware(['auth:sanctum', 'role:admin,operator', 'throttle:120,1'])->group(function () {
    // Current Staff Profile & Logout
    Route::get('/auth/me', [SanctumAuthController::class, 'me']);
    Route::post('/auth/logout', [SanctumAuthController::class, 'logout']);

    // Submodule 1: Tour Package Management (Full Operator CRUD)
    Route::post('/packages', [TourPackageController::class, 'store']);
    Route::put('/packages/{id}', [TourPackageController::class, 'update']);
    Route::delete('/packages/{id}', [TourPackageController::class, 'destroy']);

    // Submodule 2: Passenger Manifest & Booking Management
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::patch('/bookings/{id}/status', [BookingController::class, 'updateStatus']);

    // Submodule 3: Itinerary & Tour Guide Dispatch
    Route::get('/itineraries/{bookingId}', [ItineraryController::class, 'show']);
    Route::patch('/itineraries/{bookingId}/guide', [ItineraryController::class, 'assignGuide']);

    // Submodule 4: Hotel & Transport Allocations & Vouchers
    Route::post('/bookings/{bookingId}/vouchers/hotel', [VoucherController::class, 'issueHotelVoucher']);
    Route::post('/bookings/{bookingId}/vouchers/transport', [VoucherController::class, 'issueTransportVoucher']);

    // Submodule 5: Payment Ledger & Official Invoices
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::post('/invoices/{id}/payments', [InvoiceController::class, 'recordPayment']);

    // Submodule 6: Feedback Moderation
    Route::patch('/feedbacks/{id}/moderate', [FeedbackController::class, 'moderate']);

    // Security & Operations Audit Trail
    Route::get('/security/audit-logs', [SecurityAuditController::class, 'index']);
    Route::get('/security/system-health', [SecurityAuditController::class, 'systemHealth']);
});

// ==========================================
// 4. RESTRICTED DEBUGGING ENDPOINTS (Local Environment Only)
// ==========================================
Route::prefix('v1/debug')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/schema-diagnostics', [SecurityAuditController::class, 'schemaDiagnostics']);
});

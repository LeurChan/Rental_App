<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController; // ⚠️ Make sure this matches your folder structure
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\AdminController;        // ⚠️ Make sure this import is here

// 1. PUBLIC ROUTES (Anyone can access)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/home', [PropertyController::class, 'index']); // Get all houses
Route::get('/properties/{id}', [PropertyController::class, 'show']); // Get details

// 2. PROTECTED ROUTES (Must be logged in)
Route::middleware('auth:sanctum')->group(function () {
    
    // Get User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // ✅ Booking Routes
    Route::post('/bookings', [BookingController::class, 'store']); // Book a house
    Route::get('/bookings', [BookingController::class, 'index']);  // See my bookings

    // ✅ ADMIN ROUTES
    Route::get('/admin/stats', [AdminController::class, 'stats']); // Dashboard Stats
    Route::post('/properties', [PropertyController::class, 'store']); // 👈 ADD THIS (Create Property)
});
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController; 
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AdminController;
// use App\Http\Controllers\AdminController; // (Uncomment if you created this file later)

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

    Route::get('/admin/stats', [AdminController::class, 'stats']); // 👈 This must exist

    // --- USER BOOKING ROUTES ---
    Route::post('/bookings', [BookingController::class, 'store']); // Book a house
    Route::get('/bookings', [BookingController::class, 'index']);  // See my bookings

    // --- ADMIN ROUTES ---
    // 1. Add Property
    Route::post('/properties', [PropertyController::class, 'store']); 

    // 2. Manage Bookings (👇 YOU WERE MISSING THESE)
    Route::get('/admin/bookings', [BookingController::class, 'indexAdmin']);
Route::put('/bookings/{id}', [BookingController::class, 'update']);

});
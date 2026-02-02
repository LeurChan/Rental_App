<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\BookingController; // Make sure this is imported

// 1. PUBLIC ROUTES (Anyone can access)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/home', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// 2. PROTECTED ROUTES (Must be logged in)
Route::middleware('auth:sanctum')->group(function () {
    
    // Get User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Create a Booking
    Route::post('/bookings', [BookingController::class, 'store']);

    Route::get('/bookings', [BookingController::class, 'index']);
});
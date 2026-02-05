<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController; 
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AdminController;

// --- PUBLIC ROUTES ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/home', [PropertyController::class, 'index']); 
Route::get('/properties/{id}', [PropertyController::class, 'show']); 

// --- PROTECTED ROUTES (Requires Login) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Get User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Profile Settings
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
    Route::put('/user/update-contact', [AuthController::class, 'updateContact']);

    // Admin Controls
    Route::get('/admin/stats', [AdminController::class, 'stats']); 
    Route::post('/properties', [PropertyController::class, 'store']); 
    Route::get('/admin/bookings', [BookingController::class, 'indexAdmin']);

    // User Bookings
    Route::post('/bookings', [BookingController::class, 'store']); 
    Route::get('/bookings', [BookingController::class, 'index']);  
    Route::put('/bookings/{id}', [BookingController::class, 'update']);
});
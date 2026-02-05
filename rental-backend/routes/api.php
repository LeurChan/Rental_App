<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController; 
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\FavoriteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. PUBLIC ROUTES (Anyone can access)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/home', [PropertyController::class, 'index']); 
Route::get('/properties/{id}', [PropertyController::class, 'show']); 


// Moved here to allow property updates without auth issues if intended
Route::put('/properties/{id}', [PropertyController::class, 'update']); 

// 2. PROTECTED ROUTES (Must be logged in with Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    
    // Get User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- PROFILE SETTINGS ---
    // Handles the "Change Password", "Change Email", and "Change Phone" buttons
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
    Route::put('/user/update-contact', [AuthController::class, 'updateContact']);

    // --- ADMIN CONTROLS ---
    Route::get('/admin/stats', [AdminController::class, 'stats']); 
    Route::post('/properties', [PropertyController::class, 'store']); 
    Route::get('/admin/bookings', [BookingController::class, 'indexAdmin']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);

    // --- BOOKING ROUTES ---
    Route::post('/bookings', [BookingController::class, 'store']); 
    Route::get('/bookings', [BookingController::class, 'index']);  
    Route::put('/bookings/{id}', [BookingController::class, 'update']);

    Route::post('/favorites/toggle', [FavoriteController::class, 'toggleFavorite']);
    Route::get('/user/favorites', [FavoriteController::class, 'getUserFavorites']);
    Route::get('/favorites', [FavoriteController::class, 'index']);
});
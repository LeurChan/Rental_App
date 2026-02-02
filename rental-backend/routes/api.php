<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// This points to the subfolder where your AuthController is located
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\PropertyController;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Home/Property Routes
Route::get('/home', [PropertyController::class, 'index']);


Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Add this line for the Details Page:
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Add this line for the Profile Page:
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
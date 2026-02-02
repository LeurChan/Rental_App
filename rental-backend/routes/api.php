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
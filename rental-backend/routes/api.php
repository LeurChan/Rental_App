<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// NOTICE: No "\Api" here because your file is in the main folder
use App\Http\Controllers\AuthController;      
use App\Http\Controllers\Api\PropertyController; // Keep this if Property is in Api folder

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::get('/home', [PropertyController::class, 'index']);
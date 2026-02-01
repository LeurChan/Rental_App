<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // <--- 1. IMPORT YOUR CONTROLLER

// --- YOUR NEW AUTH ROUTES ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- YOUR EXISTING HOME ROUTE ---
Route::get('/home', function () {
    return [
        ["id" => 1, "name" => "House A", "price" => 500],
        ["id" => 2, "name" => "House B", "price" => 750]
    ];
});
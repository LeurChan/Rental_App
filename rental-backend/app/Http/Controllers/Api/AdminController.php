<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\Booking;
use App\Models\User;

class AdminController extends Controller 
{
    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'properties' => Property::count(),
            'bookings' => Booking::count(),
        ]);
    }
}
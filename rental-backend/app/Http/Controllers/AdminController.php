<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Booking; // Make sure you have a Booking model
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::where('role', 'user')->count(),
            'total_properties' => Property::count(),
            'total_bookings' => Booking::count(),
            // You can add 'total_revenue' if you sum up booking prices later
        ]);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'property_id' => 'required|exists:properties,id',
        ]);

        // Create the booking
        $booking = Booking::create([
            'user_id' => $request->user()->id, // Get logged-in user ID
            'property_id' => $request->property_id,
            'start_date' => now(), // Default to today for now
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Booking successful!', 'booking' => $booking], 201);
    }
    // Add this new function inside the class
public function index(Request $request)
{
    // Get all bookings for the logged-in user + include property details
    $bookings = Booking::where('user_id', $request->user()->id)
        ->with('property') // Load the house details too
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($bookings);
}
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // 1. Create Booking (For User)
    public function store(Request $request)
{
    $request->validate([
        'property_id' => 'required|exists:properties,id',
        'phone_number' => 'required',
        'start_date' => 'required|date',
        'end_date' => 'required|date',
    ]);

    $booking = Booking::create([
        'user_id' => $request->user()->id, // 👈 Required for auth:sanctum
        'property_id' => $request->property_id,
        'phone_number' => $request->phone_number,
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
        'notes' => $request->notes,
        'status' => 'pending'
    ]);

    return response()->json(['status' => true, 'message' => 'Booking successful!', 'booking' => $booking]);
}

    // 2. Get My Bookings (For User)
    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)
            ->with('property')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    // 3. Get ALL Bookings (For Admin) 👈 NEW
    public function indexAdmin()
    {
        // We load 'property' AND 'user' so admin sees who booked what
        return Booking::with(['property', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // 4. Update Status (For Admin: Approve/Reject) 👈 NEW
    public function update(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // Validate that we sent a status
        $request->validate([
            'status' => 'required|in:confirmed,cancelled'
        ]);

        $booking->status = $request->status;
        $booking->save();

        return response()->json(['message' => 'Booking status updated', 'data' => $booking]);
    }
}
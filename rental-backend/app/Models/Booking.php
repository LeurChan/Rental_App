<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'guest_name',    // ✅ Added to match Frontend
        'guest_phone',   // ✅ Added to match Frontend
        'move_in_date',  // ✅ Renamed to match Frontend (was start_date)
        'message',       // ✅ Added
        'status',        // Default is 'pending'
    ];

    // Relationship: A booking belongs to a Property
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
    
    // Note: We removed the 'user' relationship for now 
    // because this is a Guest Booking (no user_id).
}
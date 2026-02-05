<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_id',
        'status',
        'start_date',
        'end_date' // Add this if you use it
    ];

    // Relationship: A booking belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship: A booking belongs to a Property
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
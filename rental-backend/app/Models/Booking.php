<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'property_id', 'start_date', 'status'];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
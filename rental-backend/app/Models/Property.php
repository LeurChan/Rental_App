<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'price', 
        'location', 
        'description', 
        'image_url', 
        'bedrooms',     // ✅
        'bathrooms',    // ✅
        'phone_number', // 👈 Make sure this is added
        'floor_area'    // 👈 Make sure this is added
    ];
}
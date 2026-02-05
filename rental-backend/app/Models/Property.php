<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage; // 👈 Add this

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'price', 'location', 'description', 
        'image_url', 'bedrooms', 'bathrooms', 
        'phone_number', 'floor_area'
    ];

    // 👇 Add this to automatically format the image path
    protected $appends = ['full_image_path'];

    public function getFullImagePathAttribute()
    {
        if (!$this->image_url) {
            return "https://via.placeholder.com/400"; 
        }

        // If it's already a full URL (like http://...), return it
        if (filter_var($this->image_url, FILTER_VALIDATE_URL)) {
            return $this->image_url;
        }

        // Otherwise, link it to your local server storage
        return "http://10.0.2.2:8000/storage/" . $this->image_url;
    }
}

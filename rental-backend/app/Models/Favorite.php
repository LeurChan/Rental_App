<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    // 1. Allow mass assignment for these fields
    protected $fillable = ['user_id', 'property_id'];

    // 2. Link back to the User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 3. Link back to the Property
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
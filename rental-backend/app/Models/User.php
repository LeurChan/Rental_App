<?php

namespace App\Models;

// 👇 1. ADD HasFactory here
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // 👇 2. ADD HasFactory here too
    use HasApiTokens, HasFactory, Notifiable; 

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        'dob',
        'address',
        'role', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

public function favoriteProperties()
{
    // This looks at the 'favorites' table to connect Users to Properties
    return $this->belongsToMany(Property::class, 'favorites');
}
}
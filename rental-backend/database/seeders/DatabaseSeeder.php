<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // 👈 IMPORTANT: This must be here

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the Houses
        $this->call(PropertySeeder::class);

        // 2. Create the ADMIN Account
        User::create([
            'first_name' => 'Super',
            'last_name'  => 'Admin',
            'email'      => 'admin@rental.com',
            'password'   => bcrypt('password123'),
            'role'       => 'admin',
        ]);

        // 3. Create a Normal User
        User::create([
            'first_name' => 'Chan',
            'last_name'  => 'Punleur',
            'email'      => 'user@rental.com',
            'password'   => bcrypt('password123'),
            'role'       => 'user',
        ]);
    }
}
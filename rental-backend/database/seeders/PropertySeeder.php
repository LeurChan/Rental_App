<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \DB::table('properties')->insert([
        [
            'title' => 'Modern Apartment in BKK1',
            'price' => 500,
            'location' => 'BKK1, Phnom Penh',
            'bedrooms' => 2,
            'bathrooms' => 2,
            'description' => 'A beautiful fully furnished apartment in the heart of the city.',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'title' => 'Cozy Studio Near RUPP',
            'price' => 250,
            'location' => 'Tuol Kork, Phnom Penh',
            'bedrooms' => 1,
            'bathrooms' => 1,
            'description' => 'Perfect for students. Walking distance to university.',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'title' => 'Luxury Villa with Pool',
            'price' => 1200,
            'location' => 'Chbar Ampov, Phnom Penh',
            'bedrooms' => 4,
            'bathrooms' => 5,
            'description' => 'Spacious villa perfect for large families.',
            'created_at' => now(),
            'updated_at' => now(),
        ]
    ]);
}
}

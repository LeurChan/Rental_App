<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Optional: Clear old data so you don't get duplicates
        // DB::table('properties')->truncate(); 

        DB::table('properties')->insert([
            [
                'name' => 'Modern Apartment in BKK1',
                'category' => 'Apartment', // 👈 Added Category
                'price' => 500,
                'location' => 'BKK1, Phnom Penh',
                'bedrooms' => 2,
                'bathrooms' => 2,
                'description' => 'A beautiful fully furnished apartment in the heart of the city. Close to cafes and gyms.',
                'image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                'phone_number' => '012 333 444',
                'floor_area' => '85',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cozy Studio Near RUPP',
                'category' => 'Room', // 👈 Added Category
                'price' => 250,
                'location' => 'Tuol Kork, Phnom Penh',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'description' => 'Perfect for students. Walking distance to the university and local markets.',
                'image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
                'phone_number' => '098 777 888',
                'floor_area' => '40',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Luxury Villa with Pool',
                'category' => 'Villa', // 👈 Added Category
                'price' => 1200,
                'location' => 'Chbar Ampov, Phnom Penh',
                'bedrooms' => 4,
                'bathrooms' => 5,
                'description' => 'Spacious villa perfect for large families. Includes a private pool and garden.',
                'image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
                'phone_number' => '011 999 000',
                'floor_area' => '250',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
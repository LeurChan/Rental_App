<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            
            // 1. Required Fields
            $table->string('name'); 
            $table->string('location'); // Now storing "Phnom Penh", etc.
            $table->decimal('price', 10, 2);
            $table->text('description');

            // 2. Image
            $table->string('image_url')->nullable(); 

            // 3. NEW FIELDS (Bed, Bath, Phone, Size)
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->string('phone_number')->nullable(); // 👈 ADD THIS
            $table->string('floor_area')->nullable();   // 👈 ADD THIS (e.g. "80m²")
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
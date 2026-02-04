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
            
            // 1. Required Fields (Your App sends these)
            $table->string('name'); 
            $table->string('location');
            $table->decimal('price', 10, 2);
            $table->text('description');

            // 2. Image Field (Must be 'image_url' to match Controller)
            $table->string('image_url')->nullable(); 

            // 3. Optional Fields (App doesn't send these yet, so they must be nullable)
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
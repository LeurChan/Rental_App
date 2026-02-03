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
            // 👇 Must be 'name' to match your other files
            $table->string('name'); 
            $table->string('location');
            $table->decimal('price', 8, 2);
            
            // 👇 These MUST be here for the error to go away
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            
            $table->text('description');
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
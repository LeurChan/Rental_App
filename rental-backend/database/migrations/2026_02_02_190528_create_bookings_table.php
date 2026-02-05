<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            // Who booked it?
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Which house?
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            
            // Booking Details
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_price', 10, 2);
            $table->string('status')->default('pending'); // pending, approved, rejected
            
            // Contact Info
            $table->string('phone_number')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
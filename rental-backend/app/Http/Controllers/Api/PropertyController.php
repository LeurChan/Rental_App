<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // 👈 Needed for image deletion

class PropertyController extends Controller
{
    // 1. Get All Properties (Home Screen)
    public function index()
    {
        return response()->json(Property::all());
    }

    // 2. Get Single Property (Details Screen)
    public function show($id) 
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        return response()->json($property);
    }

    // 3. Create New Property (Admin Add Screen) 👈 THIS IS NEW
    public function store(Request $request)
    {
        // A. Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'location' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Allow only images
        ]);

        // B. Handle Image Upload
        $imageUrl = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'; // Default Fallback

        if ($request->hasFile('image')) {
            // Save file to 'storage/app/public/properties' folder
            $path = $request->file('image')->store('properties', 'public');
            
            // Create a public URL (e.g., http://localhost:8000/storage/properties/filename.jpg)
            $imageUrl = asset('storage/' . $path);
        }

        // C. Save to Database
        $property = Property::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'location' => $validated['location'],
            'description' => $validated['description'],
            'image_url' => $imageUrl, // Save the URL, not the file itself
        ]);

        return response()->json($property, 201);
    }

    // 4. Delete Property (Admin Manage Screen)
    public function destroy($id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully']);
    }
}
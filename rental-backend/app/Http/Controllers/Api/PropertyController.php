<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    // 1. Get All Properties
    public function index()
    {
        return response()->json(Property::all());
    }

    // 2. Get Single Property
    public function show($id) 
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        return response()->json($property);
    }

    // 3. Create New Property (UPDATED)
    public function store(Request $request)
    {
        // A. Validate incoming data (Added new fields)
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'location' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            
            // 👇 NEW VALIDATION RULES
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'phone_number' => 'nullable|string',
            'floor_area' => 'nullable|string',
        ]);

        // B. Handle Image Upload
        $imageUrl = null; // Default to null if no image

        if ($request->hasFile('image')) {
            // Save just the filename (e.g. properties/abc.jpg)
            // This is cleaner for the database
            $path = $request->file('image')->store('properties', 'public');
            $imageUrl = $path; 
        }

        // C. Save to Database
        $property = Property::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'location' => $validated['location'],
            'description' => $validated['description'],
            'image_url' => $imageUrl, 
            
            // 👇 SAVE NEW FIELDS
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'phone_number' => $request->phone_number,
            'floor_area' => $request->floor_area,
        ]);

        return response()->json($property, 201);
    }

    // 4. Delete Property
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
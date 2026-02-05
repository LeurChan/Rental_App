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

    // 3. Create New Property (UPDATED with Category)
    public function store(Request $request)
    {
        // A. Validate incoming data
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'location' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            
            // 👇 NEW VALIDATION RULES
            'category' => 'nullable|string', // 👈 Added Category
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'phone_number' => 'nullable|string',
            'floor_area' => 'nullable|string',
        ]);

        // B. Handle Image Upload
        $imageUrl = null; 

        if ($request->hasFile('image')) {
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
            'category' => $request->category ?? 'House', // 👈 Saves Category (defaults to House)
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'phone_number' => $request->phone_number,
            'floor_area' => $request->floor_area,
        ]);

        return response()->json($property, 201);
    }

    // 4. Delete Property
    // app/Http/Controllers/Api/PropertyController.php

public function destroy($id)
{
    $property = Property::find($id);

    if (!$property) {
        return response()->json(['status' => false, 'message' => 'Property not found'], 404);
    }

    // Optional: Delete the image file from storage if it exists
    if ($property->image_url) {
        Storage::disk('public')->delete($property->image_url);
    }

    $property->delete();

    return response()->json([
        'status' => true, 
        'message' => 'Property deleted successfully'
    ]);
}

    // 5. Update Existing Property
    public function update(Request $request, $id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'location' => 'required|string',
            'description' => 'required|string',
            
            // 👇 Allow updating category too
            'category' => 'nullable|string', 
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'floor_area' => 'nullable|string',
        ]);

        $property->update($validated);

        return response()->json(['message' => 'Property updated successfully', 'data' => $property]);
    }
}
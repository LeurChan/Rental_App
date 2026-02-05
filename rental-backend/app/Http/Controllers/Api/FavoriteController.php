<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Favorite; // 👈 1. Crucial: You must import the Model

class FavoriteController extends Controller
{
    // 2. This method is for the Heart Toggle logic
    public function toggleFavorite(Request $request)
    {
        $user = $request->user();
        $propertyId = $request->property_id;

        // Check if the property is already favorited
        $exists = Favorite::where('user_id', $user->id)
                          ->where('property_id', $propertyId)
                          ->first();

        if ($exists) {
            $exists->delete(); // Remove from favorites
            return response()->json(['status' => true, 'is_favorite' => false]);
        }

        // Add to favorites
        Favorite::create([
            'user_id' => $user->id,
            'property_id' => $propertyId
        ]);

        return response()->json(['status' => true, 'is_favorite' => true]);
    }

    // 3. This method allows the app to stay "Red" after reload
    public function getUserFavorites(Request $request)
    {
        // Returns just an array of IDs: [1, 4, 10]
        $favoriteIds = Favorite::where('user_id', $request->user()->id)
                               ->pluck('property_id');

        return response()->json($favoriteIds);
    }
    public function index(Request $request)
{
    // Returns all properties favorited by the logged-in user
    return response()->json($request->user()->favoriteProperties);
}
}
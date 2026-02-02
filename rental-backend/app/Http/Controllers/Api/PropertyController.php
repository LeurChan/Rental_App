<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index()
    {
        // Fetch all properties from database
        return response()->json(Property::all());
    }

    public function show($id) {
    return Property::find($id);
}
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Handle user registration for the House Rental System.
     */
    public function register(Request $request)
    {
        // 1. Validate the incoming data from React Native
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            // Adding validation for your extra fields
            'dob' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false, 
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Handle the ID Card image upload
        $imagePath = null;
        if ($request->hasFile('id_card')) {
            $imagePath = $request->file('id_card')->store('id_cards', 'public');
        }

        // 3. Create the user and satisfy the 'name' requirement
        $user = User::create([
    'name' => $request->first_name . ' ' . $request->last_name, // 👈 THIS LINE IS REQUIRED
    'first_name' => $request->first_name,
    'last_name' => $request->last_name,
    'email' => $request->email,
    'password' => Hash::make($request->password),
    'dob' => $request->dob,
    'address' => $request->address,
    'id_card_path' => $imagePath,
]);

        // 4. Return the token for immediate login after registration
        return response()->json([
            'status' => true,
            'message' => 'User registered successfully',
            'token' => $user->createToken('auth_token')->plainTextToken
        ]);
    }

    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'status' => false, 
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        
        return response()->json([
            'status' => true,
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user
        ]);
    }
}
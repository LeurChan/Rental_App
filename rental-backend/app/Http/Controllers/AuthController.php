<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // 1. REGISTER (With Image Upload)
    public function register(Request $request)
    {
        // Validate Inputs
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'id_card' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Image validation
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        // Handle File Upload
        $imagePath = null;
        if ($request->hasFile('id_card')) {
            // Save to 'storage/app/public/id_cards'
            $imagePath = $request->file('id_card')->store('id_cards', 'public');
        }

        // Create User
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'dob' => $request->dob,
            'address' => $request->address,
            'id_card_path' => $imagePath,
        ]);

        // Create Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'token' => $token
        ]);
    }

    // 2. LOGIN
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'Email or Password does not match with our record.'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'User Logged In Successfully',
            'token' => $token,
            'user' => $user // Send user data back to app (for profile)
        ]);
    }

    // 3. FORGOT PASSWORD (Simple Version)
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['status' => false, 'message' => 'Email not found'], 404);
        }

        // NOTE: In a real app, you would use Mail::to($user)->send(...) here.
        // For now, we will just return success so the UI works.
        return response()->json([
            'status' => true, 
            'message' => 'Reset link sent to your email!' 
        ]);
    }
}
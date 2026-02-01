<?php

namespace App\Http\Controllers; // <--- Note: No "\Api" here

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // --- REGISTER ---
    public function register(Request $request) {
        // 1. Validate
        $validator = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'id_card' => 'required|image' // Must be an image
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        // 2. Handle Image Upload
        $imagePath = null;
        if ($request->hasFile('id_card')) {
            $imagePath = $request->file('id_card')->store('id_cards', 'public');
        }

        // 3. Create User
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'dob' => $request->dob,
            'address' => $request->address,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'id_card_path' => $imagePath,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'User registered successfully',
            'user' => $user
        ]);
    }

    // --- LOGIN ---
    public function login(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false, 
                'message' => 'Invalid login details'
            ], 401);
        }

        return response()->json([
            'status' => true,
            'message' => 'Login success',
            'user' => Auth::user()
        ]);
    }
}
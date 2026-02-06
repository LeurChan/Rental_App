<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // 1. REGISTER (Matches your Migration)
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            // 'address' and 'dob' are optional, so we don't strictly validate them
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()->first()], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'address' => $request->address,       // ✅ Added back
            'dob' => $request->dob,               // ✅ Added back
            'phone_number' => $request->phone_number, // ✅ Added back
            'role' => 'user'
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Account Created',
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user
        ]);
    }

    // 2. LOGIN
    public function login(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['status' => false, 'message' => 'Invalid email or password'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => 'Login Successful',
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
            'role' => $user->role // 👈 Sends role to App
        ]);
    }
    public function updateContact(Request $request)
{
    // 1. Get the authenticated user via Sanctum
    $user = $request->user(); 

    // 2. Validate the input
    $request->validate([
        'email' => 'nullable|email|unique:users,email,' . $user->id,
        'phone_number' => 'nullable|string',
    ]);

    // 3. Perform the update on the $user object
    // This triggers the UPDATE query for the specific user ID
    $user->update([
        'email' => $request->email ?? $user->email,
        'phone_number' => $request->phone_number ?? $user->phone_number,
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Profile updated successfully',
        'user' => $user
    ]);
}
public function changePassword(Request $request)
    {
        // 1. Validation - Field names MUST match the frontend keys
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:8|confirmed', // looks for new_password_confirmation
        ]);

        $user = Auth::user();

        // 2. Verify Old Password
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'The current password you entered is incorrect.'
            ], 401);
        }

        // 3. Update Password
        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Password changed successfully!'
        ]);
    }
}
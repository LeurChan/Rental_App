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
    // Handle Registration
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        return response()->json(['status' => true, 'token' => $user->createToken('auth_token')->plainTextToken]);
    }

    // Handle Login
    public function login(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['status' => false, 'message' => 'Invalid login details'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        return response()->json(['status' => true, 'token' => $user->createToken('auth_token')->plainTextToken, 'user' => $user]);
    }

    // Update Email and Phone Number
    public function updateContact(Request $request) {
        $user = Auth::user();
        $user->update($request->only(['email', 'phone_number']));
        return response()->json(['status' => true, 'user' => $user, 'message' => 'Contact updated']);
    }

    // Secure Password Change
    public function changePassword(Request $request) {
        $request->validate(['current_password' => 'required', 'new_password' => 'required|min:6|confirmed']);
        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['status' => false, 'message' => 'Incorrect current password'], 400);
        }

        $user->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['status' => true, 'message' => 'Password updated']);
    }
}
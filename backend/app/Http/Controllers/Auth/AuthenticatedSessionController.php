<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class AuthenticatedSessionController extends Controller
{
    #[OA\Post(
        path: '/api/login',
        summary: 'Login user',
        tags: ['Authentication'],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (! $user->email_verified_at) {
            return response()->json([
                'message' => 'Email not verified. Please verify your email first.',
            ], 403);
        }

        $token = $user->createToken(
            'api-token',
            ['*'],
            $request->remember ? now()->addDays(30) : null
        )->plainTextToken;

        return response()->json([
            'user' => new UserResource($user->load('activeSubscription')),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    #[OA\Delete(
        path: '/api/logout',
        summary: 'Logout user (revoke current token)',
        tags: ['Authentication'],
        security: [['sanctum' => []]],
    )]
    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    #[OA\Put(
        path: '/api/user/profile',
        summary: 'Update user profile',
        tags: ['Authentication'],
        security: [['sanctum' => []]],
    )]
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
            $user->email_verified_at = null; // Require re-verification on email change
        }

        $user->save();

        return response()->json([
            'user' => new UserResource($user->load('activeSubscription')),
            'message' => 'Profile updated successfully',
        ]);
    }
}

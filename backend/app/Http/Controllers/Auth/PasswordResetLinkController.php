<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class PasswordResetLinkController extends Controller
{
    #[OA\Post(
        path: '/api/forgot-password',
        summary: 'Send password reset link',
        tags: ['Authentication'],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email.',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}
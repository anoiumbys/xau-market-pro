<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AdminUserController extends Controller
{
    #[OA\Get(
        path: '/api/admin/users',
        summary: 'List all users (admin)',
        tags: ['Admin - Users'],
        security: [['sanctum' => []]],
    )]
    public function index(Request $request)
    {
        $query = User::with('activeSubscription')->latest();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->integer('per_page', 20));

        return UserResource::collection($users);
    }

    #[OA\Get(
        path: '/api/admin/users/{id}',
        summary: 'Get user details (admin)',
        tags: ['Admin - Users'],
        security: [['sanctum' => []]],
    )]
    public function show(string $id)
    {
        $user = User::with(['activeSubscription', 'priceAlerts', 'tradeJournals', 'subscriptions'])->findOrFail($id);
        return new UserResource($user);
    }

    #[OA\Put(
        path: '/api/admin/users/{id}',
        summary: 'Update user (admin)',
        tags: ['Admin - Users'],
        security: [['sanctum' => []]],
    )]
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'email_verified_at' => ['nullable', 'date'],
        ]);

        $user->update($request->only(['name', 'email', 'email_verified_at']));

        return new UserResource($user->refresh());
    }

    #[OA\Put(
        path: '/api/admin/users/{id}/role',
        summary: 'Update user role (admin)',
        tags: ['Admin - Users'],
        security: [['sanctum' => []]],
    )]
    public function updateRole(Request $request, string $id)
    {
        $request->validate([
            'role' => ['required', 'string', 'in:guest,trader,admin'],
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return new UserResource($user->refresh());
    }

    #[OA\Put(
        path: '/api/admin/users/{id}/ban',
        summary: 'Ban user (admin)',
        tags: ['Admin - Users'],
        security: [['sanctum' => []]],
    )]
    public function ban(string $id)
    {
        $user = User::findOrFail($id);
        $user->update(['role' => 'guest']);

        // Revoke all tokens
        $user->tokens()->delete();

        return response()->json(['message' => 'User banned successfully']);
    }

    #[OA\Put(
        path: '/api/admin/users/{id}/unban',
        summary: 'Unban user (admin)',
        tags: ['Admin - Users'],
        security: [['sanctum' => []]],
    )]
    public function unban(string $id)
    {
        $user = User::findOrFail($id);
        $user->update(['role' => 'trader']);

        return response()->json(['message' => 'User unbanned successfully']);
    }

    #[OA\Delete(
        path: '/api/admin/users/{id}',
        summary: 'Delete user (admin)',
        tags: ['Admin - Users'],
        security: [['sanctum' => []]],
    )]
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting self
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete yourself'], 422);
        }

        $user->delete();

        return response()->noContent();
    }
}
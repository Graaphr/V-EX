<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Cek apakah sudah login
        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
            ], 401);
        }

        // Cek apakah role user termasuk yang diizinkan
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'status'        => 'error',
                'message'       => 'Akses ditolak. Anda tidak memiliki izin.',
                'role_anda'     => $user->role,
                'role_required' => $roles,
            ], 403);
        }

        return $next($request);
    }
}
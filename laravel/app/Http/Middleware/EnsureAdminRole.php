<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class EnsureAdminRole
{
    /**
     * Handle incoming request to verify user has admin or operator role.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            Log::warning('Unauthorized access attempt to protected route', [
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated. Valid Bearer Token required.',
                'code' => 401
            ], 401);
        }

        $allowedRoles = ! empty($roles) ? $roles : ['admin', 'operator'];

        if (! in_array($user->role, $allowedRoles)) {
            Log::warning('Forbidden access attempt: insufficient permissions', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'required_roles' => $allowedRoles,
                'ip' => $request->ip(),
                'url' => $request->fullUrl()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Forbidden: You do not have sufficient permissions to perform this operation.',
                'code' => 403
            ], 403);
        }

        return $next($request);
    }
}

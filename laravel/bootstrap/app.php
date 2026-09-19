<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Global API Middleware
        $middleware->api(prepend: [
            \App\Http\Middleware\SecurityHeaders::class,
            \App\Http\Middleware\SanitizeInput::class,
        ]);

        // Custom Middleware Aliases
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureAdminRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Unified secure JSON error responses for API routes (No stack traces leaked!)
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Input validation failed',
                    'errors' => $e->errors(),
                    'code' => 422
                ], 422);
            }
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthenticated: Valid Sanctum Bearer Token is required',
                    'code' => 401
                ], 401);
            }
        });

        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Access Denied: Insufficient permissions',
                    'code' => 403
                ], 403);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Requested resource not found',
                    'code' => 404
                ], 404);
            }
        });

        $exceptions->render(function (TooManyRequestsHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Rate limit exceeded. Too many requests. Please retry later.',
                    'retry_after_seconds' => $e->getHeaders()['Retry-After'] ?? 60,
                    'code' => 429
                ], 429);
            }
        });

        // Catch-all server error handler: Never expose SQL / file path stack traces to client
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                $errorRef = 'ERR-' . strtoupper(substr(md5(uniqid()), 0, 8));
                
                // Structured server-side logging for diagnostics
                Log::error("Unhandled API Exception [{$errorRef}]: " . $e->getMessage(), [
                    'reference' => $errorRef,
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'url' => $request->fullUrl(),
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent()
                ]);

                // Safe output to client
                $isDebug = config('app.debug', false);
                return response()->json([
                    'status' => 'error',
                    'message' => $isDebug ? $e->getMessage() : 'An internal server error occurred. Our operations team has been notified.',
                    'reference_code' => $errorRef,
                    'code' => 500
                ], 500);
            }
        });
    })->create();

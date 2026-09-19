<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'app' => 'Holiday Travelers Travel and Tours API',
        'message' => 'Backend API is up and running!',
        'api_version' => 'v1',
        'endpoints' => [
            'packages' => url('/api/v1/packages'),
            'feedbacks' => url('/api/v1/feedbacks'),
            'auth_login' => url('/api/v1/auth/login'),
            'auth_register' => url('/api/v1/auth/register'),
        ]
    ]);
});

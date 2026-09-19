@echo off
echo ===================================================
echo   Starting Holiday Travelers Travel and Tours App
echo ===================================================
echo.

if not exist .env (
    echo [.env file missing] Copying .env.example...
    copy .env.example .env
    php artisan key:generate
)

echo Starting Laravel Backend API on http://127.0.0.1:8000 ...
php artisan serve --port=8000

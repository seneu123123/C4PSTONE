@echo off
cd /d "%~dp0"
echo ===================================================
echo   Holiday Travelers - Fresh Setup Script
echo ===================================================
echo.

echo 1. Installing Composer packages...
call composer install

if not exist .env (
    echo 2. Setting up .env...
    copy .env.example .env
    call php artisan key:generate
)

echo 3. Optimizing autoloader...
call composer dump-autoload -o

echo 4. Running migrations and seeders...
call php artisan migrate:fresh --seed

echo 5. Clearing cache...
call php artisan config:clear

echo.
echo Setup Complete! Starting Laravel API on http://127.0.0.1:8000 ...
call php artisan serve --port=8000

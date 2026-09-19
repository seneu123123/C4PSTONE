@echo off
rem Ensure script executes from the directory where this batch file is located
cd /d "%~dp0"

echo ===================================================
echo   Holiday Travelers - Starting Full Stack App
echo ===================================================
echo.

rem Check if node_modules exists for frontend
if not exist "node_modules\" (
    echo [Frontend] Installing Node dependencies...
    call npm install
)

rem Check if laravel\.env exists
if not exist "laravel\.env" (
    echo [Backend] Setting up Laravel .env...
    copy "laravel\.env.example" "laravel\.env"
    cd laravel
    call php artisan key:generate
    cd /d "%~dp0"
)

echo.
echo Starting Laravel Backend API in a new window...
start "Laravel API (Port 8000)" cmd /k "cd /d "%~dp0laravel" && php artisan serve --port=8000"

echo Starting React Frontend Dev Server...
call npm run dev

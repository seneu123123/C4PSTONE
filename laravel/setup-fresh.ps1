$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Holiday Travelers - Fresh Setup Script" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Installing Composer packages..." -ForegroundColor Yellow
composer install

if (-not (Test-Path ".env")) {
    Write-Host "2. Setting up .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    php artisan key:generate
}

Write-Host "3. Optimizing autoloader..." -ForegroundColor Yellow
composer dump-autoload -o

Write-Host "4. Running migrations and seeders..." -ForegroundColor Yellow
php artisan migrate:fresh --seed

Write-Host "5. Clearing cache..." -ForegroundColor Yellow
php artisan config:clear

Write-Host ""
Write-Host "Setup Complete! Starting Laravel API on http://127.0.0.1:8000 ..." -ForegroundColor Green
php artisan serve --port=8000

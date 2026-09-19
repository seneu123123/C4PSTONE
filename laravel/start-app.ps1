$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Holiday Travelers Travel & Tours API" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path ".env")) {
    Write-Host "[.env file missing] Copying .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    php artisan key:generate
}

Write-Host "Starting Laravel Backend API on http://127.0.0.1:8000 ..." -ForegroundColor Green
php artisan serve --port=8000

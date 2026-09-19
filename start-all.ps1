# Set current directory to the directory where this script resides
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Holiday Travelers - Starting Full Stack App" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Check frontend node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[Frontend] Installing Node dependencies..." -ForegroundColor Yellow
    npm install
}

# Check Laravel .env
if (-not (Test-Path "laravel\.env")) {
    Write-Host "[Backend] Setting up Laravel .env..." -ForegroundColor Yellow
    Copy-Item "laravel\.env.example" "laravel\.env"
    Set-Location "$PSScriptRoot\laravel"
    php artisan key:generate
    Set-Location $PSScriptRoot
}

Write-Host ""
Write-Host "Starting Laravel Backend API in a new window..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k ""cd /d `"$PSScriptRoot\laravel`" && php artisan serve --port=8000"""

Write-Host "Starting React Frontend Dev Server..." -ForegroundColor Green
npm run dev

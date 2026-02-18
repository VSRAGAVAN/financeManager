# Finance Manager API - Start Server

Write-Host "🚀 Starting Finance Manager API..." -ForegroundColor Green
Write-Host ""

# Kill any existing nodemon processes
Write-Host "📋 Stopping any existing server instances..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*nodemon*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Navigate to the correct directory
Set-Location C:\Ragavan\Nammatha\backend\prisma

Write-Host "✓ Directory: $(Get-Location)" -ForegroundColor Green
Write-Host "✓ Environment variables loaded from .env" -ForegroundColor Green
Write-Host ""
Write-Host "Starting server on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Start the server
npx nodemon src/server.js

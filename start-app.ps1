Write-Host "====================================" -ForegroundColor Cyan
Write-Host " LeetCode Anki Application Launcher" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Navigating to project directory..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

Write-Host "Checking if npm is available..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm found! Version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not found! Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

Write-Host "Checking for existing servers..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) existing Node.js server(s). Stopping them..." -ForegroundColor Yellow
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "Existing servers stopped." -ForegroundColor Green
} else {
    Write-Host "No existing servers found." -ForegroundColor Green
}
Write-Host ""

Write-Host "Building React app..." -ForegroundColor Yellow
Set-Location "client"
try {
    npm run build
    Write-Host "Build complete!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Set-Location ".."
Write-Host ""

Write-Host "Starting server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Server starting... Browser will open soon" -ForegroundColor Cyan
Write-Host " URL: http://localhost:3001" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Start the server in background
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "start"

# Wait a moment for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# Open browser
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:3001"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " LeetCode Anki is now running!" -ForegroundColor Green
Write-Host " Browser opened to: http://localhost:3001" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "- Closing the browser does NOT stop the server" -ForegroundColor Yellow
Write-Host "- The server will keep running in this window" -ForegroundColor Yellow
Write-Host "- To stop the server, press ANY KEY here" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to stop the server..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop the server
Write-Host ""
Write-Host "Stopping server..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Write-Host "Server stopped. Application closed." -ForegroundColor Green
Read-Host "Press Enter to exit" 
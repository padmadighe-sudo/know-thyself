@echo off
echo ========================================
echo  Know Yourself 2 - Starting Server...
echo ========================================
echo.
echo The app will open in your default browser.
echo Keep this window open while using the app.
echo.
echo Press Ctrl+C to stop the server when done.
echo ========================================
echo.

cd /d "%~dp0"

rem Start PowerShell web server with proper Content-Type headers
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"

echo.
echo Server stopped.
pause

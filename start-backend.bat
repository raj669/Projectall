@echo off
REM Backend Auto-Starter Batch File
REM This will install dependencies and start the backend server

echo.
echo ========================================
echo  NepalEstates Backend Auto-Starter
echo ========================================
echo.

echo Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo Starting backend setup and launch...
echo.

cd /d "%~dp0"
node start-backend.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error starting backend
    echo.
    echo Try running manually:
    echo   cd backend
    echo   npm install
    echo   npm run dev
    echo.
    pause
    exit /b 1
)

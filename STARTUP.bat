@echo off
REM NepalEstates - Complete Startup Script
REM This script starts everything in the correct order

setlocal enabledelayedexpansion

echo.
echo ========================================
echo  NepalEstates - Full Startup
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Please install from: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Start MongoDB
echo.
echo [1/3] Checking MongoDB...
sc query MongoDB >nul 2>nul
if %errorlevel% equ 0 (
    sc query MongoDB | find "RUNNING" >nul 2>nul
    if %errorlevel% neq 0 (
        echo Starting MongoDB...
        net start MongoDB >nul 2>nul
        if %errorlevel% equ 0 (
            echo ✅ MongoDB started
        ) else (
            echo ⚠️  Could not start MongoDB (may already be running)
        )
    ) else (
        echo ✅ MongoDB is running
    )
    timeout /t 2 >nul
) else (
    echo ⚠️  MongoDB service not detected
    echo Please ensure MongoDB is running or installed
    echo Download: https://www.mongodb.com/try/download/community
)

REM Start Backend
echo.
echo [2/3] Starting Backend Server...
echo Opening new terminal for backend...
start "NepalEstates Backend" cmd /k "cd /d "%~dp0backend" && npm install --silent && echo. && echo ✅ Backend server starting... && echo. && npm run dev"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend
echo.
echo [3/3] Starting Frontend...
echo Opening new terminal for frontend...
start "NepalEstates Frontend" cmd /k "cd /d "%~dp0" && echo. && echo ✅ Frontend server starting... && echo. && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo ✅ All services starting!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3000
echo 💾 MongoDB:  localhost:27017
echo.
echo 🌐 Opening http://localhost:5173/register in browser...
timeout /t 3 /nobreak >nul

REM Try to open browser
start http://localhost:5173/register

echo.
echo ✅ Setup complete!
echo.
echo Keep these terminals open while testing:
echo   - Backend Terminal (black window)
echo   - Frontend Terminal (black window)
echo.
echo To stop everything:
echo   - Close both terminals
echo   - Or press Ctrl+C in each
echo.
pause

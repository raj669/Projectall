@echo off
REM Quick Start Script for NepalEstates Real Estate App
REM This script starts both backend and frontend

echo.
echo ========================================
echo  NepalEstates - Real Estate App
echo  Quick Start Script
echo ========================================
echo.

echo [1/3] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo [2/3] Starting Backend Server...
echo ⏳ Opening backend in new terminal...
start cmd /k "cd backend && npm install && npm run dev"

echo.
echo [3/3] Starting Frontend...
echo ⏳ Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak

echo.
echo Checking MongoDB...
echo Note: If MongoDB is not running, the backend will fail to connect.
echo To start MongoDB on Windows:
echo   - net start MongoDB
echo   - Or start MongoDB manually
echo.

echo Starting frontend server...
npm run dev

echo.
echo ========================================
echo  ✅ Setup Complete!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3000
echo 🌐 Health:   http://localhost:3000/api/health
echo.
echo 📝 To register:
echo    1. Go to http://localhost:5173/register
echo    2. Enter name, email, and strong password
echo    3. Password must have: uppercase, lowercase, number, special char
echo.
echo 🔑 To login:
echo    1. Go to http://localhost:5173/login
echo    2. Email will be pre-filled from last registration
echo    3. Enter password and click Sign In
echo.
echo 🆘 Issues?
echo    - Check TROUBLESHOOTING_AUTH.md
echo    - Check BACKEND_SETUP.md
echo    - Ensure MongoDB is running
echo.
echo ========================================

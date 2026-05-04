@echo off
REM MongoDB Auto-Starter for Windows
REM This script checks if MongoDB is running and starts it if needed

echo.
echo ========================================
echo  MongoDB Auto-Starter
echo ========================================
echo.

REM Check if MongoDB service exists
sc query MongoDB >nul 2>nul
if %errorlevel% equ 0 (
    REM MongoDB service exists, check if running
    sc query MongoDB | find "RUNNING" >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ MongoDB is already running
        exit /b 0
    ) else (
        echo Starting MongoDB service...
        net start MongoDB
        if %errorlevel% equ 0 (
            echo ✅ MongoDB started successfully
            timeout /t 2 >nul
            exit /b 0
        ) else (
            echo ❌ Failed to start MongoDB
            echo You may need admin privileges
            exit /b 1
        )
    )
) else (
    echo ❌ MongoDB service not found
    echo.
    echo Options:
    echo 1. Install MongoDB Community Edition from: https://www.mongodb.com/try/download/community
    echo 2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
    echo.
    exit /b 1
)

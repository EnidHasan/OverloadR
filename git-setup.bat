@echo off
echo ========================================
echo Git Repository Setup for OverloadR
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [1/6] Initializing Git repository...
git init
if errorlevel 1 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)

echo.
echo [2/6] Adding all files to staging...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo [3/6] Creating initial commit...
git commit -m "Initial commit: OverloadR Workout Tracker App"
if errorlevel 1 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)

echo.
echo [4/6] Creating main branch...
git branch -M main
if errorlevel 1 (
    echo ERROR: Failed to create main branch
    pause
    exit /b 1
)

echo.
echo ========================================
echo Repository initialized successfully!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Create a new repository on GitHub (github.com/new)
echo.
echo 2. Run these commands (replace YOUR-USERNAME and YOUR-REPO):
echo    git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
echo    git push -u origin main
echo.
echo Or use:
echo    git remote add origin git@github.com:YOUR-USERNAME/YOUR-REPO.git
echo    git push -u origin main
echo.
pause

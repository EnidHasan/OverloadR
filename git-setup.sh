#!/bin/bash

echo "========================================"
echo "Git Repository Setup for OverloadR"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed"
    echo "Please install Git from https://git-scm.com/"
    exit 1
fi

echo "[1/6] Initializing Git repository..."
git init
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to initialize git repository"
    exit 1
fi

echo ""
echo "[2/6] Adding all files to staging..."
git add .
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to add files"
    exit 1
fi

echo ""
echo "[3/6] Creating initial commit..."
git commit -m "Initial commit: OverloadR Workout Tracker App"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create commit"
    exit 1
fi

echo ""
echo "[4/6] Creating main branch..."
git branch -M main
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create main branch"
    exit 1
fi

echo ""
echo "========================================"
echo "Repository initialized successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Create a new repository on GitHub (github.com/new)"
echo ""
echo "2. Run these commands (replace YOUR-USERNAME and YOUR-REPO):"
echo "   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git"
echo "   git push -u origin main"
echo ""
echo "Or use:"
echo "   git remote add origin git@github.com:YOUR-USERNAME/YOUR-REPO.git"
echo "   git push -u origin main"
echo ""

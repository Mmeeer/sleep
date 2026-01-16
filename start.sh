#!/bin/bash

# SleepWell - Start Script

echo "🌙 Starting SleepWell Server..."
echo ""

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and set your admin password!"
    echo ""
fi

echo "✨ Server starting on http://localhost:3000"
echo "📱 Main site: http://localhost:3000"
echo "🔐 Admin panel: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start

#!/bin/bash

# Railway deployment script for Task Manager
echo "🚀 Starting Task Manager Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the server
echo "⚡ Starting server..."
npm start
#!/bin/bash

# Navigate to the application directory
cd "$(dirname "$0")"

# Kill any existing instances running on port 3000, 3001, or 3002
lsof -i :3000 -t | xargs kill -9 2>/dev/null || true
lsof -i :3001 -t | xargs kill -9 2>/dev/null || true
lsof -i :3002 -t | xargs kill -9 2>/dev/null || true

# Start the application and automatically respond "y" to port prompts
echo "Starting Mortgage Refinance Calculator..."
echo "y" | npm start

# Keep the terminal window open
exec $SHELL 
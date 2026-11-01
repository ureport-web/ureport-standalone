#!/bin/sh
set -e
echo "Running initialization..."
node /app/initialize.js
echo "Starting ureport..."
exec npm start

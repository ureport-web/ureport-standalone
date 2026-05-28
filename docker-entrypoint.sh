#!/bin/sh
set -e
echo "Running initialization..."
node /opt/ureport/initialize.js
echo "Starting ureport..."
exec npm start

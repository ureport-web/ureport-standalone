#!/bin/sh
set -e
echo "Running initialization..."
node /app/initialize.js

# Test/e2e stacks seed on start so the dataset is never stale (the Overview only
# looks back 7 days). Off by default; never set in the shipped compose file.
if [ "$UREPORT_SEED_ON_START" = "true" ]; then
  echo "Seeding demo data (UREPORT_SEED_ON_START=true)..."
  npm run seed:demo:auto
fi

echo "Starting ureport..."
exec npm start

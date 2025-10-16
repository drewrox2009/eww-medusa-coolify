#!/bin/bash

echo "Running seed script..."

# Run the seed script
node /app/medusa/.medusa/server/src/scripts/seed.js

echo "Seed script completed."

# Start the application
echo "Starting Medusa application..."
yarn start
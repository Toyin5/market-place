#!/bin/sh
set -e

echo "Applying Prisma migrations..."
npx prisma migrate deploy

if [ "${SEED_ON_STARTUP:-true}" = "true" ]; then
  echo "Checking whether initial seed data is needed..."
  npm run db:seed:startup
else
  echo "Skipping startup seed because SEED_ON_STARTUP is disabled."
fi

echo "Starting API server..."
exec node dist/src/server.js

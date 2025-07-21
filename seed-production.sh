#!/bin/bash

# Production Database Seeding Script
# This script seeds the production database after deployment

echo "🌱 Starting production database seeding..."

# Wait for server to be fully deployed and ready
echo "⏳ Waiting 60 seconds for server to be ready..."
sleep 60

# Run the seeding command on Railway
echo "🚀 Running database seeding on production server..."
railway run --service server -- npm run db:seed

if [ $? -eq 0 ]; then
    echo "✅ Production database seeding completed successfully!"
else
    echo "❌ Production database seeding failed!"
    exit 1
fi

echo "🎉 Production deployment and seeding complete!"

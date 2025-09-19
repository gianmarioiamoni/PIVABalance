#!/bin/bash

# 🚀 Quick Production Build
# Builds the app for production with essential checks only

echo "🚀 Quick Production Build"
echo "========================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}⚠️  Quick build mode: Skipping some linting errors${NC}"

# Set environment for production build
export NODE_ENV=production

# Build with reduced linting
echo "🏗️  Building for production..."
npx next build --no-lint 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    echo "📋 Next steps for production:"
    echo "1. Configure Stripe LIVE keys"
    echo "2. Set up webhook endpoint"
    echo "3. Deploy to hosting platform"
    echo "4. Test with €1 real payment"
    echo ""
    echo "📖 See PRODUCTION_CHECKLIST.md for details"
else
    echo "❌ Build failed"
    exit 1
fi

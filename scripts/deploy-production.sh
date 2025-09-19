#chmod +x scripts/fix-eslint-comprehensive.js && node scripts/fix-eslint-comprehensive.js!/bin/bash

# 🚀 PIVABalance - Production Deploy Script
# Quick deployment script for going live with donations

echo "🚀 PIVABalance Production Deployment"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment Checklist:${NC}"
echo "1. ✅ Stripe LIVE keys configured"
echo "2. ✅ Webhook endpoint set up"
echo "3. ✅ Environment variables ready"
echo "4. ✅ Database connection tested"
echo ""

read -p "🤔 Have you completed all the above? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Please complete the checklist first. See PRODUCTION_CHECKLIST.md${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"

# Check for required environment variables
echo "📋 Checking environment variables..."
if [ -z "$STRIPE_SECRET_KEY" ] || [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
    echo -e "${YELLOW}⚠️  Stripe environment variables not set. Make sure to configure them in your hosting platform.${NC}"
fi

if [ -z "$MONGODB_URI" ]; then
    echo -e "${YELLOW}⚠️  MongoDB URI not set. Make sure to configure it in your hosting platform.${NC}"
fi

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Linting failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Build the project
echo -e "${BLUE}🏗️  Building project...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Git status check
echo -e "${BLUE}📝 Checking git status...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes. Commit them first:${NC}"
    git status --short
    read -p "🤔 Do you want to commit and push now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "📝 Enter commit message: " commit_message
        git commit -m "$commit_message"
        git push origin main
    else
        echo -e "${YELLOW}⚠️  Please commit your changes manually before deploying.${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}🚀 Deployment Options:${NC}"
echo "1. Vercel (Recommended)"
echo "2. Railway" 
echo "3. Digital Ocean"
echo "4. Manual deployment"
echo ""

read -p "Choose deployment method (1-4): " -n 1 -r deploy_method
echo

case $deploy_method in
    1)
        echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo -e "${YELLOW}⚠️  Vercel CLI not installed. Install with: npm i -g vercel${NC}"
            echo "Or deploy via GitHub integration at https://vercel.com"
        fi
        ;;
    2)
        echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
        if command -v railway &> /dev/null; then
            railway up
        else
            echo -e "${YELLOW}⚠️  Railway CLI not installed. Install with: npm i -g @railway/cli${NC}"
            echo "Or deploy via GitHub integration at https://railway.app"
        fi
        ;;
    3)
        echo -e "${BLUE}🚀 Digital Ocean deployment...${NC}"
        echo "Deploy via GitHub integration at https://cloud.digitalocean.com/apps"
        ;;
    4)
        echo -e "${BLUE}📋 Manual deployment checklist:${NC}"
        echo "1. Upload files to your server"
        echo "2. Set environment variables"
        echo "3. Run: npm ci --production"
        echo "4. Run: npm run build"
        echo "5. Start: npm start"
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment initiated!${NC}"
echo ""
echo -e "${BLUE}📋 Post-deployment checklist:${NC}"
echo "1. 🔗 Configure Stripe webhook URL with your domain"
echo "2. 🧪 Test with €1 real payment"
echo "3. 📊 Monitor Stripe dashboard for first payments"
echo "4. 📧 Check webhook logs for confirmations"
echo "5. 🔍 Monitor application logs for errors"
echo ""
echo -e "${YELLOW}📖 For detailed instructions, see: PRODUCTION_CHECKLIST.md${NC}"
echo ""
echo -e "${GREEN}🚀 Good luck with your launch! 🎊${NC}"

#!/usr/bin/env node

/**
 * Environment Setup Script for P.IVA Balance
 * 
 * This script helps developers set up their environment variables
 * by creating a .env file with the necessary configuration.
 * 
 * Usage: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class EnvironmentSetup {
    constructor() {
        this.envPath = path.join(process.cwd(), '.env');
        this.envLocalPath = path.join(process.cwd(), '.env.local');
    }

    /**
     * Generate a secure JWT secret
     */
    generateJWTSecret() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Create the environment file content
     */
    createEnvContent(options = {}) {
        const jwtSecret = options.jwtSecret || this.generateJWTSecret();
        const mongoUri = options.mongoUri || 'mongodb://localhost:27017/p-iva-balance';
        const appUrl = options.appUrl || 'http://localhost:3000';
        const nodeEnv = options.nodeEnv || 'development';

        return `# ===============================================
# P.IVA Balance - Environment Configuration
# ===============================================
# Generated on: ${new Date().toISOString()}
# 
# This file contains all environment variables needed for the PIVABalance application.
# 
# ⚠️  SECURITY WARNING: Never commit this file to version control with real values!
# ===============================================

# ===============================================
# APPLICATION ENVIRONMENT
# ===============================================
# Set to 'development' for local development, 'production' for production
NODE_ENV=${nodeEnv}

# Public URL of the application (required for CORS, redirects, etc.)
# For development: http://localhost:3000
# For production: https://your-domain.com
NEXT_PUBLIC_APP_URL=${appUrl}

# ===============================================
# DATABASE CONFIGURATION
# ===============================================
# MongoDB connection string (required)
# Local development: mongodb://localhost:27017/p-iva-balance
# Docker: mongodb://mongo:27017/p-iva-balance
# MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/p-iva-balance
MONGODB_URI=${mongoUri}

# Optional MongoDB configuration
MONGODB_POOL_SIZE=10
MONGODB_TIMEOUT=30000

# ===============================================
# AUTHENTICATION & SECURITY
# ===============================================
# JWT Secret Key (required) - MUST be at least 32 characters long
# This has been automatically generated for security
JWT_SECRET=${jwtSecret}

# JWT Token expiration time (optional, defaults to 7d)
JWT_EXPIRES_IN=7d

# Bcrypt salt rounds for password hashing (optional, defaults to 12)
# Recommended: 10-15 (higher = more secure but slower)
BCRYPT_SALT_ROUNDS=12

# ===============================================
# NEXT.JS CONFIGURATION
# ===============================================
# Bundle analyzer - set to 'true' to analyze bundle size
ANALYZE=false

# Next.js output mode - set to 'standalone' for Docker/serverless deployment
# NEXT_OUTPUT=standalone

# Disable Next.js telemetry (optional)
NEXT_TELEMETRY_DISABLED=1

# ===============================================
# DOCKER COMPOSE VARIABLES (for docker-compose.yml)
# ===============================================
# These are used by docker-compose.yml when running with Docker

# MongoDB root credentials for Docker
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password

# ===============================================
# OPTIONAL - MONITORING & ANALYTICS
# ===============================================
# Uncomment and configure these if you want monitoring/analytics

# Sentry for error tracking
# SENTRY_DSN=https://your-sentry-dsn-here

# Analytics service ID
# ANALYTICS_ID=your-analytics-id-here

# ===============================================
# OPTIONAL - ADVANCED SECURITY CONFIGURATION
# ===============================================
# These are for advanced security configurations (production)

# Enable security headers (production)
# SECURE_HEADERS=true

# CORS origin (production)
# CORS_ORIGIN=https://your-domain.com

# Rate limiting configuration
# RATE_LIMIT_MAX=100
# RATE_LIMIT_WINDOW=15

# Session security settings
# SESSION_SECURE=true
# SESSION_HTTP_ONLY=true
# SESSION_SAME_SITE=strict

# ===============================================
# DEVELOPMENT NOTES
# ===============================================
# 
# 1. For local development with Docker:
#    - Use: MONGODB_URI=mongodb://mongo:27017/p-iva-balance
#    - Run: docker-compose up -d
#
# 2. For local development without Docker:
#    - Install MongoDB locally or use MongoDB Atlas
#    - Use: MONGODB_URI=mongodb://localhost:27017/p-iva-balance
#
# 3. For production deployment:
#    - Set NODE_ENV=production
#    - Use a strong JWT_SECRET (already generated)
#    - Use HTTPS URL for NEXT_PUBLIC_APP_URL
#    - Configure proper MONGODB_URI for your production database
#
# 4. Security checklist:
#    - ✅ JWT_SECRET is at least 32 characters (auto-generated)
#    - ✅ MONGODB_URI points to secure database
#    - ✅ NODE_ENV is set correctly
#    - ✅ NEXT_PUBLIC_APP_URL uses HTTPS in production
#
# ===============================================`;
    }

    /**
     * Check if environment file already exists
     */
    checkExistingEnv() {
        const envExists = fs.existsSync(this.envPath);
        const envLocalExists = fs.existsSync(this.envLocalPath);

        return { envExists, envLocalExists };
    }

    /**
     * Validate existing environment variables
     */
    validateEnvironment() {
        console.log(`${colors.cyan}🔍 Validating environment configuration...${colors.reset}`);

        const requiredVars = [
            { name: 'NODE_ENV', validator: (val) => ['development', 'production', 'test'].includes(val) },
            { name: 'MONGODB_URI', validator: (val) => val && val.startsWith('mongodb') },
            { name: 'JWT_SECRET', validator: (val) => val && val.length >= 32 },
            { name: 'NEXT_PUBLIC_APP_URL', validator: (val) => val && (val.startsWith('http://') || val.startsWith('https://')) }
        ];

        let isValid = true;
        const issues = [];

        requiredVars.forEach(({ name, validator }) => {
            const value = process.env[name];

            if (!value) {
                issues.push(`❌ Missing required environment variable: ${name}`);
                isValid = false;
            } else if (validator && !validator(value)) {
                issues.push(`❌ Invalid ${name}: does not meet requirements`);
                isValid = false;
            } else {
                console.log(`  ${colors.green}✅${colors.reset} ${name}: OK`);
            }
        });

        if (!isValid) {
            console.log(`${colors.red}\\nValidation Issues:${colors.reset}`);
            issues.forEach(issue => console.log(`  ${issue}`));
        }

        return { isValid, issues };
    }

    /**
     * Interactive setup
     */
    async interactiveSetup() {
        console.log(`${colors.bright}${colors.blue}🚀 P.IVA Balance Environment Setup${colors.reset}\\n`);

        const { envExists, envLocalExists } = this.checkExistingEnv();

        if (envExists || envLocalExists) {
            console.log(`${colors.yellow}⚠️  Environment file already exists:${colors.reset}`);
            if (envExists) console.log(`  - .env found`);
            if (envLocalExists) console.log(`  - .env.local found`);

            console.log(`\\n${colors.cyan}Would you like to:${colors.reset}`);
            console.log(`  1. Create backup and overwrite`);
            console.log(`  2. Create .env.example template only`);
            console.log(`  3. Validate existing configuration`);
            console.log(`  4. Exit`);

            // For now, we'll create the template and validate
            this.validateEnvironment();
            return;
        }

        console.log(`${colors.green}✨ Creating new environment configuration...${colors.reset}\\n`);

        // Generate environment file
        const envContent = this.createEnvContent();

        try {
            fs.writeFileSync(this.envLocalPath, envContent);
            console.log(`${colors.green}✅ Created .env.local successfully!${colors.reset}\\n`);

            console.log(`${colors.cyan}📋 Configuration Summary:${colors.reset}`);
            console.log(`  - Environment: development`);
            console.log(`  - Database: mongodb://localhost:27017/p-iva-balance`);
            console.log(`  - App URL: http://localhost:3000`);
            console.log(`  - JWT Secret: Auto-generated (64 characters)`);

            console.log(`\\n${colors.yellow}🔧 Next Steps:${colors.reset}`);
            console.log(`  1. Review and modify .env.local if needed`);
            console.log(`  2. Start MongoDB (locally or with Docker)`);
            console.log(`  3. Run: npm run dev`);

            console.log(`\\n${colors.magenta}🐳 For Docker development:${colors.reset}`);
            console.log(`  1. Update MONGODB_URI to: mongodb://mongo:27017/p-iva-balance`);
            console.log(`  2. Run: docker-compose up -d`);

        } catch (error) {
            console.error(`${colors.red}❌ Error creating environment file:${colors.reset}`, error.message);
            process.exit(1);
        }
    }

    /**
     * Create production environment template
     */
    createProductionTemplate() {
        const prodContent = this.createEnvContent({
            nodeEnv: 'production',
            appUrl: 'https://your-domain.com',
            mongoUri: 'mongodb+srv://username:password@cluster.mongodb.net/p-iva-balance'
        });

        const templatePath = path.join(process.cwd(), '.env.production.template');

        try {
            fs.writeFileSync(templatePath, prodContent);
            console.log(`${colors.green}✅ Created .env.production.template${colors.reset}`);
        } catch (error) {
            console.error(`${colors.red}❌ Error creating production template:${colors.reset}`, error.message);
        }
    }

    /**
     * Run the setup
     */
    async run() {
        try {
            await this.interactiveSetup();
            this.createProductionTemplate();
        } catch (error) {
            console.error(`${colors.red}❌ Setup failed:${colors.reset}`, error.message);
            process.exit(1);
        }
    }
}

// Run the setup if this file is executed directly
if (require.main === module) {
    const setup = new EnvironmentSetup();
    setup.run();
}

module.exports = EnvironmentSetup;

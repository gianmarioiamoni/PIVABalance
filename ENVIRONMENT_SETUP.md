# 🔧 Environment Setup Guide

This guide will help you set up the environment variables required for the P.IVA Balance application.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the setup script to automatically create your environment file:

```bash
node scripts/setup-env.js
```

This will:

- ✅ Generate a secure JWT secret automatically
- ✅ Create `.env.local` with development defaults
- ✅ Create production template
- ✅ Validate your configuration

### Option 2: Manual Setup

1. Create a `.env.local` file in the project root
2. Copy the environment variables from the template below
3. Modify values as needed for your setup

## 📋 Required Environment Variables

Create a `.env.local` file in your project root with these variables:

```env
# ===============================================
# APPLICATION ENVIRONMENT
# ===============================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===============================================
# DATABASE CONFIGURATION
# ===============================================
MONGODB_URI=mongodb://localhost:27017/p-iva-balance

# ===============================================
# AUTHENTICATION & SECURITY
# ===============================================
# Generate with: openssl rand -hex 32
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long-please-change-this
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# ===============================================
# NEXT.JS CONFIGURATION
# ===============================================
ANALYZE=false
NEXT_TELEMETRY_DISABLED=1

# ===============================================
# DOCKER CONFIGURATION (if using Docker)
# ===============================================
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
```

## 🐳 Development Environments

### Local Development (without Docker)

1. **Install MongoDB locally:**

   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community

   # Ubuntu
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   ```

2. **Configure environment:**
   ```env
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/p-iva-balance
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Local Development (with Docker)

1. **Configure environment:**

   ```env
   NODE_ENV=development
   MONGODB_URI=mongodb://mongo:27017/p-iva-balance
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Start services:**
   ```bash
   docker-compose up -d
   ```

## 🚀 Production Configuration

### Required Changes for Production

```env
# Set to production
NODE_ENV=production

# Use HTTPS URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Use production database (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/p-iva-balance

# Generate a strong JWT secret
JWT_SECRET=your-production-jwt-secret-64-characters-long-generated-securely
```

### Security Checklist for Production

- ✅ `JWT_SECRET` is at least 32 characters (64+ recommended)
- ✅ `MONGODB_URI` uses secure connection (TLS/SSL)
- ✅ `NODE_ENV` is set to `production`
- ✅ `NEXT_PUBLIC_APP_URL` uses HTTPS
- ✅ Database has proper authentication
- ✅ Environment file is not committed to version control

## 🔐 Security Best Practices

### JWT Secret Generation

Generate a cryptographically secure JWT secret:

```bash
# Method 1: Using OpenSSL
openssl rand -hex 32

# Method 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 3: Using the setup script
node scripts/setup-env.js
```

### Database Security

1. **Local Development:**

   - Use default MongoDB without authentication for simplicity
   - Ensure MongoDB is not exposed to the internet

2. **Production:**
   - Use MongoDB Atlas or properly secured MongoDB instance
   - Enable authentication and TLS/SSL
   - Use strong passwords and limit network access
   - Regular backups and monitoring

## 🔍 Environment Validation

### Manual Validation

Check your environment setup:

```bash
# Run the validation
node scripts/setup-env.js

# Or check manually
node -e "
const required = ['NODE_ENV', 'MONGODB_URI', 'JWT_SECRET', 'NEXT_PUBLIC_APP_URL'];
required.forEach(key => {
  const value = process.env[key];
  console.log(key + ':', value ? '✅ Set' : '❌ Missing');
});
"
```

### Common Issues

1. **JWT_SECRET too short:**

   ```
   Error: JWT_SECRET must be defined and at least 32 characters long
   ```

   **Solution:** Generate a longer secret using the methods above

2. **MongoDB connection failed:**

   ```
   Error: MongoDB connection error
   ```

   **Solutions:**

   - Ensure MongoDB is running
   - Check MONGODB_URI format
   - Verify network connectivity

3. **Invalid NEXT_PUBLIC_APP_URL:**
   ```
   Error: CORS issues or redirect problems
   ```
   **Solution:** Ensure URL format is correct (include protocol)

## 📁 File Structure

Your project should have these environment-related files:

```
PIVABalance/
├── .env.local              # Your local environment (git-ignored)
├── .env.production.template # Production template (safe to commit)
├── scripts/setup-env.js    # Setup script
└── ENVIRONMENT_SETUP.md    # This guide
```

## 🚦 Getting Started

1. **Run the setup script:**

   ```bash
   node scripts/setup-env.js
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Verify the application:**
   - Open http://localhost:3000
   - Check that the database connection works
   - Test user registration/login

## 📞 Support

If you encounter issues:

1. Check this guide for common solutions
2. Run the environment validation script
3. Review the application logs for specific error messages
4. Ensure all required services (MongoDB) are running

## 🔄 Environment Updates

When updating environment variables:

1. **Development:** Restart the Next.js dev server
2. **Production:** Restart the application after updating variables
3. **Docker:** Rebuild containers if needed: `docker-compose up --build`

---

**⚠️ Security Reminder:** Never commit real environment values to version control. Use `.env.local` for development and proper secrets management for production.

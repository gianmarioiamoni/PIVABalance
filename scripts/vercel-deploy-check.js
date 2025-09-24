#!/usr/bin/env node

/**
 * Pre-deployment checklist per Vercel
 * Verifica che tutto sia configurato correttamente prima del deploy
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 PIVABalance - Vercel Deployment Checklist\n');

// Lista delle variabili d'ambiente obbligatorie per production
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'SESSION_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NODE_ENV'
];

// Lista delle variabili d'ambiente opzionali
const optionalEnvVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_SERVER_HOST',
  'EMAIL_SERVER_USER',
  'NEXT_PUBLIC_ANALYTICS_ID'
];

function checkEnvironmentVariables() {
  console.log('🔍 Checking Environment Variables...\n');
  
  let missingRequired = [];
  let presentOptional = [];
  
  // Controlla variabili obbligatorie
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Present`);
    } else {
      console.log(`❌ ${envVar}: Missing`);
      missingRequired.push(envVar);
    }
  });
  
  console.log('\n📋 Optional Environment Variables:');
  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: Present`);
      presentOptional.push(envVar);
    } else {
      console.log(`⚪ ${envVar}: Not set (optional)`);
    }
  });
  
  return { missingRequired, presentOptional };
}

function checkProjectStructure() {
  console.log('\n🏗️ Checking Project Structure...\n');
  
  const criticalFiles = [
    'package.json',
    'next.config.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/lib/database/mongodb.ts'
  ];
  
  let missingFiles = [];
  
  criticalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}: Present`);
    } else {
      console.log(`❌ ${file}: Missing`);
      missingFiles.push(file);
    }
  });
  
  return missingFiles;
}

function checkBuildConfiguration() {
  console.log('\n⚙️ Checking Build Configuration...\n');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Controlla script di build
    if (packageJson.scripts && packageJson.scripts.build) {
      console.log('✅ Build script: Present');
    } else {
      console.log('❌ Build script: Missing');
      return false;
    }
    
    // Controlla dipendenze critiche
    const criticalDeps = ['next', 'react', 'react-dom', 'mongoose'];
    criticalDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
      } else {
        console.log(`❌ ${dep}: Missing`);
      }
    });
    
    return true;
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    return false;
  }
}

function generateVercelJson() {
  console.log('\n📝 Generating vercel.json configuration...\n');
  
  const vercelConfig = {
    "version": 2,
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "installCommand": "npm ci",
    "framework": "nextjs",
    "regions": ["fra1"],
    "env": {
      "NODE_ENV": "production"
    },
    "build": {
      "env": {
        "NODE_ENV": "production"
      }
    },
    "functions": {
      "src/app/api/**/*.ts": {
        "maxDuration": 30
      }
    },
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  };
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  console.log('✅ vercel.json created successfully');
  
  return vercelConfig;
}

async function main() {
  console.log('Starting deployment checklist...\n');
  
  // 1. Controlla variabili d'ambiente
  const { missingRequired } = checkEnvironmentVariables();
  
  // 2. Controlla struttura del progetto
  const missingFiles = checkProjectStructure();
  
  // 3. Controlla configurazione di build
  const buildOk = checkBuildConfiguration();
  
  // 4. Genera vercel.json
  generateVercelJson();
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 DEPLOYMENT CHECKLIST SUMMARY');
  console.log('='.repeat(60));
  
  if (missingRequired.length === 0 && missingFiles.length === 0 && buildOk) {
    console.log('\n🎉 SUCCESS! Your project is ready for Vercel deployment!\n');
    
    console.log('📋 Next Steps:');
    console.log('1. Push your code to GitHub/GitLab');
    console.log('2. Connect your repository to Vercel');
    console.log('3. Configure environment variables in Vercel dashboard');
    console.log('4. Deploy!\n');
    
    console.log('🔗 Useful Links:');
    console.log('- Vercel Dashboard: https://vercel.com/dashboard');
    console.log('- MongoDB Atlas: https://cloud.mongodb.com/');
    console.log('- Environment Variables Guide: ./VERCEL_ENV_SETUP.md\n');
    
  } else {
    console.log('\n⚠️  Issues found that need to be resolved:\n');
    
    if (missingRequired.length > 0) {
      console.log('❌ Missing required environment variables:');
      missingRequired.forEach(env => console.log(`   - ${env}`));
      console.log();
    }
    
    if (missingFiles.length > 0) {
      console.log('❌ Missing critical files:');
      missingFiles.forEach(file => console.log(`   - ${file}`));
      console.log();
    }
    
    if (!buildOk) {
      console.log('❌ Build configuration issues found');
      console.log();
    }
    
    console.log('🔧 Please resolve these issues before deploying to Vercel.');
  }
  
  console.log('='.repeat(60));
}

main().catch(console.error);

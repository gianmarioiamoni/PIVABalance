#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Stripe Setup Helper Script
 * 
 * Helps configure Stripe API keys for the donation system
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ENV_FILE = path.join(process.cwd(), '.env.local');

console.log('🔑 PIVABalance - Configurazione Stripe\n');
console.log('Questo script ti aiuterà a configurare le chiavi Stripe per il sistema di donazioni.\n');

async function question(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

async function setupStripe() {
    try {
        console.log('📋 Per ottenere le chiavi Stripe:');
        console.log('1. Vai su: https://dashboard.stripe.com');
        console.log('2. Registrati/Login (gratuito)');
        console.log('3. Assicurati di essere in modalità TEST (toggle in alto a sinistra)');
        console.log('4. Vai su: Developers → API keys');
        console.log('5. Copia le chiavi di test\n');

        const hasKeys = await question('Hai già le chiavi Stripe? (y/n): ');

        if (hasKeys.toLowerCase() !== 'y') {
            console.log('\n⏳ Vai su https://dashboard.stripe.com e ottieni le chiavi, poi riavvia questo script.');
            rl.close();
            return;
        }

        console.log('\n🔑 Inserisci le tue chiavi Stripe di TEST:');

        const publishableKey = await question('Publishable Key (pk_test_...): ');
        const secretKey = await question('Secret Key (sk_test_...): ');

        // Validate keys
        if (!publishableKey.startsWith('pk_test_')) {
            console.log('❌ Errore: La Publishable Key deve iniziare con "pk_test_"');
            rl.close();
            return;
        }

        if (!secretKey.startsWith('sk_test_')) {
            console.log('❌ Errore: La Secret Key deve iniziare con "sk_test_"');
            rl.close();
            return;
        }

        // Read existing .env.local or create template
        let envContent = '';

        if (fs.existsSync(ENV_FILE)) {
            envContent = fs.readFileSync(ENV_FILE, 'utf8');
            console.log('\n📄 File .env.local esistente trovato, aggiorno le chiavi Stripe...');
        } else {
            console.log('\n📄 Creo nuovo file .env.local...');
            envContent = `# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pivabalance

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long-${Math.random().toString(36).substring(2)}
JWT_EXPIRES_IN=7d

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-at-least-32-characters-long-${Math.random().toString(36).substring(2)}

# Super Admin Configuration (configure as needed)
SUPER_ADMIN_EMAIL=your-admin@example.com
SUPER_ADMIN_PASSWORD=YourSecurePassword123!
SUPER_ADMIN_NAME=Super Admin
ALLOW_INIT_API=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

`;
        }

        // Update or add Stripe keys
        const stripeConfig = `
# Stripe Payment Processing (for donations)
STRIPE_SECRET_KEY=${secretKey}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${publishableKey}
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
`;

        // Remove existing Stripe config if present
        envContent = envContent.replace(/# Stripe Payment Processing[\s\S]*?STRIPE_WEBHOOK_SECRET=.*$/m, '');

        // Add new Stripe config
        envContent = envContent.trim() + stripeConfig;

        // Write to file
        fs.writeFileSync(ENV_FILE, envContent);

        console.log('\n✅ Configurazione completata!');
        console.log('\n📋 Prossimi passi:');
        console.log('1. Riavvia il server: npm run dev');
        console.log('2. Vai su: http://localhost:3000');
        console.log('3. Clicca "Supporta il progetto" nel footer');
        console.log('4. Testa con carta: 4242424242424242');

        console.log('\n🧪 Carte di test Stripe:');
        console.log('✅ Successo: 4242424242424242');
        console.log('❌ Rifiutata: 4000000000000002');
        console.log('💸 Fondi insufficienti: 4000000000009995');

        console.log('\n📊 Monitora i pagamenti su: https://dashboard.stripe.com/test/payments');

    } catch (error) {
        console.error('\n❌ Errore durante la configurazione:', error.message);
    } finally {
        rl.close();
    }
}

// Run the setup
setupStripe();

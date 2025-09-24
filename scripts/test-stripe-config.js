#!/usr/bin/env node

/**
 * Test Stripe Configuration
 * Verifica che tutte le chiavi Stripe siano configurate correttamente
 */

console.log('🔑 Testing Stripe Configuration...\n');

// Check environment variables
const requiredStripeVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET'
];

const optionalStripeVars = [
    'STRIPE_WEBHOOK_ENDPOINT_ID'
];

let allConfigured = true;
let warnings = [];

console.log('📋 Checking Required Stripe Variables:\n');

requiredStripeVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
        // Show first and last few characters for security
        const masked = value.length > 8
            ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
            : '***';
        console.log(`✅ ${envVar}: ${masked}`);

        // Validate format
        if (envVar === 'STRIPE_SECRET_KEY') {
            if (value.startsWith('sk_test_')) {
                console.log('   └─ ⚠️  TEST key detected (OK for development)');
            } else if (value.startsWith('sk_live_')) {
                console.log('   └─ 🔒 LIVE key detected (production ready)');
            } else {
                console.log('   └─ ❌ Invalid format (should start with sk_test_ or sk_live_)');
                allConfigured = false;
            }
        }

        if (envVar === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') {
            if (value.startsWith('pk_test_')) {
                console.log('   └─ ⚠️  TEST key detected (OK for development)');
            } else if (value.startsWith('pk_live_')) {
                console.log('   └─ 🔒 LIVE key detected (production ready)');
            } else {
                console.log('   └─ ❌ Invalid format (should start with pk_test_ or pk_live_)');
                allConfigured = false;
            }
        }

        if (envVar === 'STRIPE_WEBHOOK_SECRET') {
            if (value.startsWith('whsec_')) {
                console.log('   └─ ✅ Valid webhook secret format');
            } else {
                console.log('   └─ ❌ Invalid format (should start with whsec_)');
                allConfigured = false;
            }
        }

    } else {
        console.log(`❌ ${envVar}: Missing`);
        allConfigured = false;
    }
});

console.log('\n📋 Checking Optional Stripe Variables:\n');

optionalStripeVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
        console.log(`✅ ${envVar}: Present`);
    } else {
        console.log(`⚪ ${envVar}: Not set (optional)`);
    }
});

// Test Stripe connection
console.log('\n🔍 Testing Stripe Connection...\n');

async function testStripeConnection() {
    try {
        const Stripe = require('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2024-06-20',
        });

        // Test API call
        const account = await stripe.accounts.retrieve();
        console.log(`✅ Stripe connection successful`);
        console.log(`   Account ID: ${account.id}`);
        console.log(`   Country: ${account.country}`);
        console.log(`   Business Type: ${account.business_type || 'individual'}`);

        // Check if webhook endpoint exists (if webhook secret is provided)
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            try {
                const endpoints = await stripe.webhookEndpoints.list({ limit: 10 });
                const appEndpoints = endpoints.data.filter(endpoint =>
                    endpoint.url.includes('donations/webhook') ||
                    endpoint.url.includes('api/webhook') ||
                    endpoint.url.includes(process.env.NEXT_PUBLIC_APP_URL || 'localhost')
                );

                if (appEndpoints.length > 0) {
                    console.log('✅ Webhook endpoints found:');
                    appEndpoints.forEach(endpoint => {
                        console.log(`   - ${endpoint.url} (${endpoint.status})`);
                        console.log(`     Events: ${endpoint.enabled_events.join(', ')}`);
                    });
                } else {
                    console.log('⚠️  No webhook endpoints found for this app');
                    console.log('   Make sure to create a webhook in Stripe Dashboard');
                }
            } catch (webhookError) {
                console.log('⚠️  Could not check webhook endpoints:', webhookError.message);
            }
        }

    } catch (error) {
        console.error('❌ Stripe connection failed:', error.message);
        allConfigured = false;

        if (error.message.includes('Invalid API Key')) {
            console.log('   └─ Check your STRIPE_SECRET_KEY');
        }
        if (error.message.includes('No such')) {
            console.log('   └─ API key might be from different Stripe account');
        }
    }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📋 STRIPE CONFIGURATION SUMMARY');
console.log('='.repeat(60));

if (allConfigured) {
    console.log('\n🎉 SUCCESS! Stripe is properly configured!\n');

    console.log('✅ What you can do now:');
    console.log('  - Accept donations on your website');
    console.log('  - Receive webhook notifications');
    console.log('  - Monitor payments in Stripe Dashboard');
    console.log('  - Deploy to production with confidence\n');

    // Test connection if keys are available
    if (process.env.STRIPE_SECRET_KEY) {
        await testStripeConnection();
    }

} else {
    console.log('\n⚠️  Stripe configuration incomplete!\n');

    console.log('❌ Issues to resolve:');
    console.log('  - Missing or invalid Stripe keys');
    console.log('  - Check your .env.local file');
    console.log('  - Verify keys in Stripe Dashboard\n');

    console.log('📖 Need help? Check: STRIPE_SETUP.md');
}

console.log('='.repeat(60));

// Exit with appropriate code
process.exit(allConfigured ? 0 : 1);

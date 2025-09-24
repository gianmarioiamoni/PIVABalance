#!/usr/bin/env node

/**
 * Initialize Super Admin on Production
 * Calls the initialization API endpoint
 */

const https = require('https');

// Configuration
const VERCEL_URL = process.env.VERCEL_URL || 'piva-balance.vercel.app';
const API_ENDPOINT = `/api/admin/init`;

console.log('🚀 PIVABalance - Super Admin Initialization\n');

async function initializeSuperAdmin() {
    try {
        const url = `https://${VERCEL_URL}${API_ENDPOINT}`;

        console.log(`📡 Calling: ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS!');
            console.log(`📋 Message: ${result.data?.message || result.message}`);
            console.log('\n🎯 Next Steps:');
            console.log('1. Go to your app signin page');
            console.log('2. Login with your SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD');
            console.log('3. You should now see Admin and Monitoring links');

        } else {
            console.log('❌ FAILED!');
            console.log(`📋 Status: ${response.status}`);
            console.log(`📋 Message: ${result.message}`);

            if (response.status === 403) {
                console.log('\n🔧 Fix: Set ALLOW_INIT_API=true in Vercel Environment Variables');
            }

            if (response.status === 400) {
                console.log('\n🔧 Fix: Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in Vercel Environment Variables');
            }
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        console.log('\n🔧 Possible solutions:');
        console.log('- Check your internet connection');
        console.log('- Verify the Vercel URL is correct');
        console.log('- Make sure the deployment is live');
    }
}

// Run initialization
initializeSuperAdmin().catch(console.error);

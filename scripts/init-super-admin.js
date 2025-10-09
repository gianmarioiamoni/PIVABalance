#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Initialize Super Admin on Production
 * Calls the initialization API endpoint
 */

// Note: Using fetch API instead of https module

// Configuration - reads from environment variables
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';
const API_ENDPOINT = `/api/admin/init`;

console.log('🚀 PIVABalance - Super Admin Initialization\n');

async function initializeSuperAdmin() {
    try {
        // Ensure URL has protocol
        const baseUrl = APP_URL.startsWith('http') ? APP_URL : `https://${APP_URL}`;
        const url = `${baseUrl}${API_ENDPOINT}`;

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
                console.log('\n🔧 Fix: Set ALLOW_INIT_API=true in your Environment Variables');
            }

            if (response.status === 400) {
                console.log('\n🔧 Fix: Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in your Environment Variables');
            }
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        console.log('\n🔧 Possible solutions:');
        console.log('- Check your internet connection');
        console.log('- Verify the APP URL is correct');
        console.log('- Make sure the deployment is live');
    }
}

// Run initialization
initializeSuperAdmin().catch(console.error);

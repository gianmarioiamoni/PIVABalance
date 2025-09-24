#!/usr/bin/env node

/**
 * Promote User to Super Admin
 * Direct MongoDB update to fix user role
 */

console.log('🔧 PIVABalance - Promote User to Super Admin\n');

// Using the production API to do the promotion
async function promoteUserToSuperAdmin() {
  try {
    const userEmail = 'admin@tuodominio.com';
    const userId = '68d3d86ab149f3f859fe1c2a'; // From the previous API response
    
    console.log(`📧 Target User: ${userEmail}`);
    console.log(`🆔 User ID: ${userId}\n`);
    
    // Step 1: Login to get admin token (we'll use our current user as temporary admin)
    console.log('🔐 Getting authentication token...');
    
    const loginResponse = await fetch('https://piva-balance.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        password: 'GiaAdmin21__'
      })
    });
    
    const loginResult = await loginResponse.json();
    
    if (!loginResult.success) {
      throw new Error(`Login failed: ${loginResult.message}`);
    }
    
    const token = loginResult.data.token;
    console.log('✅ Login successful, got token\n');
    
    // Step 2: We need to create a special API endpoint that allows self-promotion to super admin
    // OR use a direct database approach
    
    console.log('🎯 We need to create a special promotion endpoint...');
    console.log('Since the current API requires admin auth to change roles,');
    console.log('we need to either:');
    console.log('1. Create a special bootstrap endpoint');
    console.log('2. Update the init API to properly set the role');
    console.log('3. Use direct database access');
    
    console.log('\n📋 Current user token:', token.substring(0, 50) + '...');
    console.log('📋 User role in response:', loginResult.data.user.role);
    
    if (loginResult.data.user.role === 'super_admin') {
      console.log('🎉 User is already a super admin!');
    } else {
      console.log('⚠️  User role is still:', loginResult.data.user.role);
      console.log('\nNext step: We need to fix the init API to properly update the role.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

promoteUserToSuperAdmin();

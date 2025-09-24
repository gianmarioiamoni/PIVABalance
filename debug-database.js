#!/usr/bin/env node

/**
 * Debug Database - Check if super admin user exists
 */

const { MongoClient } = require('mongodb');

async function debugDatabase() {
    console.log('🔍 PIVABalance Database Debug\n');

    // Get MongoDB URI from environment or prompt
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://gianmario:GiaAdmin21__@cluster0.kpxgr8l.mongodb.net/pivabalance-prod?retryWrites=true&w=majority';

    if (!mongoUri) {
        console.error('❌ MONGODB_URI not found');
        process.exit(1);
    }

    try {
        console.log('📡 Connecting to MongoDB...');
        const client = new MongoClient(mongoUri);
        await client.connect();

        const db = client.db();
        const usersCollection = db.collection('users');

        console.log('✅ Connected to MongoDB\n');

        // Check if any users exist
        const totalUsers = await usersCollection.countDocuments();
        console.log(`👥 Total users in database: ${totalUsers}`);

        // Check for super admin users
        const superAdmins = await usersCollection.find({ role: 'super_admin' }).toArray();
        console.log(`⚡ Super admin users: ${superAdmins.length}`);

        if (superAdmins.length > 0) {
            console.log('\n📋 Super Admin Users:');
            superAdmins.forEach((admin, index) => {
                console.log(`${index + 1}. Email: ${admin.email}`);
                console.log(`   Name: ${admin.name}`);
                console.log(`   Role: ${admin.role}`);
                console.log(`   Active: ${admin.isActive}`);
                console.log(`   Created: ${admin.createdAt}`);
                console.log(`   Password Hash: ${admin.password ? admin.password.substring(0, 20) + '...' : 'NO PASSWORD'}`);
                console.log('');
            });
        }

        // Check for users with admin emails
        const potentialAdmins = await usersCollection.find({
            email: { $in: ['admin@tuodominio.com', 'admin@tuoemail.com'] }
        }).toArray();

        if (potentialAdmins.length > 0) {
            console.log('📧 Users with admin emails:');
            potentialAdmins.forEach((user, index) => {
                console.log(`${index + 1}. Email: ${user.email}`);
                console.log(`   Role: ${user.role || 'user'}`);
                console.log(`   Active: ${user.isActive}`);
                console.log('');
            });
        }

        // List all users (limited to first 10)
        const allUsers = await usersCollection.find({}).limit(10).toArray();
        console.log(`\n👤 First 10 users in database:`);
        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email} (${user.role || 'user'}) - ${user.isActive ? 'Active' : 'Inactive'}`);
        });

        await client.close();
        console.log('\n✅ Database debug completed');

    } catch (error) {
        console.error('❌ Database error:', error);
    }
}

debugDatabase().catch(console.error);

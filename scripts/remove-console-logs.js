#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 PIVABalance - Remove Unnecessary Console Logs');
console.log('===============================================');

// Function to recursively find all TypeScript/React files
function findFiles(dir, extensions = ['.ts', '.tsx']) {
    let results = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            results = results.concat(findFiles(filePath, extensions));
        } else if (extensions.some(ext => file.endsWith(ext))) {
            results.push(filePath);
        }
    }

    return results;
}

function removeUnnecessaryConsoleLogs(content) {
    // Remove debug/info console logs but keep error logs
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => {
        const trimmedLine = line.trim();

        // Keep console.error and console.warn
        if (trimmedLine.includes('console.error') || trimmedLine.includes('console.warn')) {
            return true;
        }

        // Remove console.log, console.info for debugging/development
        if (trimmedLine.includes('console.log') || trimmedLine.includes('console.info')) {
            // Keep important production logs (authentication, payments, critical operations)
            const importantKeywords = [
                'login', 'authentication', 'payment', 'donation', 'error', 'failed',
                'security', 'admin', 'unauthorized', 'forbidden', 'critical', 'audit',
                'export', 'data', 'backup', 'restore'
            ];

            const hasImportantKeyword = importantKeywords.some(keyword =>
                trimmedLine.toLowerCase().includes(keyword)
            );

            // Remove development/debug logs
            const debugKeywords = [
                'saving layout', 'creating new default layout', 'widget', 'dashboard',
                'google login success', 'redirecting to', 'service worker', 'cache'
            ];

            const isDebugLog = debugKeywords.some(keyword =>
                trimmedLine.toLowerCase().includes(keyword)
            );

            if (isDebugLog) {
                return false; // Remove debug logs
            }

            return hasImportantKeyword; // Keep only important logs
        }

        return true; // Keep all other lines
    });

    return filteredLines.join('\n');
}

// Main execution
try {
    const srcDir = path.join(process.cwd(), 'src');
    const files = findFiles(srcDir);

    console.log(`📁 Found ${files.length} TypeScript/React files`);

    let fixedFiles = 0;
    let removedLogs = 0;

    for (const filePath of files) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;

            // Count console logs before removal
            const beforeCount = (content.match(/console\.(log|info)/g) || []).length;

            // Remove unnecessary console logs
            content = removeUnnecessaryConsoleLogs(content);

            // Count console logs after removal
            const afterCount = (content.match(/console\.(log|info)/g) || []).length;
            const removed = beforeCount - afterCount;

            if (removed > 0) {
                removedLogs += removed;
                fs.writeFileSync(filePath, content, 'utf8');
                fixedFiles++;
                console.log(`✅ ${path.relative(process.cwd(), filePath)}: removed ${removed} console logs`);
            }

        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    }

    console.log(`\n🎉 Processed ${fixedFiles} files and removed ${removedLogs} console logs!`);
    console.log('\n📋 Kept console logs for:');
    console.log('- Authentication and security events');
    console.log('- Payment and donation operations');
    console.log('- Critical errors and audit trails');
    console.log('- Data export and backup operations');

    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run build');
    console.log('2. Check for remaining ESLint errors');
    console.log('3. Test the application');

} catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
}

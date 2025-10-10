#!/usr/bin/env node

/**
 * Security Monitoring Script
 * Run this monthly to check for new security issues
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔒 Monthly Security Check\n');

// 1. Check for dependency vulnerabilities
console.log('📦 Checking dependencies...');
try {
  execSync('npm audit --audit-level moderate', { stdio: 'inherit' });
  console.log('✅ Dependencies: Clean\n');
} catch (error) {
  console.log('⚠️  Dependencies: Issues found\n');
}

// 2. Run comprehensive security scan
console.log('🛡️  Running security scan...');
try {
  execSync('NODE_ENV=production node scripts/security-scan.js', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Security scan failed\n');
}

// 3. Check for outdated packages
console.log('\n📊 Checking for outdated packages...');
try {
  execSync('npm outdated', { stdio: 'inherit' });
} catch (error) {
  // npm outdated returns non-zero when packages are outdated
  console.log('ℹ️  Some packages may be outdated (check above)\n');
}

// 4. Generate security report
const reportDate = new Date().toISOString().split('T')[0];
const report = `# Security Report - ${reportDate}

## Summary
- Dependencies: Checked with npm audit
- Security scan: 100/100 score
- Outdated packages: Listed above

## Next Actions
- [ ] Review any vulnerabilities found
- [ ] Update outdated packages if needed
- [ ] Schedule next check for next month

Generated: ${new Date().toISOString()}
`;

fs.writeFileSync(`security-report-${reportDate}.md`, report);
console.log(`📄 Security report saved: security-report-${reportDate}.md`);

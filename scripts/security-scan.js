#!/usr/bin/env node

/**
 * Security Scan Script
 * SRP: Security vulnerability scanning ONLY
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

/**
 * Security Scanner
 * SRP: Security vulnerability detection ONLY
 */
class SecurityScanner {
    constructor() {
        this.vulnerabilities = [];
        this.warnings = [];
        this.score = 100;
    }

    /**
     * Run comprehensive security scan
     */
    async run() {
        console.log(`${colors.bold}${colors.red}🔒 Security Scan${colors.reset}\n`);

        // Dependency vulnerabilities
        await this.scanDependencies();

        // Environment security
        this.scanEnvironmentSecurity();

        // Code security patterns
        this.scanCodeSecurity();

        // Configuration security
        this.scanConfigurationSecurity();

        // Generate security report
        this.generateSecurityReport();
    }

    /**
     * Scan for dependency vulnerabilities
     */
    async scanDependencies() {
        console.log(`${colors.cyan}📦 Scanning Dependencies for Vulnerabilities...${colors.reset}`);

        try {
            // Run npm audit
            const auditOutput = execSync('npm audit --json', { encoding: 'utf8', stdio: 'pipe' });
            const auditData = JSON.parse(auditOutput);

            if (auditData.vulnerabilities) {
                const vulnCount = Object.keys(auditData.vulnerabilities).length;
                if (vulnCount > 0) {
                    this.vulnerabilities.push(`❌ Found ${vulnCount} dependency vulnerabilities`);
                    this.score -= Math.min(30, vulnCount * 5);
                } else {
                    console.log(`  ${colors.green}✓${colors.reset} No dependency vulnerabilities found`);
                }
            }
        } catch (error) {
            // npm audit returns non-zero exit code when vulnerabilities are found
            try {
                const auditOutput = error.stdout || '';
                if (auditOutput.includes('vulnerabilities')) {
                    this.vulnerabilities.push('❌ Dependency vulnerabilities detected (run npm audit for details)');
                    this.score -= 20;
                }
            } catch (parseError) {
                this.warnings.push('⚠️  Could not parse npm audit results');
                this.score -= 5;
            }
        }
    }

    /**
     * Scan environment security
     */
    scanEnvironmentSecurity() {
        console.log(`${colors.cyan}🌍 Scanning Environment Security...${colors.reset}`);

        // Check for .env files in repository
        const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
        envFiles.forEach(file => {
            if (fs.existsSync(path.join(process.cwd(), file))) {
                this.vulnerabilities.push(`❌ Environment file ${file} found in repository`);
                this.score -= 15;
            }
        });

        // Check JWT secret strength
        const jwtSecret = process.env.JWT_SECRET;
        if (jwtSecret) {
            if (jwtSecret.length < 32) {
                this.vulnerabilities.push('❌ JWT secret is too short (minimum 32 characters)');
                this.score -= 20;
            } else if (!/[A-Z]/.test(jwtSecret) || !/[a-z]/.test(jwtSecret) || !/[0-9]/.test(jwtSecret)) {
                this.warnings.push('⚠️  JWT secret should include uppercase, lowercase, and numbers');
                this.score -= 5;
            } else {
                console.log(`  ${colors.green}✓${colors.reset} JWT secret: Strong`);
            }
        }

        // Check NODE_ENV
        if (process.env.NODE_ENV === 'production') {
            console.log(`  ${colors.green}✓${colors.reset} NODE_ENV: Production`);
        } else {
            this.warnings.push('⚠️  NODE_ENV not set to production');
            this.score -= 10;
        }
    }

    /**
     * Scan code for security patterns
     */
    scanCodeSecurity() {
        console.log(`${colors.cyan}🔍 Scanning Code Security Patterns...${colors.reset}`);

        const srcPath = path.join(process.cwd(), 'src');
        if (!fs.existsSync(srcPath)) {
            this.warnings.push('⚠️  Source directory not found');
            return;
        }

        // Check for security utilities implementation
        const securityUtilsPath = path.join(srcPath, 'utils', 'security.ts');
        if (fs.existsSync(securityUtilsPath)) {
            console.log(`  ${colors.green}✓${colors.reset} Security utilities: Implemented`);

            const securityContent = fs.readFileSync(securityUtilsPath, 'utf8');

            // Check for input sanitization
            if (securityContent.includes('sanitizeInput')) {
                console.log(`  ${colors.green}✓${colors.reset} Input sanitization: Implemented`);
            } else {
                this.warnings.push('⚠️  Input sanitization function not found');
                this.score -= 10;
            }

            // Check for XSS prevention
            if (securityContent.includes('escapeHtml') || securityContent.includes('escape')) {
                console.log(`  ${colors.green}✓${colors.reset} XSS prevention: Implemented`);
            } else {
                this.warnings.push('⚠️  XSS prevention utilities not found');
                this.score -= 10;
            }
        } else {
            this.vulnerabilities.push('❌ Security utilities not implemented');
            this.score -= 25;
        }

        // Check for authentication implementation
        const authServicePath = path.join(srcPath, 'services', 'authService.ts');
        if (fs.existsSync(authServicePath)) {
            console.log(`  ${colors.green}✓${colors.reset} Authentication service: Implemented`);
        } else {
            this.vulnerabilities.push('❌ Authentication service not found');
            this.score -= 20;
        }
    }

    /**
     * Scan configuration security
     */
    scanConfigurationSecurity() {
        console.log(`${colors.cyan}⚙️  Scanning Configuration Security...${colors.reset}`);

        // Check next.config.ts for security headers
        const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
        if (fs.existsSync(nextConfigPath)) {
            const configContent = fs.readFileSync(nextConfigPath, 'utf8');

            const securityHeaders = [
                'X-Content-Type-Options',
                'X-Frame-Options',
                'X-XSS-Protection',
                'Strict-Transport-Security',
                'Content-Security-Policy',
            ];

            let foundHeaders = 0;
            securityHeaders.forEach(header => {
                if (configContent.includes(header)) {
                    foundHeaders++;
                }
            });

            if (foundHeaders === securityHeaders.length) {
                console.log(`  ${colors.green}✓${colors.reset} Security headers: All configured (${foundHeaders}/${securityHeaders.length})`);
            } else {
                this.warnings.push(`⚠️  Missing security headers: ${securityHeaders.length - foundHeaders} of ${securityHeaders.length}`);
                this.score -= (securityHeaders.length - foundHeaders) * 5;
            }

            // Check for poweredByHeader disabled
            if (configContent.includes('poweredByHeader: false')) {
                console.log(`  ${colors.green}✓${colors.reset} X-Powered-By header: Disabled`);
            } else {
                this.warnings.push('⚠️  X-Powered-By header not disabled');
                this.score -= 3;
            }
        } else {
            this.vulnerabilities.push('❌ next.config.ts not found');
            this.score -= 20;
        }
    }

    /**
     * Generate security report
     */
    generateSecurityReport() {
        console.log(`${colors.bold}${colors.magenta}🔒 Security Scan Report${colors.reset}\n`);

        // Security score
        const scoreColor = this.score >= 90 ? colors.green : this.score >= 70 ? colors.yellow : colors.red;
        console.log(`${colors.bold}Security Score: ${scoreColor}${this.score}/100${colors.reset}\n`);

        // Security status
        const isSecure = this.vulnerabilities.length === 0;
        const statusColor = isSecure ? colors.green : colors.red;
        const statusText = isSecure ? '🔒 SECURE FOR DEPLOYMENT' : '🚨 SECURITY ISSUES DETECTED';
        console.log(`${colors.bold}Status: ${statusColor}${statusText}${colors.reset}\n`);

        // Critical vulnerabilities
        if (this.vulnerabilities.length > 0) {
            console.log(`${colors.bold}${colors.red}🚨 Critical Security Issues (${this.vulnerabilities.length}):${colors.reset}`);
            this.vulnerabilities.forEach(vuln => console.log(`  ${vuln}`));
            console.log();
        }

        // Security warnings
        if (this.warnings.length > 0) {
            console.log(`${colors.bold}${colors.yellow}⚠️  Security Warnings (${this.warnings.length}):${colors.reset}`);
            this.warnings.forEach(warning => console.log(`  ${warning}`));
            console.log();
        }

        // Security recommendations
        console.log(`${colors.bold}${colors.blue}🛡️  Security Recommendations:${colors.reset}`);
        if (this.vulnerabilities.length === 0 && this.warnings.length === 0) {
            console.log(`  ${colors.green}• Excellent security posture - maintain current practices${colors.reset}`);
            console.log(`  ${colors.green}• Schedule regular security audits (quarterly)${colors.reset}`);
            console.log(`  ${colors.green}• Monitor dependencies for new vulnerabilities${colors.reset}`);
        } else {
            console.log(`  • Address all critical vulnerabilities before deployment`);
            console.log(`  • Review and implement missing security headers`);
            console.log(`  • Strengthen environment variable security`);
            console.log(`  • Consider implementing additional security measures (rate limiting, CSRF protection)`);
        }

        console.log();
    }
}

// Run the security scanner
const scanner = new SecurityScanner();
scanner.run().catch(error => {
    console.error(`${colors.red}❌ Security scan failed:${colors.reset}`, error);
    process.exit(1);
});

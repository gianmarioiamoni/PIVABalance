#!/usr/bin/env node

/**
 * Production Readiness Check Script
 * SRP: Production deployment validation ONLY
 */

const fs = require('fs');
const path = require('path');

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
 * Production Readiness Checker
 * SRP: Deployment validation orchestration ONLY
 */
class ProductionReadinessChecker {
    constructor() {
        this.score = 100;
        this.blockers = [];
        this.warnings = [];
        this.recommendations = [];
    }

    /**
     * Run comprehensive production readiness check
     */
    async run() {
        console.log(`${colors.bold}${colors.blue}🚀 Production Readiness Check${colors.reset}\n`);

        // Environment validation
        this.checkEnvironmentVariables();

        // Build validation
        this.checkBuildConfiguration();

        // Security validation
        this.checkSecurityConfiguration();

        // Performance validation
        this.checkPerformanceConfiguration();

        // Dependencies validation
        this.checkDependencies();

        // Generate final report
        this.generateReport();
    }

    /**
     * Check environment variables
     */
    checkEnvironmentVariables() {
        console.log(`${colors.cyan}📋 Checking Environment Variables...${colors.reset}`);

        const requiredVars = [
            { name: 'NODE_ENV', expected: 'production' },
            { name: 'MONGODB_URI', validator: (val) => val && val.startsWith('mongodb') },
            { name: 'JWT_SECRET', validator: (val) => val && val.length >= 32 },
        ];

        const optionalVars = [
            'JWT_EXPIRES_IN',
            'BCRYPT_SALT_ROUNDS',
            'NEXT_PUBLIC_APP_URL',
        ];

        let envScore = 100;

        requiredVars.forEach(({ name, expected, validator }) => {
            const value = process.env[name];

            if (!value) {
                this.blockers.push(`❌ Missing required environment variable: ${name}`);
                envScore -= 30;
            } else if (expected && value !== expected) {
                this.blockers.push(`❌ Invalid ${name}: expected '${expected}', got '${value}'`);
                envScore -= 20;
            } else if (validator && !validator(value)) {
                this.blockers.push(`❌ Invalid ${name}: does not meet requirements`);
                envScore -= 25;
            } else {
                console.log(`  ${colors.green}✓${colors.reset} ${name}: OK`);
            }
        });

        optionalVars.forEach(name => {
            if (!process.env[name]) {
                this.warnings.push(`⚠️  Optional environment variable not set: ${name}`);
                envScore -= 5;
            } else {
                console.log(`  ${colors.green}✓${colors.reset} ${name}: OK`);
            }
        });

        this.score = Math.min(this.score, envScore);
        console.log(`  Environment Score: ${envScore}/100\n`);
    }

    /**
     * Check build configuration
     */
    checkBuildConfiguration() {
        console.log(`${colors.cyan}🏗️  Checking Build Configuration...${colors.reset}`);

        let buildScore = 100;

        // Check next.config.ts
        const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
        if (!fs.existsSync(nextConfigPath)) {
            this.blockers.push('❌ next.config.ts not found');
            buildScore -= 50;
        } else {
            console.log(`  ${colors.green}✓${colors.reset} next.config.ts: Found`);

            const configContent = fs.readFileSync(nextConfigPath, 'utf8');

            // Check for security headers
            if (!configContent.includes('headers()')) {
                this.warnings.push('⚠️  Security headers not configured in next.config.ts');
                buildScore -= 10;
            } else {
                console.log(`  ${colors.green}✓${colors.reset} Security headers: Configured`);
            }

            // Check for bundle analyzer
            if (!configContent.includes('withBundleAnalyzer')) {
                this.warnings.push('⚠️  Bundle analyzer not configured');
                buildScore -= 5;
            } else {
                console.log(`  ${colors.green}✓${colors.reset} Bundle analyzer: Configured`);
            }
        }

        // Check package.json
        const packagePath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

            // Check for production scripts
            const requiredScripts = ['build', 'start', 'test'];
            requiredScripts.forEach(script => {
                if (packageJson.scripts[script]) {
                    console.log(`  ${colors.green}✓${colors.reset} Script '${script}': Available`);
                } else {
                    this.blockers.push(`❌ Missing required script: ${script}`);
                    buildScore -= 15;
                }
            });
        }

        this.score = Math.min(this.score, buildScore);
        console.log(`  Build Score: ${buildScore}/100\n`);
    }

    /**
     * Check security configuration
     */
    checkSecurityConfiguration() {
        console.log(`${colors.cyan}🔒 Checking Security Configuration...${colors.reset}`);

        let securityScore = 100;

        // Check for sensitive files
        const sensitiveFiles = ['.env', '.env.local', '.env.production'];
        sensitiveFiles.forEach(file => {
            if (fs.existsSync(path.join(process.cwd(), file))) {
                this.warnings.push(`⚠️  Sensitive file detected: ${file} (ensure it's in .gitignore)`);
                securityScore -= 5;
            }
        });

        // Check .gitignore
        const gitignorePath = path.join(process.cwd(), '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

            const requiredIgnores = ['.env', 'node_modules', '.next'];
            requiredIgnores.forEach(ignore => {
                if (gitignoreContent.includes(ignore)) {
                    console.log(`  ${colors.green}✓${colors.reset} .gitignore includes: ${ignore}`);
                } else {
                    this.warnings.push(`⚠️  .gitignore missing: ${ignore}`);
                    securityScore -= 10;
                }
            });
        } else {
            this.blockers.push('❌ .gitignore file not found');
            securityScore -= 30;
        }

        // Check for security utilities
        const securityUtilsPath = path.join(process.cwd(), 'src', 'utils', 'security.ts');
        if (fs.existsSync(securityUtilsPath)) {
            console.log(`  ${colors.green}✓${colors.reset} Security utilities: Implemented`);
        } else {
            this.warnings.push('⚠️  Security utilities not found');
            securityScore -= 15;
        }

        this.score = Math.min(this.score, securityScore);
        console.log(`  Security Score: ${securityScore}/100\n`);
    }

    /**
     * Check performance configuration
     */
    checkPerformanceConfiguration() {
        console.log(`${colors.cyan}⚡ Checking Performance Configuration...${colors.reset}`);

        let performanceScore = 100;

        // Check for performance monitoring
        const perfUtilsPath = path.join(process.cwd(), 'src', 'utils', 'performance.ts');
        if (fs.existsSync(perfUtilsPath)) {
            console.log(`  ${colors.green}✓${colors.reset} Performance monitoring: Implemented`);
        } else {
            this.warnings.push('⚠️  Performance monitoring not found');
            performanceScore -= 20;
        }

        // Check for bundle analyzer
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

        if (packageJson.devDependencies['@next/bundle-analyzer']) {
            console.log(`  ${colors.green}✓${colors.reset} Bundle analyzer: Installed`);
        } else {
            this.warnings.push('⚠️  Bundle analyzer not installed');
            performanceScore -= 10;
        }

        // Check for performance scripts
        const perfScripts = ['audit:bundle', 'audit:performance'];
        perfScripts.forEach(script => {
            if (packageJson.scripts[script]) {
                console.log(`  ${colors.green}✓${colors.reset} Performance script '${script}': Available`);
            } else {
                this.warnings.push(`⚠️  Performance script missing: ${script}`);
                performanceScore -= 5;
            }
        });

        this.score = Math.min(this.score, performanceScore);
        console.log(`  Performance Score: ${performanceScore}/100\n`);
    }

    /**
     * Check dependencies for vulnerabilities
     */
    checkDependencies() {
        console.log(`${colors.cyan}📦 Checking Dependencies...${colors.reset}`);

        let depsScore = 100;

        const packagePath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

        // Check for outdated or vulnerable packages (simplified check)
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

        // Check for known problematic versions (simplified)
        const problematicPackages = [
            { name: 'lodash', versions: ['4.17.20'], issue: 'Known vulnerabilities' },
        ];

        let hasProblematicDeps = false;
        Object.keys(dependencies).forEach(dep => {
            const problematic = problematicPackages.find(p => p.name === dep);
            if (problematic) {
                this.warnings.push(`⚠️  Potentially vulnerable dependency: ${dep}`);
                hasProblematicDeps = true;
                depsScore -= 10;
            }
        });

        if (!hasProblematicDeps) {
            console.log(`  ${colors.green}✓${colors.reset} No known vulnerable dependencies detected`);
        }

        // Check for package-lock.json
        const lockPath = path.join(process.cwd(), 'package-lock.json');
        if (fs.existsSync(lockPath)) {
            console.log(`  ${colors.green}✓${colors.reset} package-lock.json: Present`);
        } else {
            this.warnings.push('⚠️  package-lock.json not found - dependency versions may vary');
            depsScore -= 15;
        }

        this.score = Math.min(this.score, depsScore);
        console.log(`  Dependencies Score: ${depsScore}/100\n`);
    }

    /**
     * Generate final report
     */
    generateReport() {
        console.log(`${colors.bold}${colors.magenta}📊 Production Readiness Report${colors.reset}\n`);

        // Overall score
        const scoreColor = this.score >= 90 ? colors.green : this.score >= 70 ? colors.yellow : colors.red;
        console.log(`${colors.bold}Overall Score: ${scoreColor}${this.score}/100${colors.reset}\n`);

        // Deployment status
        const isReady = this.blockers.length === 0;
        const statusColor = isReady ? colors.green : colors.red;
        const statusText = isReady ? '✅ READY FOR DEPLOYMENT' : '❌ NOT READY FOR DEPLOYMENT';
        console.log(`${colors.bold}Status: ${statusColor}${statusText}${colors.reset}\n`);

        // Blockers
        if (this.blockers.length > 0) {
            console.log(`${colors.bold}${colors.red}🚨 Critical Blockers (${this.blockers.length}):${colors.reset}`);
            this.blockers.forEach(blocker => console.log(`  ${blocker}`));
            console.log();
        }

        // Warnings
        if (this.warnings.length > 0) {
            console.log(`${colors.bold}${colors.yellow}⚠️  Warnings (${this.warnings.length}):${colors.reset}`);
            this.warnings.forEach(warning => console.log(`  ${warning}`));
            console.log();
        }

        // Recommendations
        if (this.blockers.length === 0 && this.warnings.length === 0) {
            console.log(`${colors.bold}${colors.green}🎉 Excellent! Your application is production-ready.${colors.reset}\n`);
            console.log(`${colors.green}Recommended next steps:${colors.reset}`);
            console.log(`  • Set up production monitoring and alerting`);
            console.log(`  • Configure automated backups`);
            console.log(`  • Plan for regular security audits`);
            console.log(`  • Set up CI/CD pipeline for future deployments\n`);
        } else {
            console.log(`${colors.bold}${colors.blue}💡 Next Steps:${colors.reset}`);
            if (this.blockers.length > 0) {
                console.log(`  1. ${colors.red}Fix all critical blockers before deployment${colors.reset}`);
            }
            if (this.warnings.length > 0) {
                console.log(`  2. ${colors.yellow}Address warnings for optimal production setup${colors.reset}`);
            }
            console.log(`  3. ${colors.green}Re-run this check after making changes${colors.reset}\n`);
        }

        // Exit with appropriate code
        process.exit(this.blockers.length > 0 ? 1 : 0);
    }
}

// Run the checker
const checker = new ProductionReadinessChecker();
checker.run().catch(error => {
    console.error(`${colors.red}❌ Production readiness check failed:${colors.reset}`, error);
    process.exit(1);
});

/**
 * Bundle Analysis Script
 * Analyzes bundle size and suggests optimizations
 */

const fs = require('fs');
const path = require('path');

// Analyze package.json dependencies
function analyzeDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const dependencies = packageData.dependencies || {};
  const devDependencies = packageData.devDependencies || {};
  
  console.log('\n🔍 DEPENDENCY ANALYSIS\n');
  console.log('📦 Production Dependencies:', Object.keys(dependencies).length);
  console.log('🛠️  Development Dependencies:', Object.keys(devDependencies).length);
  
  // Heavy dependencies that might need optimization
  const heavyDeps = [
    'react-query',
    'recharts', 
    'lucide-react',
    '@heroicons/react',
    'mongodb',
    'bcryptjs',
    'jsonwebtoken',
    'zod',
    'date-fns'
  ];
  
  const foundHeavyDeps = heavyDeps.filter(dep => dependencies[dep]);
  
  if (foundHeavyDeps.length > 0) {
    console.log('\n⚠️  Heavy Dependencies Found:');
    foundHeavyDeps.forEach(dep => {
      console.log(`   - ${dep}: ${dependencies[dep]}`);
    });
  }
  
  return { dependencies, devDependencies };
}

// Suggest optimizations
function suggestOptimizations() {
  console.log('\n🚀 OPTIMIZATION SUGGESTIONS\n');
  
  const suggestions = [
    {
      category: 'Bundle Splitting',
      items: [
        'Implement dynamic imports for heavy components',
        'Split vendor chunks from application code',
        'Lazy load non-critical routes',
        'Use React.lazy() for large components'
      ]
    },
    {
      category: 'Dependencies',
      items: [
        'Replace moment.js with date-fns (lighter)',
        'Use tree-shaking for icon libraries',
        'Consider lodash-es instead of lodash',
        'Audit unused dependencies'
      ]
    },
    {
      category: 'Code Optimization',
      items: [
        'Enable webpack tree shaking',
        'Remove console.logs in production',
        'Optimize images with next/image',
        'Use WebP/AVIF image formats'
      ]
    },
    {
      category: 'Caching',
      items: [
        'Implement service worker caching',
        'Set proper cache headers',
        'Use CDN for static assets',
        'Enable gzip/brotli compression'
      ]
    }
  ];
  
  suggestions.forEach(({ category, items }) => {
    console.log(`📋 ${category}:`);
    items.forEach(item => console.log(`   ✓ ${item}`));
    console.log('');
  });
}

// Check for common performance issues
function checkPerformanceIssues() {
  console.log('\n🔍 PERFORMANCE ISSUE DETECTION\n');
  
  const issues = [];
  
  // Check for large files that should be lazy loaded
  const srcDir = path.join(process.cwd(), 'src');
  
  function checkDirectory(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        checkDirectory(filePath, `${prefix}${file}/`);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const size = stat.size;
        
        // Flag large components (>10KB)
        if (size > 10000) {
          issues.push({
            type: 'Large Component',
            file: `${prefix}${file}`,
            size: Math.round(size / 1024) + 'KB',
            suggestion: 'Consider lazy loading or code splitting'
          });
        }
      }
    });
  }
  
  checkDirectory(srcDir);
  
  if (issues.length > 0) {
    console.log('⚠️  Potential Issues Found:');
    issues.forEach(issue => {
      console.log(`   ${issue.type}: ${issue.file} (${issue.size})`);
      console.log(`      → ${issue.suggestion}`);
    });
  } else {
    console.log('✅ No obvious performance issues detected');
  }
}

// Main analysis function
function main() {
  console.log('🎯 PIVABalance Bundle Analysis\n');
  console.log('=' .repeat(50));
  
  analyzeDependencies();
  suggestOptimizations();
  checkPerformanceIssues();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Analysis Complete!');
  console.log('\nNext steps:');
  console.log('1. Run: ANALYZE=true npm run build');
  console.log('2. Review bundle analyzer report');
  console.log('3. Implement suggested optimizations');
  console.log('4. Test performance improvements\n');
}

if (require.main === module) {
  main();
}

module.exports = { analyzeDependencies, suggestOptimizations, checkPerformanceIssues };

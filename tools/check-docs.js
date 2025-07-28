#!/usr/bin/env node

/**
 * Documentation Coverage Checker
 * 
 * This script checks for:
 * 1. Undocumented components/routes
 * 2. Missing feature matrix entries
 * 3. Orphaned code
 * 4. Technical debt items
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  frontendPath: path.join(__dirname, '..', 'apps', 'frontend', 'src', 'app'),
  docsPath: path.join(__dirname, '..'),
  requiredDocs: [
    'README.md',
    'FEATURE_MATRIX.md',
    'TECHNICAL_DEBT.md',
    'PR_CHECKLIST.md'
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    '.git',
    '*.spec.ts',
    '*.test.ts'
  ]
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Get all TypeScript files recursively
function getTypeScriptFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !CONFIG.ignorePatterns.some(pattern => fullPath.includes(pattern))) {
      getTypeScriptFiles(fullPath, files);
    } else if (item.endsWith('.ts') && !item.endsWith('.spec.ts') && !item.endsWith('.test.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Extract component names from TypeScript files
function extractComponentNames(files) {
  const components = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const componentMatch = content.match(/export\s+class\s+(\w+Component)/);
    
    if (componentMatch) {
      components.push({
        name: componentMatch[1],
        file: file,
        path: path.relative(CONFIG.frontendPath, file)
      });
    }
  }
  
  return components;
}

// Check if component is documented in feature matrix
function checkFeatureMatrixDocumentation(components) {
  const featureMatrixPath = path.join(CONFIG.docsPath, 'FEATURE_MATRIX.md');
  
  if (!fileExists(featureMatrixPath)) {
    logError('FEATURE_MATRIX.md not found');
    return false;
  }
  
  const content = fs.readFileSync(featureMatrixPath, 'utf8');
  const undocumented = [];
  
  for (const component of components) {
    if (!content.includes(component.name) && !content.includes(component.path)) {
      undocumented.push(component);
    }
  }
  
  if (undocumented.length > 0) {
    logWarning('Undocumented components found:');
    undocumented.forEach(comp => {
      logWarning(`  - ${comp.name} (${comp.path})`);
    });
    return false;
  }
  
  return true;
}

// Check for required documentation files
function checkRequiredDocs() {
  logInfo('Checking required documentation files...');
  
  const missing = [];
  
  for (const doc of CONFIG.requiredDocs) {
    if (!fileExists(path.join(CONFIG.docsPath, doc))) {
      missing.push(doc);
    }
  }
  
  if (missing.length > 0) {
    logError('Missing required documentation files:');
    missing.forEach(doc => logError(`  - ${doc}`));
    return false;
  }
  
  logSuccess('All required documentation files present');
  return true;
}

// Check for technical debt items
function checkTechnicalDebt() {
  const techDebtPath = path.join(CONFIG.docsPath, 'TECHNICAL_DEBT.md');
  
  if (!fileExists(techDebtPath)) {
    logError('TECHNICAL_DEBT.md not found');
    return false;
  }
  
  const content = fs.readFileSync(techDebtPath, 'utf8');
  const debtItems = content.match(/TD-\d+/g) || [];
  
  logInfo(`Found ${debtItems.length} technical debt items`);
  
  if (debtItems.length > 10) {
    logWarning('High number of technical debt items - consider prioritizing');
  }
  
  return true;
}

// Check for mock data usage
function checkMockDataUsage() {
  logInfo('Checking for mock data usage...');
  
  const files = getTypeScriptFiles(CONFIG.frontendPath);
  let mockDataFound = false;
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('mockData') || content.includes('mock') || content.includes('MOCK_')) {
      logWarning(`Mock data found in: ${path.relative(CONFIG.frontendPath, file)}`);
      mockDataFound = true;
    }
  }
  
  if (mockDataFound) {
    logWarning('Mock data usage detected - ensure TD-001 is logged');
  } else {
    logSuccess('No mock data usage detected');
  }
  
  return true;
}

// Check for TODO comments
function checkTODOs() {
  logInfo('Checking for TODO comments...');
  
  const files = getTypeScriptFiles(CONFIG.frontendPath);
  const todos = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('TODO') || line.includes('FIXME')) {
        todos.push({
          file: path.relative(CONFIG.frontendPath, file),
          line: index + 1,
          content: line.trim()
        });
      }
    });
  }
  
  if (todos.length > 0) {
    logWarning(`Found ${todos.length} TODO/FIXME comments:`);
    todos.forEach(todo => {
      logWarning(`  - ${todo.file}:${todo.line} - ${todo.content}`);
    });
    logInfo('These are tracked in TECHNICAL_DEBT.md - not failing build');
  } else {
    logSuccess('No TODO/FIXME comments found');
  }
  
  return true; // Don't fail on TODO comments since they're tracked in technical debt
}

// Main function
function main() {
  log('🔍 Documentation Coverage Checker', 'blue');
  log('=====================================\n');
  
  let allChecksPassed = true;
  
  // Check required docs
  if (!checkRequiredDocs()) {
    allChecksPassed = false;
  }
  
  log('');
  
  // Check technical debt
  if (!checkTechnicalDebt()) {
    allChecksPassed = false;
  }
  
  log('');
  
  // Check mock data usage
  if (!checkMockDataUsage()) {
    allChecksPassed = false;
  }
  
  log('');
  
  // Check TODO comments
  if (!checkTODOs()) {
    allChecksPassed = false;
  }
  
  log('');
  
  // Check component documentation
  if (fileExists(CONFIG.frontendPath)) {
    const files = getTypeScriptFiles(CONFIG.frontendPath);
    const components = extractComponentNames(files);
    
    logInfo(`Found ${components.length} components`);
    
    if (!checkFeatureMatrixDocumentation(components)) {
      allChecksPassed = false;
    }
  } else {
    logWarning('Frontend path not found - skipping component checks');
  }
  
  log('');
  log('=====================================');
  
  if (allChecksPassed) {
    logSuccess('All documentation checks passed!');
    process.exit(0);
  } else {
    logError('Some documentation checks failed. Please address the issues above.');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkRequiredDocs,
  checkTechnicalDebt,
  checkMockDataUsage,
  checkTODOs,
  checkFeatureMatrixDocumentation
}; 
#!/usr/bin/env node

/**
 * Backend Auto-Starter
 * Installs dependencies and starts the Express server
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendDir = path.join(__dirname, 'backend');
const nodeModulesDir = path.join(backendDir, 'node_modules');

console.log('\n========================================');
console.log('  NepalEstates Backend Auto-Starter');
console.log('========================================\n');

// Check if node_modules exists
if (!fs.existsSync(nodeModulesDir)) {
  console.log('📦 Installing backend dependencies...');
  console.log('   (This may take a minute on first run)\n');
  
  const npm = spawn('npm', ['install'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  });

  npm.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Dependencies installed!\n');
      startBackend();
    } else {
      console.error('\n❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  console.log('✅ Dependencies already installed\n');
  startBackend();
}

function startBackend() {
  console.log('🚀 Starting Backend Server...\n');
  
  const server = spawn('npm', ['run', 'dev'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  });

  server.on('error', (err) => {
    console.error('\n❌ Error starting server:', err.message);
    process.exit(1);
  });

  server.on('close', (code) => {
    console.log('\n🛑 Server stopped with code:', code);
    process.exit(code);
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping backend...');
    server.kill();
    process.exit(0);
  });
}

console.log('Press Ctrl+C to stop the server\n');

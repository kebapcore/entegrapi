#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building for Vercel deployment...');

// Build the frontend
console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Copy build output to correct location
console.log('Organizing build output...');
if (fs.existsSync('dist/public')) {
  fs.rmSync('dist/public', { recursive: true, force: true });
}
fs.mkdirSync('dist/public', { recursive: true });

// Copy from client/dist to dist/public
if (fs.existsSync('client/dist')) {
  const files = fs.readdirSync('client/dist');
  files.forEach(file => {
    const srcPath = path.join('client/dist', file);
    const destPath = path.join('dist/public', file);
    fs.cpSync(srcPath, destPath, { recursive: true });
  });
}

console.log('Build complete!');
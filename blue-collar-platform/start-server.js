import { execSync, exec } from 'child_process';

console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log('Starting development server...');
exec('npm run dev', { stdio: 'inherit' });

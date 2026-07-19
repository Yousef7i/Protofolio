import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const distAdminDir = path.join(distDir, 'admin');
const flutterWebDir = path.join(__dirname, 'flutter_web_build');
const tmpDist = path.join(__dirname, 'dist_tmp');

// 1. Build React
console.log('Building React App...');
execSync('vite build', { stdio: 'inherit' });

// 2. Move React build to /admin/
console.log('Moving React build to /admin...');
if (fs.existsSync(distAdminDir)) fs.rmSync(distAdminDir, { recursive: true });
fs.renameSync(distDir, tmpDist);
fs.mkdirSync(distDir);
fs.renameSync(tmpDist, distAdminDir);

// 3. Copy Flutter Web build to root /
console.log('Copying Flutter Web build to root...');
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(flutterWebDir)) {
  copyRecursiveSync(flutterWebDir, distDir);
} else {
  console.log('No flutter_web_build found!');
}

console.log('Merge complete. Ready for Cloudflare Pages!');

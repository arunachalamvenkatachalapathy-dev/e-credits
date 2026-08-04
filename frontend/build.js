import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(__dirname, 'dist');
const sourceHtml = path.resolve(rootDir, 'preview.html');

console.log('Building Netlify static distribution...');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(sourceHtml)) {
  fs.copyFileSync(sourceHtml, path.join(distDir, 'index.html'));
  fs.copyFileSync(sourceHtml, path.join(distDir, 'preview.html'));
  console.log('Successfully copied preview.html to dist/index.html and dist/preview.html!');
} else {
  console.error('Error: preview.html not found at root directory!');
}

import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(process.cwd(), '..');
const distDir = path.resolve(process.cwd(), 'dist');

let sourceHtml = path.resolve(rootDir, 'preview.html');
if (!fs.existsSync(sourceHtml)) {
  sourceHtml = path.resolve(process.cwd(), 'preview.html');
}

console.log('Building Netlify static distribution inside frontend...');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(sourceHtml)) {
  fs.copyFileSync(sourceHtml, path.join(distDir, 'index.html'));
  fs.copyFileSync(sourceHtml, path.join(distDir, 'preview.html'));
  console.log('Successfully copied preview.html to frontend/dist/index.html!');
}

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
  
  const excelFile = path.resolve(rootDir, 'GHG_Calculator_RECTIFIED_v6.xlsx');
  if (fs.existsSync(excelFile)) {
    fs.copyFileSync(excelFile, path.join(distDir, 'GHG_Calculator_RECTIFIED_v6.xlsx'));
  }
  console.log('Successfully copied preview.html and GHG_Calculator_RECTIFIED_v6.xlsx to dist!');
} else {
  console.error('Error: preview.html not found at root directory!');
}

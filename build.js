import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const sourceHtml = path.join(rootDir, 'preview.html');

console.log('Building NetZeroCalc static distribution from root...');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(sourceHtml)) {
  fs.copyFileSync(sourceHtml, path.join(distDir, 'index.html'));
  fs.copyFileSync(sourceHtml, path.join(distDir, 'preview.html'));
  
  const excelFile = path.join(rootDir, 'GHG_Calculator_RECTIFIED_v6.xlsx');
  if (fs.existsSync(excelFile)) {
    fs.copyFileSync(excelFile, path.join(distDir, 'GHG_Calculator_RECTIFIED_v6.xlsx'));
  }
  console.log('Successfully copied preview.html to dist/index.html!');
} else {
  console.error('Error: preview.html not found!');
  process.exit(1);
}

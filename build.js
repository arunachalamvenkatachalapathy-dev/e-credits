import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const parentDir = path.dirname(rootDir);

// Search for preview.html in current or parent dir
let sourceHtml = path.join(rootDir, 'preview.html');
if (!fs.existsSync(sourceHtml) && fs.existsSync(path.join(parentDir, 'preview.html'))) {
  sourceHtml = path.join(parentDir, 'preview.html');
}

const excelFile = fs.existsSync(path.join(rootDir, 'GHG_Calculator_RECTIFIED_v6.xlsx'))
  ? path.join(rootDir, 'GHG_Calculator_RECTIFIED_v6.xlsx')
  : path.join(parentDir, 'GHG_Calculator_RECTIFIED_v6.xlsx');

console.log('Building NetZeroCalc static distribution...');

const targets = [
  path.join(rootDir, 'dist', 'index.html'),
  path.join(rootDir, 'dist', 'preview.html'),
  path.join(rootDir, 'index.html'),
  path.join(rootDir, 'preview.html')
];

if (fs.existsSync(path.join(rootDir, 'frontend'))) {
  targets.push(path.join(rootDir, 'frontend', 'dist', 'index.html'));
  targets.push(path.join(rootDir, 'frontend', 'dist', 'preview.html'));
  targets.push(path.join(rootDir, 'frontend', 'public', 'index.html'));
}

targets.forEach(targetPath => {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(sourceHtml, targetPath);
  console.log(`Copied preview.html -> ${targetPath}`);

  if (fs.existsSync(excelFile)) {
    const excelTarget = path.join(dir, 'GHG_Calculator_RECTIFIED_v6.xlsx');
    fs.copyFileSync(excelFile, excelTarget);
  }
});

console.log('Build completed successfully!');

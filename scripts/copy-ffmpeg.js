const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'node_modules', '@ffmpeg', 'core', 'dist');
const umdDir = path.join(baseDir, 'umd');
const srcDir = fs.existsSync(umdDir) ? umdDir : baseDir;
const destDir = path.join(process.cwd(), 'public', 'ffmpeg');

if (!fs.existsSync(srcDir)) {
  console.warn(`@ffmpeg/core not found at ${srcDir}. Skipping copy.`);
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });

const expectedFiles = ['ffmpeg-core.js', 'ffmpeg-core.wasm', 'ffmpeg-core.worker.js'];
for (const file of expectedFiles) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file}`);
  } else {
    console.warn(`Missing ${file}`);
  }
}

console.log('Copied @ffmpeg/core files to public/ffmpeg');

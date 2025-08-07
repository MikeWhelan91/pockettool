const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'node_modules', '@ffmpeg', 'core', 'dist');
const destDir = path.join(process.cwd(), 'public', 'ffmpeg');

if (!fs.existsSync(srcDir)) {
  console.warn(`@ffmpeg/core not found at ${srcDir}. Skipping copy.`);
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
for (const file of fs.readdirSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
}

console.log('Copied @ffmpeg/core files to public/ffmpeg');


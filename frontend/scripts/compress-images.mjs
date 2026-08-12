/**
 * Compress logo and icon PNGs using sharp.
 * Run: node scripts/compress-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, copyFile } from 'fs/promises';
import path from 'path';

const PUBLIC = './public';

async function compressFile(filePath, quality = 80) {
  const info = await stat(filePath);
  const originalSize = info.size;

  const buf = await sharp(filePath)
    .png({ quality, compressionLevel: 9, palette: true })
    .toBuffer();

  // Only write if smaller
  if (buf.length < originalSize) {
    await sharp(buf).toFile(filePath);
    console.log(
      `  ✓ ${path.basename(filePath)}: ${originalSize} → ${buf.length} bytes (${Math.round((1 - buf.length / originalSize) * 100)}% reduction)`
    );
  } else {
    console.log(`  – ${path.basename(filePath)}: already optimal (${originalSize} bytes)`);
  }
}

async function main() {
  console.log('Compressing logo PNGs...');
  await compressFile(path.join(PUBLIC, 'logo.png'));
  await compressFile(path.join(PUBLIC, 'newlogo.png'));

  console.log('\nCompressing icon PNGs...');
  const iconsDir = path.join(PUBLIC, 'icons');
  const icons = await readdir(iconsDir);
  for (const icon of icons.filter(f => f.endsWith('.png'))) {
    await compressFile(path.join(iconsDir, icon));
  }

  console.log('\nDone!');
}

main().catch(console.error);

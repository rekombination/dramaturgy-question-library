const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const inputDir = path.join(process.cwd(), 'public/images/posts');

const sizes = [
  { width: 400, suffix: '-sm' },
  { width: 800, suffix: '-md' },
  { width: 1200, suffix: '-lg' },
];

async function findImages() {
  try {
    const files = await fs.readdir(inputDir);
    // Find all JPG, JPEG, and PNG files that are NOT already optimized versions
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      const isSourceFormat = ['.jpg', '.jpeg', '.png'].includes(ext);
      const isNotOptimized = !file.includes('-sm') && !file.includes('-md') && !file.includes('-lg');
      return isSourceFormat && isNotOptimized;
    });
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

async function shouldOptimize(inputPath, outputPath) {
  try {
    const [inputStat, outputStat] = await Promise.all([
      fs.stat(inputPath),
      fs.stat(outputPath).catch(() => null)
    ]);

    // Optimize if output doesn't exist or input is newer
    return !outputStat || inputStat.mtime > outputStat.mtime;
  } catch {
    return true;
  }
}

async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const baseName = path.basename(imagePath, ext);
  const inputPath = path.join(inputDir, imagePath);

  console.log(`\nProcessing ${imagePath}...`);
  let optimized = false;

  for (const size of sizes) {
    const outputBaseName = `${baseName}${size.suffix}`;

    // WebP
    const webpPath = path.join(inputDir, `${outputBaseName}.webp`);
    if (await shouldOptimize(inputPath, webpPath)) {
      await sharp(inputPath)
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(webpPath);
      console.log(`  ✓ Created ${outputBaseName}.webp`);
      optimized = true;
    } else {
      console.log(`  ⏭ Skipped ${outputBaseName}.webp (up to date)`);
    }

    // AVIF
    const avifPath = path.join(inputDir, `${outputBaseName}.avif`);
    if (await shouldOptimize(inputPath, avifPath)) {
      await sharp(inputPath)
        .resize(size.width, null, { withoutEnlargement: true })
        .avif({ quality: 80 })
        .toFile(avifPath);
      console.log(`  ✓ Created ${outputBaseName}.avif`);
      optimized = true;
    } else {
      console.log(`  ⏭ Skipped ${outputBaseName}.avif (up to date)`);
    }
  }

  return optimized;
}

async function optimizeImages() {
  console.log('🔍 Scanning for images in public/images/posts/...\n');

  const images = await findImages();

  if (images.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  console.log(`Found ${images.length} image(s) to process:\n${images.map(img => `  - ${img}`).join('\n')}\n`);

  let totalOptimized = 0;
  for (const image of images) {
    const wasOptimized = await optimizeImage(image);
    if (wasOptimized) totalOptimized++;
  }

  console.log(`\n✅ Image optimization complete! (${totalOptimized}/${images.length} processed)`);
}

optimizeImages().catch(error => {
  console.error('❌ Error optimizing images:', error);
  process.exit(1);
});

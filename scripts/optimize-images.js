const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(process.cwd(), 'public/images/posts');
const images = ['dramarurgy.jpg', 'dramarurgy-1.jpg', 'dramarurgy-2.jpg'];

const sizes = [
  { width: 400, suffix: '-sm' },
  { width: 800, suffix: '-md' },
  { width: 1200, suffix: '-lg' },
];

async function optimizeImages() {
  for (const image of images) {
    const inputPath = path.join(inputDir, image);
    const baseName = path.basename(image, '.jpg');

    console.log(`\nProcessing ${image}...`);

    for (const size of sizes) {
      const outputBaseName = `${baseName}${size.suffix}`;

      // WebP
      const webpPath = path.join(inputDir, `${outputBaseName}.webp`);
      await sharp(inputPath)
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(webpPath);
      console.log(`  ✓ Created ${outputBaseName}.webp`);

      // AVIF
      const avifPath = path.join(inputDir, `${outputBaseName}.avif`);
      await sharp(inputPath)
        .resize(size.width, null, { withoutEnlargement: true })
        .avif({ quality: 80 })
        .toFile(avifPath);
      console.log(`  ✓ Created ${outputBaseName}.avif`);
    }
  }

  console.log('\n✅ All images optimized!');
}

optimizeImages().catch(console.error);

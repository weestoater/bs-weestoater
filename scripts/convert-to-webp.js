// Script to convert large images to WebP format
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const images = [
  "src/assets/img/Landie/lightweight.jpg",
  "src/assets/img/mob-programming.jpg",
  "src/assets/img/buster.jpg",
];

async function convertToWebP(imagePath) {
  const parsed = path.parse(imagePath);
  const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

  try {
    await sharp(imagePath).webp({ quality: 85 }).toFile(webpPath);

    const originalStats = await fs.stat(imagePath);
    const webpStats = await fs.stat(webpPath);
    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(
      1
    );

    console.log(
      `✓ ${parsed.base} -> ${parsed.name}.webp (${savings}% smaller)`
    );
  } catch (error) {
    console.error(`✗ Failed to convert ${imagePath}:`, error.message);
  }
}

async function main() {
  console.log("Converting images to WebP...\n");

  for (const image of images) {
    await convertToWebP(image);
  }

  console.log("\n✓ All images converted successfully!");
}

main();

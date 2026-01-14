import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import * as thumbhash from "thumbhash";
import sharp from "sharp";

const spacesDir = path.resolve("content/1.spaces");
const wordsDir = path.resolve("content/2.words");
const aboutDir = path.resolve("content/3.about");

function getImagePath(src) {
  if (src.startsWith("/")) {
    return path.join(process.cwd(), "public", src);
  }
  // For relative paths, look in public/uploads
  return path.join(process.cwd(), "public", "uploads", src);
}

async function generateThumbhash(imagePath) {
  try {
    const imageBuffer = await sharp(imagePath).resize(40).toBuffer();

    // Extract RGB and alpha data from the image
    const { data: imageData, info } = await sharp(imageBuffer)
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    // Create thumbhash
    const hash = thumbhash.rgbaToThumbHash(info.width, info.height, imageData);
    const ratio = thumbhash.thumbHashToApproximateAspectRatio(hash);

    // console.log("Thumbhash ratio", ratio);

    return {
      hash: Buffer.from(hash).toString("base64"),
      ratio,
    };
  } catch (err) {
    console.error(`Error generating thumbhash: ${err.message}`);
    return null;
  }
}

async function updateImageDimensionsForPath(filePath, file) {
  const content = await fs.readFile(filePath, "utf8");
  const parsed = matter(content);
  let changed = false;

  if (Array.isArray(parsed.data.images)) {
    for (let image of parsed.data.images) {
      const imgPath = getImagePath(image.src);
      let updateNeeded = false;

      // Check if dimensions need to be updated
      if (!image.width || !image.height) {
        try {
          const metadata = await sharp(imgPath).metadata();
          image.width = metadata.width;
          image.height = metadata.height;
          image.ratio = metadata.width / metadata.height;
          // console.log("Image ratio", image.ratio);
          updateNeeded = true;

          changed = true;
        } catch (err) {
          console.error(
            `Error reading image dimensions ${image.src} in ${file}: ${err.message}`
          );
        }
      }

      // Check if thumbhash needs to be generated
      if (!image.thumbhash) {
        try {
          const { hash, ratio } = await generateThumbhash(imgPath);
          if (hash) {
            image.thumbhash = hash;
            image.thumbhashRatio = ratio;
            updateNeeded = true;
            changed = true;
          }
        } catch (err) {
          console.error(
            `Error generating thumbhash for ${image.src} in ${file}: ${err.message}`
          );
        }
      }

      if (updateNeeded) {
        console.log(`Updated info for ${image.src} in ${file}`);
      }
    }
  }

  if (changed) {
    const newContent = matter.stringify(parsed.content, parsed.data, {
      lineWidth: -1, // Prevent line wrapping in YAML
      noCompatMode: true, // Ensure consistent output
    });
    await fs.writeFile(filePath, newContent, "utf8");
    console.log(`Updated ${file}`);
  }
}

async function updateImageDimensions() {
  // Process all markdown files in spaces directory
  const spacesFiles = await fs.readdir(spacesDir);
  for (const file of spacesFiles) {
    if (file.endsWith(".md")) {
      const filePath = path.join(spacesDir, file);
      await updateImageDimensionsForPath(filePath, `1.spaces/${file}`);
    }
  }

  // Process all markdown files in words directory
  const wordsFiles = await fs.readdir(wordsDir);
  for (const file of wordsFiles) {
    if (file.endsWith(".md")) {
      const filePath = path.join(wordsDir, file);
      await updateImageDimensionsForPath(filePath, `2.words/${file}`);
    }
  }

  // Process all markdown files in about directory
  const aboutFiles = await fs.readdir(aboutDir);
  for (const file of aboutFiles) {
    if (file.endsWith(".md")) {
      const filePath = path.join(aboutDir, file);
      await updateImageDimensionsForPath(filePath, `3.about/${file}`);
    }
  }
}

updateImageDimensions().catch((err) => {
  console.error(err);
});

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// Downscale oversized source images in place so the @nuxt/image / IPX pipeline
// has far less work to do at build time and the deploy ships lighter masters.
// Idempotent: an image already within MAX_EDGE is left untouched, so this is
// safe to run on every build. Aspect ratio is preserved, so the width/height
// /ratio stored in content frontmatter stay valid for layout.
//
// Originals are recoverable from git history if a different ceiling is wanted.

const uploadsDir = path.resolve("public/uploads");
const MAX_EDGE = 2400; // longest side, in px
const JPEG_QUALITY = 82;

const exts = new Set([".jpg", ".jpeg", ".png"]);

function fmt(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function resizeOne(filePath, file) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return 0;

  const before = (await fs.stat(filePath)).size;
  const image = sharp(filePath, { failOn: "none" });
  const meta = await image.metadata();
  const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);

  if (longEdge <= MAX_EDGE) return 0; // already small enough

  // Match the existing pipeline: do NOT auto-rotate, keep EXIF so display is
  // unchanged. Only the longer edge is constrained; aspect ratio is kept.
  let pipeline = image
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside" })
    .withMetadata();

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const buffer = await pipeline.toBuffer();

  // Don't grow a file that was already efficiently encoded.
  if (buffer.length >= before) return 0;

  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, buffer);
  await fs.rename(tmp, filePath);

  const saved = before - buffer.length;
  console.log(
    `Resized ${file}: ${longEdge}px -> ${MAX_EDGE}px, ${fmt(before)} -> ${fmt(
      buffer.length
    )} (saved ${fmt(saved)})`
  );
  return saved;
}

async function run() {
  const files = await fs.readdir(uploadsDir);
  let totalSaved = 0;
  let count = 0;

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    try {
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;
      const saved = await resizeOne(filePath, file);
      if (saved > 0) {
        totalSaved += saved;
        count++;
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }

  console.log(
    `\nDone. Resized ${count} image(s), saved ${fmt(totalSaved)} total.`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

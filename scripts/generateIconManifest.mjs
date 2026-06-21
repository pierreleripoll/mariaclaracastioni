import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import sharp from "sharp";

const contentDirs = [
  path.resolve("content/1.spaces"),
  path.resolve("content/2.words"),
  path.resolve("content/3.about"),
];

const outFile = path.resolve("assets/icons.generated.json");

// Icons are sized by a blend between two strategies (both preserve each icon's
// aspect ratio — they only change its scale). Transparent padding is trimmed
// first so this is based on the actual artwork, not the export canvas.
//   BLEND = 0 → "contain" each icon in a fixed BOX_W×BOX_H box: thin/wide icons
//               end up visually small (the original behaviour).
//   BLEND = 1 → equal visual AREA for every icon: thin icons grow taller, wide
//               icons grow wider, all covering the same footprint.
// 0.5 is the in-between: off-ratio icons are a bit smaller than square-ish ones,
// but not as tiny as a pure box-fit.
const BOX_W = 100;
const BOX_H = 141;
const TARGET_AREA = BOX_W * BOX_H;
const BLEND = 0.5;
const SCALE = 0.85; // uniform shrink applied to every icon (1 = previous size)
const DENSITY = 2; // render at 2× the display size for retina crispness
const WEBP_QUALITY = 82;

function getImagePath(src) {
  if (src.startsWith("/")) {
    return path.join(process.cwd(), "public", src);
  }
  // For relative paths, look in public/uploads
  return path.join(process.cwd(), "public", "uploads", src);
}

async function collectIconPaths() {
  const icons = new Set();
  for (const dir of contentDirs) {
    let files;
    try {
      files = await fs.readdir(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const parsed = matter(await fs.readFile(path.join(dir, file), "utf8"));
      if (parsed.data.icon) icons.add(parsed.data.icon);
    }
  }
  return [...icons];
}

async function generateIconManifest() {
  const iconPaths = await collectIconPaths();
  const manifest = {};

  for (const icon of iconPaths) {
    try {
      // Trim transparent/uniform borders so we normalize the real artwork.
      const trimmed = await sharp(getImagePath(icon))
        .trim()
        .toBuffer({ resolveWithObject: true });

      const ratio = trimmed.info.width / trimmed.info.height; // w / h

      // Equal-area target: w = √(A·r) (⇒ w·h = A for every icon).
      const widthEqualArea = Math.sqrt(TARGET_AREA * ratio);
      // Contain-in-box target: largest size that fits inside BOX_W×BOX_H.
      const widthBoxFit =
        ratio >= BOX_W / BOX_H ? BOX_W : BOX_H * ratio;
      // Blend the two (both share ratio `r`, so the ratio is preserved).
      const displayWidth = Math.round(
        (widthBoxFit + (widthEqualArea - widthBoxFit) * BLEND) * SCALE
      );

      const out = await sharp(trimmed.data)
        .resize({ width: displayWidth * DENSITY }) // height follows the ratio
        .webp({ quality: WEBP_QUALITY })
        .toBuffer({ resolveWithObject: true });

      const w = Math.round(out.info.width / DENSITY);
      const h = Math.round(out.info.height / DENSITY);
      manifest[icon] = {
        src: `data:image/webp;base64,${out.data.toString("base64")}`,
        w,
        h,
      };
      console.log(
        `Inlined ${icon} → ${w}×${h} (${(out.data.length / 1024).toFixed(1)} KB)`
      );
    } catch (err) {
      console.error(`Skipping icon ${icon}: ${err.message}`);
    }
  }

  await fs.writeFile(outFile, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(
    `Wrote ${Object.keys(manifest).length} icons to ${path.relative(process.cwd(), outFile)}`
  );
}

generateIconManifest().catch((err) => {
  console.error(err);
  process.exit(1);
});

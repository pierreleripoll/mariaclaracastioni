import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import sharp from "sharp";

const contentDirs = [
  path.resolve("content/1.spaces"),
  path.resolve("content/2.words"),
  path.resolve("content/3.about"),
];

// Each icon is written as its own small WebP file in public/icons/. The
// manifest only keeps the URL and the display size (about 1 KB), so it is
// imported as a JS module and is there at SSR time. The <img> tags are then in
// the HTML, and the browser starts to download the icons before any JS runs.
const iconsDir = path.resolve("public/icons");
const outFile = path.resolve("assets/icons.generated.json");

// "/uploads/D'une dérive.png" -> "d-une-derive"
function slugify(src) {
  return path
    .basename(src, path.extname(src))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  const usedNames = new Set();

  // The folder only holds generated files: start clean so removed icons go away.
  await fs.rm(iconsDir, { recursive: true, force: true });
  await fs.mkdir(iconsDir, { recursive: true });
  await fs.mkdir(path.dirname(outFile), { recursive: true });

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

      let name = slugify(icon) || "icon";
      for (let i = 2; usedNames.has(name); i++) name = `${slugify(icon)}-${i}`;
      usedNames.add(name);
      await fs.writeFile(path.join(iconsDir, `${name}.webp`), out.data);

      const w = Math.round(out.info.width / DENSITY);
      const h = Math.round(out.info.height / DENSITY);
      manifest[icon] = { src: `/icons/${name}.webp`, w, h };
      console.log(
        `Wrote ${icon} → icons/${name}.webp ${w}×${h} (${(out.data.length / 1024).toFixed(1)} KB)`
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

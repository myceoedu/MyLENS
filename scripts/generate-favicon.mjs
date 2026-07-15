import { writeFileSync } from "node:fs";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const SOURCE = "public/images/icon.png";
const ICO_SIZES = [16, 32, 48, 64, 128, 256];

/** Trim black letterboxing, then fill a square canvas like a proper tab icon. */
async function toSquarePng(size) {
  return sharp(SOURCE)
    .trim({ threshold: 40 })
    .resize(size, size, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: size <= 32 ? 0.6 : 0.3 })
    .png()
    .toBuffer();
}

const icoPngs = await Promise.all(ICO_SIZES.map((size) => toSquarePng(size)));
const icoBuffer = await pngToIco(icoPngs);

const icon32 = icoPngs[1];
const apple180 = await toSquarePng(180);

for (const target of ["public/favicon.ico", "app/favicon.ico"]) {
  writeFileSync(target, icoBuffer);
  console.log(`Wrote ${target} (${icoBuffer.length} bytes)`);
}

writeFileSync("app/icon.png", icon32);
console.log("Wrote app/icon.png (32x32)");

writeFileSync("app/apple-icon.png", apple180);
console.log("Wrote app/apple-icon.png (180x180)");

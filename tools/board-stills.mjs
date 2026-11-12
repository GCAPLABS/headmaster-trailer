// Render many stills of Film2 from one bundle, for picture boards and critique sheets.
// usage: node tools/board-stills.mjs <outDir> <frame> [frame ...]   (scale 0.5, swangle GL)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, ...frames] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id: 'Film2', chromiumOptions: {gl: 'swangle'}});
for (const f of frames.map(Number)) {
  const output = path.join(outDir, `f${String(f).padStart(4, '0')}.png`);
  await renderStill({serveUrl, composition, frame: f, output, scale: Number(process.env.SCALE ?? 0.5), chromiumOptions: {gl: 'swangle'}});
  console.log(output);
}

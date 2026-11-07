import {Config} from '@remotion/cli/config';
import fs from 'fs';
import path from 'path';
// Cloud sessions ship a Playwright headless shell; use it when present so Remotion needs no browser download.
const pw = '/opt/pw-browsers';
const shell = fs.existsSync(pw)
  ? fs.readdirSync(pw).filter((d) => d.startsWith('chromium_headless_shell')).map((d) => path.join(pw, d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p))
  : undefined;
if (shell) Config.setBrowserExecutable(shell);
Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(14);
Config.setPixelFormat('yuv420p');

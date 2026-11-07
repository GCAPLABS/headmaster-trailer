#!/usr/bin/env node
/**
 * Clean Gmail re-take: connect to a normal Chrome (CDP :9222), no Playwright launch flags.
 * Requires Chrome already running with --remote-debugging-port=9222 and the trailer profile.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REC = path.join(ROOT, "public/rec");
const SUBJECT = "Friday plans";
fs.mkdirSync(REC, { recursive: true });

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("exit", (c) => (c === 0 ? resolve(out) : reject(new Error(`${cmd} → ${c}\n${out}`))));
  });
}

async function hideDock(hide) {
  await run("defaults", ["write", "com.apple.dock", "autohide", "-bool", hide ? "true" : "false"]);
  try {
    await run("killall", ["Dock"]);
  } catch {
    /* Dock relaunches */
  }
  await sleep(1600);
}

async function activateChrome() {
  await run("osascript", ["-e", 'tell application "Google Chrome" to activate', "-e", "delay 0.4"]);
}

async function chromeFullscreen(wantOn) {
  await activateChrome();
  // Always send the shortcut when turning on (AXFullScreen is flaky under CDP).
  await run("osascript", [
    "-e",
    `tell application "System Events" to tell process "Google Chrome"
      set frontmost to true
      delay 0.4
      if ${wantOn ? "true" : "false"} then
        keystroke "f" using {control down, command down}
        delay 1.6
      else
        set isFS to false
        try
          set isFS to value of attribute "AXFullScreen" of window 1
        end try
        if isFS then
          keystroke "f" using {control down, command down}
          delay 1.0
        end if
      end if
    end tell`,
  ]);
  await sleep(800);
}

async function zoom175(page) {
  // CDP key events — System Events zoom was not sticking under automation.
  const client = await page.context().newCDPSession(page);
  const meta = 4; // Command
  const tap = async (key, code) => {
    await client.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      modifiers: meta,
      windowsVirtualKeyCode: code,
      nativeVirtualKeyCode: code,
      key,
    });
    await client.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      modifiers: meta,
      windowsVirtualKeyCode: code,
      nativeVirtualKeyCode: code,
      key,
    });
    await sleep(160);
  };
  await tap("0", 48); // reset 100%
  for (let i = 0; i < 4; i++) await tap("=", 187); // → 175%
  await sleep(400);
}

async function dismissPopups(page) {
  for (const re of [/No thanks/i, /Not now/i, /No, thanks/i, /Got it/i]) {
    const btn = page.getByRole("button", { name: re }).first();
    if (await btn.count()) {
      try {
        await btn.click({ timeout: 1500 });
        console.log("dismiss", String(re));
        await sleep(400);
      } catch {
        /* */
      }
    }
  }
  // Close Chrome yellow/grey infobar if present (click X)
  try {
    await page.locator("#infobar-close, .infobar-close, button[aria-label='Close']").first().click({ timeout: 800 });
  } catch {
    /* */
  }
}

async function chromeCropFilter() {
  // Crop ffmpeg to the Chrome window so Dock/menu/other apps never appear.
  try {
    const raw = await run("osascript", [
      "-e",
      'tell application "Google Chrome" to get bounds of front window',
    ]);
    // "0, 25, 1920, 1080"
    const nums = raw.split(/,\s*/).map((s) => parseInt(s, 10));
    if (nums.length === 4 && nums.every((n) => Number.isFinite(n))) {
      const [x1, y1, x2, y2] = nums;
      const w = Math.max(640, x2 - x1);
      const h = Math.max(480, y2 - y1);
      return `crop=${w}:${h}:${x1}:${y1},scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2`;
    }
  } catch {
    /* */
  }
  return "scale=1920:1080";
}

async function startRec(name) {
  const out = path.join(REC, name);
  const vf = await chromeCropFilter();
  console.log("ffmpeg vf", vf);
  const ff = spawn(
    "ffmpeg",
    [
      "-y",
      "-f",
      "avfoundation",
      "-framerate",
      "60",
      "-capture_cursor",
      "1",
      "-i",
      "0:none",
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-crf",
      "16",
      "-preset",
      "fast",
      "-pix_fmt",
      "yuv420p",
      "-an",
      out,
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  return {
    stop: async () => {
      await sleep(1000);
      if (!ff.killed) {
        ff.kill("SIGINT");
        await new Promise((r) => ff.on("close", r));
      }
      console.log(`DONE ${name} (${(fs.statSync(out).size / 1e6).toFixed(1)} MB)`);
    },
  };
}

async function slowMove(page, x, y, steps = 50) {
  await page.mouse.move(x, y, { steps });
  await sleep(1000);
}

async function gotoInbox(page) {
  // Prefer the inbox where "Friday plans" arrives FROM Glitch Labs (not "me").
  // Try u/0 then u/1 and pick the one that is NOT glitchcaplabs if both work.
  for (const u of [0, 1]) {
    await page.goto(`https://mail.google.com/mail/u/${u}/#inbox`, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await sleep(3500);
    if (/accounts\.google\.com|ServiceLogin/i.test(page.url())) {
      console.log("skip u/" + u + " need sign-in");
      continue;
    }
    try {
      await page.getByRole("button", { name: /Compose/i }).first().waitFor({ timeout: 20000 });
    } catch {
      continue;
    }
    const title = await page.title();
    console.log("inbox", u, title);
    // Prefer mutvayzz / non-glitchcaplabs so sender reads "Glitch Labs"
    if (!/glitchcaplabs/i.test(title)) {
      console.log("using u/" + u);
      return u;
    }
    // keep looking; fall back to this if nothing else
  }
  // Fallback: whatever is open
  if (/accounts\.google\.com|ServiceLogin/i.test(page.url())) {
    throw new Error("NEED_SIGN_IN " + page.url());
  }
  await page.getByRole("button", { name: /Compose/i }).first().waitFor({ timeout: 45000 });
  return 0;
}

async function findRow(page) {
  const row = page.locator(`tr.zA:has-text("${SUBJECT}")`).first();
  if (await row.count()) return row;
  const any = page.locator(`tr:has-text("${SUBJECT}")`).first();
  if (await any.count()) return any;
  return null;
}

async function prep(page) {
  await hideDock(true);
  // Hide other apps so they don't peek into the Chrome crop
  await run("osascript", [
    "-e",
    'tell application "System Events" to set visible of every process whose background only is false and name is not "Google Chrome" and name is not "Finder" to false',
  ]).catch(() => "");
  await activateChrome();
  await run("osascript", [
    "-e",
    'tell application "Google Chrome" to set bounds of front window to {0, 0, 1920, 1080}',
  ]).catch(() => "");
  await sleep(400);
  await dismissPopups(page);
  await chromeFullscreen(true);
  await sleep(800);
  await dismissPopups(page);
  await zoom175(page);
  // Hard guarantee: CSS zoom so the mail body is large even if Chrome zoom fails
  await page.evaluate(() => {
    document.documentElement.style.zoom = "1.75";
  }).catch(() => {});
  await dismissPopups(page);
  await sleep(500);
}

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const context = browser.contexts()[0] || (await browser.newContext());
const page = context.pages()[0] || (await context.newPage());

try {
  const mailU = await gotoInbox(page);
  await prep(page);
  console.log("recording as u/" + mailU);

  // --- inbox ---
  // Stay on a view where the row is actually mounted (inbox, else search).
  await page.goto(`https://mail.google.com/mail/u/${mailU}/#inbox`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await sleep(2500);
  await prep(page);
  let row = await findRow(page);
  if (!row) {
    await page.goto(
      `https://mail.google.com/mail/u/${mailU}/#search/subject%3A(${encodeURIComponent(SUBJECT)})`,
      { waitUntil: "domcontentloaded", timeout: 60000 }
    );
    await sleep(2500);
    await prep(page);
    row = await findRow(page);
  }
  if (!row) throw new Error(`No "${SUBJECT}" row`);

  await dismissPopups(page);
  await row.scrollIntoViewIfNeeded().catch(() => {});
  let box = await row.boundingBox({ timeout: 10000 });
  const rec1 = await startRec("gmail-inbox.mov");
  await sleep(1000);
  if (box) {
    const x = box.x + Math.min(400, box.width * 0.4);
    const y = box.y + box.height / 2;
    await slowMove(page, x, y, 55);
    await sleep(1000);
    await page.mouse.click(x, y);
  } else {
    await row.click({ timeout: 10000 });
  }
  await sleep(2200);
  await rec1.stop();

  // --- read ---
  await dismissPopups(page);
  await sleep(500);
  const rec2 = await startRec("gmail-read.mov");
  await sleep(1000);
  await sleep(6000);
  await page.mouse.wheel(0, 120);
  await sleep(1500);
  await rec2.stop();

  // --- reply ---
  await dismissPopups(page);
  // Prefer visible Reply control; fall back to Gmail `r` shortcut
  let replyBtn = page.locator('div[role="button"][aria-label*="Reply"]').first();
  if (!(await replyBtn.count())) replyBtn = page.getByText(/^Reply$/).first();
  const rec3 = await startRec("gmail-reply.mov");
  await sleep(1000);
  try {
    await replyBtn.scrollIntoViewIfNeeded({ timeout: 5000 });
    const rb = await replyBtn.boundingBox();
    if (rb) {
      await slowMove(page, rb.x + rb.width / 2, rb.y + rb.height / 2, 35);
      await sleep(800);
      await page.mouse.click(rb.x + rb.width / 2, rb.y + rb.height / 2);
    } else {
      await page.keyboard.press("r");
    }
  } catch {
    await page.keyboard.press("r");
  }
  await sleep(4500);
  await rec3.stop();

  console.log("ALL_RECORDED");
} catch (e) {
  console.error("FAIL", e);
  process.exitCode = 1;
} finally {
  // Restore UI without awaiting flaky AppleScript forever
  hideDock(false).catch(() => {});
  console.log("done");
  process.exit(process.exitCode || 0);
}

#!/usr/bin/env node
/**
 * Real Chrome Gmail captures for the Headmaster trailer.
 *   node tools/gmail-captures.mjs          # send + record all three
 *   node tools/gmail-captures.mjs send     # only seed the email
 *   node tools/gmail-captures.mjs record   # only record (email already there)
 *   node tools/gmail-captures.mjs open     # open inbox and wait
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROFILE = "/tmp/chrome-trailer-profile";
const REC = path.join(ROOT, "public/rec");
const TO = "mutvayzz@gmail.com";
const SUBJECT = "Friday plans";
const BODY =
  "Hi! Before Friday could you book dinner for the team, fill in the supplier form and reply to Sam about the venue? Everything you need is in this thread. Thanks!\nDana";

const mode = process.argv[2] || "all";
fs.mkdirSync(REC, { recursive: true });

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("exit", (c) => (c === 0 ? resolve(out) : reject(new Error(`${cmd} ${args.join(" ")} → ${c}\n${out}`))));
  });
}

async function sizeChrome() {
  await run("osascript", [
    "-e",
    'tell application "Google Chrome" to activate',
    "-e",
    "delay 0.5",
    "-e",
    'tell application "Google Chrome" to set bounds of front window to {0, 25, 1920, 1105}',
  ]);
}

async function hideDock(hide) {
  await run("defaults", ["write", "com.apple.dock", "autohide", "-bool", hide ? "true" : "false"]);
  await run("killall", ["Dock"]).catch(() => "");
  await sleep(1500);
}

async function chromeFullscreen(on) {
  await run("osascript", [
    "-e",
    'tell application "Google Chrome" to activate',
    "-e",
    "delay 0.4",
    "-e",
    `tell application "System Events" to tell process "Google Chrome"
      set isFS to value of attribute "AXFullScreen" of window 1
      if ${on ? "not isFS" : "isFS"} then
        keystroke "f" using {control down, command down}
      end if
    end tell`,
  ]);
  await sleep(1500);
}

async function setZoom175(page) {
  // Chrome zoom steps from 100%: 110 → 125 → 150 → 175
  await page.bringToFront();
  await page.keyboard.press("Meta+0");
  await sleep(250);
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Meta+Equal");
    await sleep(180);
  }
  await sleep(400);
}

async function dismissGmailPopups(page) {
  const labels = [
    /No thanks/i,
    /Not now/i,
    /No, thanks/i,
    /Got it/i,
    /Dismiss/i,
  ];
  for (const re of labels) {
    const btn = page.getByRole("button", { name: re }).first();
    if (await btn.count()) {
      try {
        await btn.click({ timeout: 2000 });
        console.log("dismissed popup", re);
        await sleep(600);
      } catch {
        /* ignore */
      }
    }
  }
  // Also try text links
  for (const text of ["No thanks", "Not now", "No, thanks"]) {
    const el = page.getByText(text, { exact: false }).first();
    if (await el.count()) {
      try {
        await el.click({ timeout: 1500 });
        console.log("dismissed text", text);
        await sleep(500);
      } catch {
        /* ignore */
      }
    }
  }
}

async function prepCleanChrome(page) {
  await hideDock(true);
  await sizeChrome();
  await sleep(500);
  await dismissGmailPopups(page);
  await setZoom175(page);
  await dismissGmailPopups(page);
  await chromeFullscreen(true);
  await sleep(800);
  await dismissGmailPopups(page);
}

async function slowMove(page, x, y, steps = 45) {
  await page.mouse.move(x, y, { steps });
  await sleep(1000);
}

function startRec(name) {
  const out = path.join(REC, name);
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
    path: out,
    stop: async () => {
      await sleep(1000);
      if (!ff.killed) {
        ff.kill("SIGINT");
        await new Promise((r) => ff.on("close", r));
      }
      const st = fs.statSync(out);
      console.log(`DONE ${name} (${(st.size / 1e6).toFixed(1)} MB)`);
    },
  };
}

async function launch() {
  const context = await chromium.launchPersistentContext(PROFILE, {
    channel: "chrome",
    headless: false,
    viewport: null,
    args: [
      "--disable-infobars",
      "--profile-directory=Default",
      "--no-first-run",
      "--no-default-browser-check",
    ],
    // Drop Playwright flags that paint the grey "unsupported command-line flag" bar.
    ignoreDefaultArgs: ["--no-sandbox", "--enable-automation"],
  });
  const page = context.pages()[0] || (await context.newPage());
  return { context, page };
}

async function gotoMail(page, u = 0) {
  await page.goto(`https://mail.google.com/mail/u/${u}/#inbox`, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await sleep(4000);
  const url = page.url();
  if (/accounts\.google\.com|ServiceLogin|signin/i.test(url)) {
    console.log("NEED_SIGN_IN", url);
    return false;
  }
  // Wait for compose or inbox chrome
  try {
    await page.getByRole("button", { name: /Compose/i }).first().waitFor({ timeout: 45000 });
    return true;
  } catch {
    console.log("NO_COMPOSE", url);
    return false;
  }
}

async function ensureDanaName(page) {
  // Open Gmail settings → Accounts → edit send-as name if possible; else print note.
  // Faster path: Google Account name change is heavy. Try Gmail "Send mail as" edit.
  await page.goto("https://mail.google.com/mail/u/1/#settings/accounts", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await sleep(3000);
  if (/accounts\.google\.com|ServiceLogin/i.test(page.url())) {
    console.log("u/1 not signed in — will compose from available From: picker");
    return false;
  }
  // Click edit info next to send-as if name isn't Dana
  const pageText = await page.locator("body").innerText();
  if (/Dana Haddad/i.test(pageText)) {
    console.log("Dana Haddad already present in send-as");
    return true;
  }
  console.log("Dana Haddad not found in settings; will try From picker / proceed with available name");
  return false;
}

async function sendEmail(page) {
  // Try second account first (u/1)
  let u = 1;
  let ok = await gotoMail(page, 1);
  if (!ok) {
    u = 0;
    ok = await gotoMail(page, 0);
    if (!ok) throw new Error("Google asks to sign in — please sign in once in the opened Chrome window, then re-run.");
  }
  await sizeChrome();
  await sleep(1000);

  const compose = page.getByRole("button", { name: /Compose/i }).first();
  const cbox = await compose.boundingBox();
  if (cbox) await slowMove(page, cbox.x + cbox.width / 2, cbox.y + cbox.height / 2);
  await compose.click();
  await sleep(2000);

  // From picker
  const fromCandidates = [
    page.locator("div[aria-label^='From']").first(),
    page.getByText(/^From$/).first(),
  ];
  for (const el of fromCandidates) {
    if (await el.count()) {
      try {
        await el.click({ timeout: 2000 });
        await sleep(600);
        const opt = page.getByRole("option").filter({ hasText: /glitchcaplabs|ake24zarif|mutvayz@gmail|Dana/i }).first();
        if (await opt.count()) {
          await opt.click();
          await sleep(500);
        } else {
          await page.keyboard.press("Escape");
        }
      } catch {
        /* ignore */
      }
      break;
    }
  }

  // To field — Gmail often uses a contenteditable div with name="to"
  await sleep(500);
  const toDiv = page.locator('div[name="to"][aria-label="To"], textarea[name="to"], input[aria-label*="To"]').first();
  await toDiv.click();
  await sleep(300);
  await page.keyboard.type(TO, { delay: 35 });
  await sleep(500);
  await page.keyboard.press("Enter");
  await sleep(400);
  await page.keyboard.press("Tab");
  await sleep(300);

  const subj = page.locator('input[name="subjectbox"]').first();
  await subj.click();
  await subj.fill(SUBJECT);
  await sleep(400);

  const body = page.locator('div[aria-label="Message Body"]').first();
  await body.click();
  await page.keyboard.type(BODY, { delay: 20 });
  await sleep(1000);

  const sendBtn = page.locator('div[role="button"][aria-label*="Send"]').first();
  if (await sendBtn.count()) await sendBtn.click();
  else await page.getByRole("button", { name: /Send/i }).first().click();
  await sleep(4000);
  console.log(`SENT "${SUBJECT}" from u/${u} → ${TO}`);

  // Switch to primary inbox to see it
  await gotoMail(page, 0);
  await sizeChrome();
}

async function findFridayRow(page) {
  const selectors = [
    `tr.zA:has-text("${SUBJECT}")`,
    `tr:has-text("${SUBJECT}")`,
    `span.bog:has-text("${SUBJECT}")`,
    `span:has-text("${SUBJECT}")`,
  ];
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    if (await loc.count()) {
      try {
        await loc.waitFor({ state: "visible", timeout: 5000 });
        // Prefer the table row containing the subject
        const row = page.locator(`tr.zA:has-text("${SUBJECT}")`).first();
        if (await row.count()) return row;
        return loc;
      } catch {
        /* try next */
      }
    }
  }
  return null;
}

async function recordInbox(page) {
  await gotoMail(page, 0);
  await prepCleanChrome(page);
  await sleep(2000);

  // Wait for delivery: refresh + search a few times
  let row = null;
  for (let i = 0; i < 8; i++) {
    row = await findFridayRow(page);
    if (row) break;
    const search = page.locator('input[aria-label="Search mail"]').first();
    if (await search.count()) {
      await search.click();
      await page.keyboard.press("Meta+a");
      await page.keyboard.type(`subject:(${SUBJECT})`, { delay: 20 });
      await page.keyboard.press("Enter");
      await sleep(2500);
      row = await findFridayRow(page);
      if (row) break;
    }
    await page.goto("https://mail.google.com/mail/u/0/#inbox", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await sleep(2500);
    await page.keyboard.press("Shift+?"); // no-op fallback
    // Gmail refresh shortcut
    await page.keyboard.press("Meta+r");
    await sleep(2000);
  }
  if (!row) {
    // Last resort: open search results URL
    await page.goto(
      `https://mail.google.com/mail/u/0/#search/subject%3A(${encodeURIComponent(SUBJECT)})`,
      { waitUntil: "domcontentloaded", timeout: 60000 }
    );
    await sleep(3000);
    row = await findFridayRow(page);
  }
  if (!row) throw new Error(`Could not find "${SUBJECT}" in inbox/search`);

  // Prefer inbox view with a few ordinary emails if we're on search — go back to inbox if the mail is there
  if (page.url().includes("#search/")) {
    // Stay on search if that's where it is; still fine for the shot if unread at top
  }

  await dismissGmailPopups(page);
  const box = await row.boundingBox();
  await sleep(1000);
  const rec = startRec("gmail-inbox.mov");
  await sleep(1000);
  if (box) {
    await slowMove(page, box.x + Math.min(360, box.width * 0.35), box.y + box.height / 2, 55);
    await sleep(1200);
    await page.mouse.click(box.x + Math.min(360, box.width * 0.35), box.y + box.height / 2);
  } else {
    await row.click();
  }
  await sleep(2000);
  await rec.stop();
}

async function recordRead(page) {
  await dismissGmailPopups(page);
  // Ensure thread open
  const heading = page.locator(`h2:has-text("${SUBJECT}")`).first();
  if (!(await heading.count())) {
    const row = page.locator(`tr:has-text("${SUBJECT}")`).first();
    if (await row.count()) {
      await row.click();
      await sleep(2000);
    }
  }
  await dismissGmailPopups(page);
  const rec = startRec("gmail-read.mov");
  await sleep(1000);
  await sleep(6000);
  await page.mouse.wheel(0, 140);
  await sleep(1500);
  await rec.stop();
}

async function recordReply(page) {
  await dismissGmailPopups(page);
  // Prefer toolbar Reply
  let target = page.getByRole("button", { name: /^Reply$/ }).first();
  if (!(await target.count())) target = page.locator('[aria-label="Reply"]').first();
  await target.waitFor({ timeout: 30000 });
  const box = await target.boundingBox();
  const rec = startRec("gmail-reply.mov");
  await sleep(1000);
  if (box) {
    await slowMove(page, box.x + box.width / 2, box.y + box.height / 2, 40);
    await sleep(1000);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  } else {
    await target.click();
  }
  await sleep(4000); // empty reply, cursor blinking — type nothing
  await rec.stop();
}

const { context, page } = await launch();
try {
  if (mode === "open") {
    const ok = await gotoMail(page, 0);
    await sizeChrome();
    console.log(ok ? "OPEN_OK" : "NEED_SIGN_IN", page.url());
    console.log("Waiting 90s — sign in if needed…");
    await sleep(90000);
  } else if (mode === "send") {
    await sendEmail(page);
  } else if (mode === "record" || mode === "retake") {
    await recordInbox(page);
    await recordRead(page);
    await recordReply(page);
  } else {
    await sendEmail(page);
    await recordInbox(page);
    await recordRead(page);
    await recordReply(page);
  }
} catch (e) {
  console.error("FAIL", e);
  console.log("Browser left open for inspection. URL:", page.url());
  await sleep(15000);
  process.exitCode = 1;
} finally {
  await chromeFullscreen(false).catch(() => {});
  await hideDock(false).catch(() => {});
  await context.close().catch(() => {});
}

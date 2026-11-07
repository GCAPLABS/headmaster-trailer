# Prompt for Cursor on the Mac mini: Gmail re-take

Paste everything below the line into Cursor's agent on the Mac mini.

---

Re-take the three Gmail recordings for the trailer. The first takes in `public/rec/` (branch `v4-captures`) can't be used: Chrome showed a grey "unsupported command-line flag: --no-sandbox" bar, Gmail showed an "Enable desktop notifications" popup, the whole desktop with the Dock was in the frame, and the email text was too small. The sender's name ("Glitch Labs") is fine; keep it and the same "Friday plans" email.

1. `cd headmaster-trailer && git checkout v4-captures && git pull`.
2. Launch Chrome for Playwright WITHOUT `--no-sandbox`: use `launchPersistentContext(<copied profile>, {channel: 'chrome', headless: false, ignoreDefaultArgs: ['--no-sandbox', '--enable-automation'], args: ['--disable-infobars']})`, or open normal Chrome and drive it with AppleScript and cliclick. No grey bar may show under the address bar.
3. In Gmail: dismiss the "Enable desktop notifications" popup ("No thanks"), close any other banners, and set the Chrome zoom to 175% (Cmd +) so the email fills the window. Hide the Dock (`defaults write com.apple.dock autohide -bool true && killall Dock`) and make Chrome full screen (Ctrl+Cmd+F) so only Gmail is visible: no menu bar, no Dock, no tabs.
4. Record the screen with ffmpeg as before (60 fps), moving the mouse slowly, holding still 1 second before and after each action:
   - `gmail-inbox.mov`, about 6 s: the inbox with "Friday plans" unread at the top; hover over it, then click it open.
   - `gmail-read.mov`, about 8 s: the open email, still for 6 s, then a very slight scroll.
   - `gmail-reply.mov`, about 6 s: click Reply; the empty reply box opens with the cursor blinking; type nothing.
5. Check a frame of each (`ffmpeg -ss 3 -i <file> -frames:v 1 check.png`): no grey bar, no popup, no Dock or menu bar, the email text large and sharp. Re-take any that fail.
6. Put the Dock back (`defaults write com.apple.dock autohide -bool false && killall Dock`), overwrite the three files in `public/rec/`, then `git add public/rec && git commit -m "Gmail re-take: clean full-screen Chrome at 175%" && git push`, and tell me when it's pushed.

## Check before every take (don't skip)

Work like this, one step at a time, and LOOK at the result each time instead of assuming:

1. **Inspect the page, not just the screen.** With Playwright, read the DOM before acting:
   - the email row: `page.getByRole('row').filter({hasText: 'Friday plans'})`; print its bounding box before you move the mouse to it.
   - the notifications popup: `page.getByText('Enable desktop notifications')`; if it is visible, click `page.getByRole('button', {name: 'No thanks'})` and confirm it's gone (`await expect(...).toBeHidden()`).
   - any other banner: `page.locator('[role="alert"], [role="dialog"]')`; print what's there and close it.
   - the Reply button: `page.getByRole('button', {name: 'Reply'})`, and after clicking, the reply box: `page.getByRole('textbox', {name: /Message Body/i})` must be visible and focused.
   - the zoom: `await page.evaluate(() => window.devicePixelRatio)` should read about 1.75x the normal value (or check the "175%" in Chrome's zoom bubble).
   If a locator finds nothing, print `await page.locator('body').ariaSnapshot()` and pick the right element from that; don't guess coordinates.
2. **Then check the real screen.** Browser bars (like the grey `--no-sandbox` warning) are not in the page, so inspect them with a screenshot: `screencapture -x /tmp/check.png`, open it and look. It must show only Gmail: no grey bar under the address bar, no popup, no Dock, no menu bar, no tabs, the email text large.
3. **Only then record.** After each take, grab a frame (`ffmpeg -ss 3 -i <file> -frames:v 1 /tmp/take.png`), open it and check the same list. If anything is wrong, say what, fix it, and re-take. Don't push a take you haven't looked at.
4. Tell me in one line per file what you checked and what you saw.

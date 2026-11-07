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

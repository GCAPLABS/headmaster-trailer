# Prompt for Cursor on the Mac mini: real captures for the Headmaster launch trailer

Paste everything below the line into Cursor's agent (Agent mode) on the Mac mini.

---

Make real screen recordings for a 100-second launch trailer. Do everything yourself: drive the apps, record the screen, check the files. Only ask me for the two permissions in step 0, for anything that needs my password, and for the phone filming in part 2. Work through the steps in order and tell me briefly as each file is done.

How you drive things:
- **Chrome and Gmail:** Playwright (the Playwright MCP, or a Node script) with my real Chrome and my existing profile, so I'm already signed in to Google: `chromium.launchPersistentContext(<a copy of my Chrome profile folder, ~/Library/Application Support/Google/Chrome>, {channel: 'chrome', headless: false})`. Quit Chrome before copying the profile. If Google still asks me to sign in, tell me and I'll do it once in that window.
- **iOS Simulator:** `idb` (`brew install facebook/fb/idb-companion` and `pip3 install fb-idb`, then `idb connect <udid>`): `idb ui tap x y`, `idb ui swipe`, `idb ui text "…"`, `idb ui describe-all` to find coordinates.
- **Mac apps (Reminders, TextEdit):** AppleScript (`osascript`) for the data, and `cliclick` (`brew install cliclick`) or System Events for real, slow mouse moves and clicks.

## 0. Set up

1. Check what's installed: `xcode-select -p`, `xcrun simctl list devices available`, `ffmpeg -version` (install it with `brew install ffmpeg` if missing), `git --version`.
2. Clone the repo: `git clone https://gitlab.com/gcap-labs-group/headmaster-trailer.git` (I'll sign in to GitLab if it asks), then `cd headmaster-trailer && git checkout -b v4-captures origin/v4-real-screens` and `mkdir -p public/rec`.
3. Ask me to give Cursor (and the Terminal, if you use it) Screen Recording and Accessibility permission (System Settings › Privacy & Security). Then turn on Do Not Disturb, switch to light mode and hide the desktop icons yourself. The Mac mini needs a display connected.
4. Find the screen's device index for ffmpeg: `ffmpeg -f avfoundation -list_devices true -i ""`. Record the screen with `ffmpeg -f avfoundation -framerate 60 -capture_cursor 1 -i "<screen index>:none" -c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p public/rec/<name>.mov`, and stop it cleanly with `q` (or a SIGINT) when the action is done. Start each recording 1 second before the action and stop it 1 second after.

Rules for everything: real apps only, nothing mocked up. People: only "Dana Haddad" and "Sam". Wording stays general (team, supplier, venue). Never type or show the words Hermes or Nous or any other company name. Move the mouse slowly; hold still 1 second before and after each action. No audio.

## 1. Gmail (Chrome, a demo Google account, window 1920x1080)

First get this email into the inbox. Send it from a second account whose display name is "Dana Haddad" (if I don't have one, ask me), or ask me which account to use:
- Subject: Friday plans
- Body: "Hi! Before Friday could you book dinner for the team, fill in the supplier form and reply to Sam about the venue? Everything you need is in this thread. Thanks! Dana"

Size the Chrome window to 1920x1080 with AppleScript (`osascript -e 'tell application "Google Chrome" to set bounds of front window to {0, 25, 1920, 1105}'`). Then record the screen with ffmpeg (not Playwright's own video, which drops frames) while you do each action slowly through Playwright, one at a time (move the mouse in small steps, never jump):
- `gmail-inbox.mov`, about 6 s: the inbox with "Friday plans" unread at the top among a few ordinary emails; the mouse hovers over it, then clicks it open.
- `gmail-read.mov`, about 8 s: the open email; hold still for 6 s, then scroll down very slightly.
- `gmail-reply.mov`, about 6 s: click Reply and the empty reply box opens with the cursor blinking; type nothing.

## 2. Screens I film with my phone

The trailer copies a look where a real screen is filmed with a phone: moiré, a slight angle, natural hand movement. Put each of these full screen on the display, one at a time, and tell me when each is ready to film. I'll film each with my iPhone (4K, 30 fps, 6 to 8 s, phone a little off-angle, about 30 cm away, moving slowly) and AirDrop them to the Mac:
- the Gmail inbox from part 1
- the Reminders app on the Mac, showing the lists from part 3
- TextEdit in a large monospaced font with: "TO DO / book dinner for the team / supplier form / reply to Sam"

When the clips arrive in ~/Downloads, copy them to `public/rec/` as `filmed-gmail.mov`, `filmed-reminders.mov` and `filmed-todo.mov`.

## 3. Reminders (iOS Simulator plus the Mac's Reminders app)

1. Boot the newest iPhone simulator (iPhone 17 Pro or newest, iOS 26 if available): `xcrun simctl boot "<device>" && open -a Simulator`. Set the status bar: `xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100 --cellularBars 4 --wifiBars 3`. Light mode: `xcrun simctl ui booted appearance light`.
2. Create the lists on the Mac with AppleScript, and in the Simulator with `idb` taps and text. The lists: a list "Friday" with "Book dinner for the team", "Supplier form", "Reply to Sam" (a due time on "Supplier form" a minute ahead), and a list "Team" shared with two people (made-up names are fine) with a few items.
3. Record the Simulator with `xcrun simctl io booted recordVideo --codec h264 public/rec/<name>.mov` (stop with Ctrl+C when the action is done), and the Mac side by side with the ffmpeg command above:
- `ios-reminders-alert.mov`, about 5 s: the Friday list open; the "Supplier form" reminder banner drops in from the top.
- `ios-reminders-check.mov`, about 5 s: a slow scroll through the Friday list, then one item ticked off.
- `reminders-sync.mov`, about 6 s (ffmpeg, whole screen): the Mac's Reminders and the Simulator side by side; add "Reply to Sam" on the Mac (typed with cliclick) and, if the Simulator is signed in to the same iCloud account, it appears on the iPhone. If it doesn't sync, record the Mac alone adding it.
- `ios-reminders-shared.mov`, about 5 s: the shared "Team" list with the shared avatars in the header; one slow scroll.
- `ios-home-badge.mov`, about 5 s: the Home Screen with Reminders on it, its badge going up as reminders come due.

## 4. Finish

Check every file plays and list its length and resolution (`ffprobe -v error -show_entries format=duration:stream=width,height -of csv=p=0 <file>`). Re-encode anything over 50 MB with `ffmpeg -i in.mov -c:v libx264 -crf 18 -preset slow -an out.mov`. Then `git add public/rec && git commit -m "Real captures for v4" && git push -u origin v4-captures`, and tell me when it's pushed, with the list of files.

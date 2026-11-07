# Prompt for Cursor on the Mac mini: real captures for the Headmaster launch trailer

Paste everything below the line into Cursor's agent (Agent mode) on the Mac mini.

---

Help me make real screen recordings for a 100-second launch trailer. You run the commands. If you have a Playwright MCP, use it to drive Chrome for the Gmail part yourself (open a persistent, headed Chrome profile; I'll sign in to Google once by hand, because Google blocks sign-in from automated browsers). Use AppleScript (`osascript`) for the Mac's Reminders app. I do any tapping inside the iOS Simulator, and anything you can't drive, when you tell me to. Work through the steps in order, one at a time, and wait for me to say "done" after each thing you ask me to do.

## 0. Set up

1. Check what's installed: `xcode-select -p`, `xcrun simctl list devices available`, `ffmpeg -version` (install it with `brew install ffmpeg` if missing), `git --version`.
2. Clone the repo: `git clone https://gitlab.com/gcap-labs-group/headmaster-trailer.git` (I'll sign in to GitLab if it asks), then `cd headmaster-trailer && git checkout -b v4-captures origin/v4-real-screens` and `mkdir -p public/rec`.
3. Tell me to give Cursor Screen Recording permission (System Settings › Privacy & Security › Screen Recording), turn on Do Not Disturb, switch to light mode and hide desktop icons. The Mac mini needs a display connected.
4. Find the screen's device index for ffmpeg: `ffmpeg -f avfoundation -list_devices true -i ""`. Record the screen with `ffmpeg -f avfoundation -framerate 60 -capture_cursor 1 -i "<screen index>:none" -c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p public/rec/<name>.mov`, and stop it cleanly with `q` (or a SIGINT) when I say "done". Before each recording, tell me exactly what I'll do, then start it, then wait 1 second before telling me to go.

Rules for everything: real apps only, nothing mocked up. People: only "Dana Haddad" and "Sam". Wording stays general (team, supplier, venue). Never type or show the words Hermes or Nous or any other company name. Move the mouse slowly; hold still 1 second before and after each action. No audio.

## 1. Gmail (Chrome, a demo Google account, window 1920x1080)

First ask me to send this email to the recording account, from a second demo account whose display name is "Dana Haddad":
- Subject: Friday plans
- Body: "Hi! Before Friday could you book dinner for the team, fill in the supplier form and reply to Sam about the venue? Everything you need is in this thread. Thanks! Dana"

Size the Chrome window to 1920x1080 with AppleScript (`osascript -e 'tell application "Google Chrome" to set bounds of front window to {0, 25, 1920, 1105}'`). Then record the screen with ffmpeg (not Playwright's own video, which drops frames) while you, or I, do each action slowly, one at a time:
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
2. Create the Mac's Reminders lists yourself with AppleScript (they sync to the Simulator only if both use the same iCloud account; otherwise I'll make them in the Simulator by hand). The lists: a list "Friday" with "Book dinner for the team", "Supplier form", "Reply to Sam" (a due time on "Supplier form" a minute ahead), and a list "Team" shared with two people (made-up names are fine) with a few items.
3. Record the Simulator with `xcrun simctl io booted recordVideo --codec h264 public/rec/<name>.mov` (stop with Ctrl+C when I say done), and the Mac side by side with the ffmpeg command above:
- `ios-reminders-alert.mov`, about 5 s: the Friday list open; the "Supplier form" reminder banner drops in from the top.
- `ios-reminders-check.mov`, about 5 s: a slow scroll through the Friday list, then one item ticked off.
- `reminders-sync.mov`, about 6 s (ffmpeg, whole screen): the Mac's Reminders and the Simulator side by side; I add "Reply to Sam" on the Mac and it appears on the iPhone. If it doesn't sync in the Simulator, record the Mac alone adding it.
- `ios-reminders-shared.mov`, about 5 s: the shared "Team" list with the shared avatars in the header; one slow scroll.
- `ios-home-badge.mov`, about 5 s: the Home Screen with Reminders on it, its badge going up as reminders come due.

## 4. Finish

Check every file plays and list its length and resolution (`ffprobe -v error -show_entries format=duration:stream=width,height -of csv=p=0 <file>`). Re-encode anything over 50 MB with `ffmpeg -i in.mov -c:v libx264 -crf 18 -preset slow -an out.mov`. Then `git add public/rec && git commit -m "Real captures for v4" && git push -u origin v4-captures`, and tell me when it's pushed, with the list of files.

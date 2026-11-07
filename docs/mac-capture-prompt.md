# Prompt for the Mac's Claude: real captures for the Headmaster launch trailer

Paste everything below the line into Claude on the Mac.

---

I need real screen recordings for a 100-second launch trailer (repo: gitlab.com/gcap-labs-group/headmaster-trailer, branch `v4-real-screens`). Make each capture below, check it plays, then commit them all to a NEW branch `v4-captures` under `public/rec/` and push it to GitLab (`git push -u origin v4-captures`, or the GitLab remote if origin is GitHub). If a file is over 50 MB, re-encode it with `ffmpeg -c:v libx264 -crf 18 -preset slow -an`. Tell me when it's pushed and list each file with its length and resolution.

Rules for everything:
- Real apps only, nothing mocked up. Light mode. Clean desktop, no notifications from other apps, Do Not Disturb on, menu bar clock at 9:41 if you can.
- People: only "Dana Haddad" and "Sam". Wording stays general (team, supplier, venue). Never show the words Hermes or Nous, or any other company name in content you type.
- Record at 60 fps, the highest resolution available. No audio. Hold still for 1 second before and after each action.
- Move the mouse slowly and naturally; let each action finish before the next.

## 1. Gmail (Chrome, 1920x1080 window, signed in to a demo Google account)

Set up first: from a second demo account whose display name is "Dana Haddad", send this email to the recording account.
- Subject: Friday plans
- Body: "Hi! Before Friday could you book dinner for the team, fill in the supplier form and reply to Sam about the venue? Everything you need is in this thread. Thanks! Dana"

Then record:
- `rec/gmail-inbox.mov` (6 s): the inbox with the "Friday plans" email unread at the top among a few ordinary emails. Hover over it, then click it open.
- `rec/gmail-read.mov` (8 s): the open email. Hold still for 6 s; then scroll down very slightly.
- `rec/gmail-reply.mov` (6 s): click Reply. The empty reply box opens with the cursor blinking. Type nothing.

## 2. Screens to film with a phone (the owner films; you set them up)

The trailer copies a look where a real screen is filmed with a phone: moiré, slight angle, natural hand movement. Prepare these screens full screen on the Mac display, one at a time, and tell the owner when each is ready so they can film it with their iPhone (4K, 30 fps, 6 to 8 s each, phone a little off-angle, about 30 cm away, moving slowly):
- the Gmail inbox from part 1
- the Reminders app on the Mac, with the lists from part 3
- a plain-text to-do list in TextEdit, large monospaced font: "TO DO / book dinner for the team / supplier form / reply to Sam"

Name the owner's clips `rec/filmed-gmail.mov`, `rec/filmed-reminders.mov`, `rec/filmed-todo.mov` and add them to the same branch.

## 3. Reminders (iOS Simulator, iPhone 17 Pro or newest, iOS 26, plus the Mac's Reminders app)

Set the Simulator status bar first: `xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100 --cellularBars 4 --wifiBars 3`. Record the Simulator with `xcrun simctl io booted recordVideo --codec h264 <file>` and the Mac with the built-in screen recorder.

Set up a list "Friday" with: "Book dinner for the team", "Supplier form", "Reply to Sam", and a list "Team" shared with two people (fake names are fine), with a few items.

- `rec/ios-reminders-alert.mov` (5 s): the Friday list open; a reminder banner for "Supplier form" drops in from the top.
- `rec/ios-reminders-check.mov` (5 s): a slow scroll through the Friday list, then one item ticked off.
- `rec/reminders-sync.mov` (6 s): the Mac's Reminders and the Simulator side by side; add "Reply to Sam" on the Mac and it appears on the iPhone.
- `rec/ios-reminders-shared.mov` (5 s): the shared "Team" list, with the shared avatars visible in the header; scroll slowly once.
- `rec/ios-home-badge.mov` (5 s): the Home Screen with Reminders in the dock or the first row, its badge going up as reminders come due (add due reminders a few seconds apart).

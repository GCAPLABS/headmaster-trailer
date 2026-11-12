# Shot list: real iPhone and Gmail screens for the middle story

For the owner's Mac Claude. v4 already uses real Apple screenshots from support.apple.com and real Mixkit footage. These recordings would replace the last stand-ins and make every screen ours. Each one drops into `public/rec/` under the file name given. Tell the trailer session when they're in, and it will swap them into `src/Film2.tsx`.

## How to record

- **iPhone:** iOS Simulator, iPhone 17 Pro, iOS 26, light mode, 9:41 status bar (`xcrun simctl status_bar booted override --time 9:41 --batteryLevel 100 --cellularBars 4 --wifiBars 3`).
  Record with `xcrun simctl io booted recordVideo --codec h264 public/rec/<name>.mov`.
  Portrait, native 1206×2622. Don't crop; the film frames it.
- **Gmail:** Chrome on the Mac at 1920×1080, signed in to a clean demo Google account. Record with the built-in screen recorder (Cmd+Shift+5) or Screen Studio, at 60 fps.
- **People and names:** use only the names below (Dana Haddad, Sam). Wording stays general: "team", "supplier", "organization". Never Hermes, Nous or any vendor name.

## Shots

| # | File | Film time | Screen and state | Length | Size |
|---|---|---|---|---|---|
| 1 | `rec/gmail-read.mov` | 45.5–49.5 s | Gmail web, reading view of one email. Subject **Friday plans**, from **Dana Haddad**, body: "Hi! Before Friday could you book dinner for the team, fill in the supplier form and reply to Sam about the venue? Everything you need is in this thread. Thanks! Dana". Hold still; the film adds the yellow highlights and the push-in. | 6 s still hold | 1920×1080 |
| 2 | `rec/gmail-reply.mov` | 49.5–53.5 s | The same email, Reply clicked: an empty reply box with the cursor blinking and the blue Send button. Nothing typed. | 6 s | 1920×1080 |
| 3 | `rec/ios-lock-notifs.mov` | 43.0–45.5 s | iPhone Lock Screen. Three notifications arrive about 0.5 s apart: Messages "Sam: Any news on the venue for Friday?", Mail "Dana Haddad: Friday plans", Reminders "Supplier form, due Friday". Send them with `xcrun simctl push` and a small `.apns` payload per app. | 4 s | 1206×2622 |
| 4 | `rec/ios-reminder-alert.mov` | 28.6–30.6 s | iPhone, Reminders: a list "Today" with "Call the dentist", "Supplier form", "Reply to Sam". A reminder banner for "Supplier form" drops in from the top. | 3 s | 1206×2622 |
| 5 | `rec/ios-reminders-shared.mov` | 31.8–33.0 s | Reminders, a list shared with two people (the shared avatars visible in the list header). Scroll slowly once. | 3 s | 1206×2622 |
| 6 | `rec/ios-home-reminders.mov` | 18.4–21.5 s, "And this?" | Home Screen with the Reminders app in the dock, badge 3. Hold. (The film zooms in and runs the badge up.) | 3 s | 1206×2622 |
| 7 | `rec/headmaster-whatsapp.mov` | 61.8–66 s | Our own app: WhatsApp chat with the Headmaster agent. The ask is typed and sent: "Book dinner for the team Friday, fill in the supplier form and reply to Sam about the venue." The reply: "On it. Nothing goes out until you say so." | 8 s | 1206×2622 |
| 8 | `rec/headmaster-approve.mov` | 77–80 s | Our app: the drafted reply to Sam, with Approve tapped. | 4 s | 1206×2622 |

Shots 1 to 3 matter most: they are the reference's strongest real screens (real Gmail, real notifications).

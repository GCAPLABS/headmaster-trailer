# App showcase (85-95 s): one chat turn

Replaces the 3D museum (owner: it read as AI). One real chat turn in our app's mock UI (feedback.gcaplabs.com, Do a job tab), in `public/app/turn-1..4.mp4`.

How it was recorded: Playwright, a 2880x1920 window, the `#demo` panel pinned top left with CSS `zoom: 2` (Playwright's video ignores deviceScaleFactor, so the zoom is what makes it sharp). The demo runs in an iframe (`/demo/index.html`); an init script hides the cursor's name label (`div.pointer-events-none.absolute div[class*="origin-top-left"][class*="bg-fg"]`). The Do a job run is about 24 s; four moments are cut from it and scaled to 1920x1080:

| Clip | Source (s) | Moment | Film length |
|---|---|---|---|
| turn-1 | 8.0 | the ask typed and sent | 2.5 s |
| turn-2 | 16.15 | the steps tick off (mail, price list, Thursday) | 2.5 s |
| turn-3 | 18.65 | it asks first; the cursor clicks Allow | 2.0 s |
| turn-4 | 22.3 | the answer: the week in short, the call booked | 3.0 s |

`Museum` in `src/Film2.tsx` (the `TURN` list) plays them with one sine-eased camera move per shot. `Gallery3D.tsx` is no longer used.

## Product act (62 to 70.5 s)

After the name reveal, `App` cuts to `public/app/ask-1.mp4` (the real app home, wide; our ask starts typing) and `Ask` plays `public/app/ask-2.mp4` (closer on the composer: the ask finishes, is sent on "It gets to work.", and the agent shows Working). Both come from one recording where the demo was paused, taken over ("Click inside to take over") and our ask typed into its composer: "Book the team dinner Friday, find a venue for 40 and draft a reply to Sam." The mock answers every ask with its own scripted supplier turn, so the shots stop before that answer appears; the result cards and the Approve card (70.5 to 85 s) stay as designed because they match the script's words (the booking, the research, the reply to Sam).

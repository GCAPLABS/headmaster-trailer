# Storyboard: Headmaster demo, 60 s, 1920x1080, 30 fps

Direction: Product stage. Real screens as hero on lavender #e0e0fb, white and #f7f8fb surfaces, ink #0c0e1a, accent #0000da, hairline #e3e5ec, dark #16181f. Archivo display, Figtree UI. Every scene has one kinetic line, subtitles, and works with sound off.

| Time | Frames | Scene | Picture | On-screen text | VO line (words, ~s) | Sound |
|---|---|---|---|---|---|---|
| 0-7.5 s | 0-225 | ask | Left column: title. Right: a person on a sofa holds a phone; the phone shows the green chat with Headmaster. The request types in and sends; the reply says it is on it. | Just ask. | Say you need a hotel. You just ask. (8 w, fits 3.5 s of 7.5) | Music bed; soft tick per step; whoosh on camera moves |
| 7.5-15.5 s | 225-465 | works | Real chat window, wide. A task panel on the right lists steps: Searching 14 hotels, Comparing prices, Opening the booking page. Mini browser view shows result cards. | It works on its own computer. | It has its own private computer. It searches, compares, and finds the booking page. (14 w, fits 6.1 s of 8) | Music bed; soft tick per step; whoosh on camera moves |
| 15.5-24.5 s | 465-735 | asks | Approval card 'Pay 328 euros?' with Approve once, Always allow, Deny; the screen is dimmed 28% outside the card. | It asks before it spends. | Before it spends a single euro, it asks you. Approve once, always allow, or say no. (16 w, fits 7.0 s of 9) | Music bed; soft tick per step; whoosh on camera moves |
| 24.5-30 s | 735-900 | remembers | Memory page list: Small hotels, Window seat, Under 180 euros. Composer types 'Book the usual.' | It remembers you. | It remembers how you like things. So next time, just say: book the usual. (14 w, fits 6.1 s of 5.5) | Music bed; soft tick per step; whoosh on camera moves |
| 30-36.5 s | 900-1095 | anywhere | Four surfaces on a shared stage in a row: green chat first (phone), laptop app, browser tab, phone app. One thread shown on each. | Wherever you are. | Use it in the chat apps you already use, or on your laptop, browser and phone. (16 w, fits 7.0 s of 6.5) | Music bed; soft tick per step; whoosh on camera moves |
| 36.5-43 s | 1095-1290 | overnight | Dark board (To do, Doing, Done) at night with a clock 23:40, then the bedside phone at 07:30 with a green chat message '3 jobs done overnight'. | It works while you sleep. | Give it jobs before bed. It works through them overnight, and tells you in the morning. (16 w, fits 7.0 s of 6.5) | Music bed; soft tick per step; whoosh on camera moves |
| 43-49 s | 1290-1470 | profiles | Three real profile screens side by side: Ada (Errands, itinerary), Milo (Money, a bar list), Juno (Writing, a document). Names large above each. | A profile for each job. | Profiles each have a job. Ada does errands, Milo watches money, Juno writes. (13 w, fits 5.7 s of 6) | Music bed; soft tick per step; whoosh on camera moves |
| 49-53 s | 1470-1590 | control | Left: spend limit meter 38 of 50 euros. Right: step log with times and ticks. | See every step. | You set the limit, and see every step. (8 w, fits 3.5 s of 4) | Music bed; soft tick per step; whoosh on camera moves |
| 53-55.5 s | 1590-1665 | skills | Skills list with 'New this week' rows; Memory and profiles rows beside them keep a green tick. | New skills every week. | New skills weekly. Nothing breaks. (5 w, fits 2.2 s of 2.5) | Music bed; soft tick per step; whoosh on camera moves |
| 55.5-60 s | 1665-1800 | close | Blue agent character small above the wordmark on lavender; URL below. Hold 2s. | Headmaster. Your AI staff, always on. | Headmaster. Your AI staff, always on. (6 w, fits 2.6 s of 4.5) | Music bed; soft tick per step; whoosh on camera moves |

## Motion and camera per scene

**ask** (hook). Animation: Title lines rise 40px out of a mask with blur 10 to 0 over 0.6s, 0.12s stagger. Text types at 28 chars/s, send tap ripples, bubble springs up 24px. Phone floats 5px on a 3.2s sine, hands follow. Camera: Static wide to 4.3s, then a 2.7s ease-in-out push to 2.1x on the thread; the title slides left 1.6x faster (parallax). Out: The push lands on the phone screen, which becomes the laptop chat window of scene 2 (match cut on the same thread and bubble).

**works** (showcase). Animation: Steps tick in sequence at 1.4s intervals; result cards fan out from a stack (fan/spread) with 90ms stagger; spinner becomes a check with a 0.3s spring. Camera: Guided zoom 1.6x onto the task panel at 10s, cursor hotspot on the active step, callout 'Step 2 of 3'. Out: Pan right along the thread to the approval card.

**asks** (climax). Animation: Cursor curves in, beacon pulses, click ripple, card flips to Booked with a spring check, border flashes blue for 4 frames. Camera: Supademo zoom 1.35x to the card, ease-heavy 1.1s; holds; zooms out after the click. Out: Confirmation row slides into Files in the sidebar; camera follows to the Memory page.

**remembers** (showcase). Animation: List rows enter from the left as a staggered cascade (100ms); matching words in the composer highlight blue as each row is read. Camera: Slow 6 percent drift right to left; no zoom. Out: Slide-wipe to a row of devices.

**anywhere** (showcase). Animation: Parallax layers pan: devices slide at 0.6x/1x/1.4x speeds; each surface lights (white fill vs lavender) as it is named. Camera: Horizontal dolly right 1500px over 5s, ease-in-out. Out: Camera dips into dark for night (hard cut justified by time passing: clock 23:40).

**overnight** (showcase). Animation: Cards carry across columns one at a time (350ms ease-in-out); clock numerals roll; sunrise = background field switches lavender via a 0.5s wipe. Camera: Locked-off board, then a vertical tilt down to the phone on a bedside table. Out: Wipe up.

**profiles** (showcase). Animation: Orbit-free: screens rise at different depths (Z hierarchy), the named one scales 1.06 and others dim to 70 percent in turn. Camera: Slow push-in 1.1x on the active screen. Out: Cross-slide to the log.

**control** (showcase). Animation: Meter fills 0.9s ease-out; log rows type in with 120ms stagger. Camera: Guided zoom to the log, 1.3x. Out: Rows scroll off to a parcel icon list.

**skills** (showcase). Animation: Rows drop in 80ms stagger; ticks pop on old rows. Camera: Static, 1.05x drift. Out: Rows collapse toward the centre mark.

**close** (close). Animation: Agent hops once (spring 0.5s), wordmark rises from a mask, URL fades in last. Camera: Pull back 1.0 to 0.94 over 4s. Out: End.

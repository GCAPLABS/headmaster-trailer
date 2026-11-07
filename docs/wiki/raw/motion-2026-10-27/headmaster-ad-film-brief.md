---
ingested: 2026-10-27
sha256: f176b29f96bc8adcf68cb821028abeed1d795d81451daeab47bb32bf46932e71
---
# Headmaster ad film: director's brief (v1, 27 Oct 2026)

Built on the "No After Effects" prompt pattern (BRAND / APP / RESULT / SET / FORMAT / BEATS / LOOK / CHECKS)
and the motion-course harness (seek(t) engine, closed-form springs, beat grid, synthesized sound, critique loop).

## Film in one line
"Say it once. It's done." A person types one job; a single royal-blue shape carries that job through the
Headmaster app, asks before paying, lands on the phone, and finishes as the Headmaster mark.

## BRAND
- HERO: one royal-blue (#0000da) shape that never cuts. It starts as the composer's round send button, then
  morphs (size, radius, position, all on springs) into: a progress pill, the "Approve once" button, a check
  disc, the iPhone push card's icon tile, and finally the Headmaster mark tile (rounded square, white cap icon).
- APP: the Headmaster chat window exactly as the rundown hero draws it: left sidebar (Headmaster, New chat,
  Kanban, Memory, Artifacts, then "Bots": Ada, Milo, Juno), top bar "Ada · Travel and errands", thread, composer
  "Message Ada" with the round blue send button. Copy the tokens from the rundown's data-ui CSS
  (rundown-live.html lines 150-205: radii, borders #e3e5ec/#eef0f4, fields #f7f8fb, ink #16181f, muted #6a7086).
- RESULT: the job done: reply "Booked. The confirmation is in Artifacts.", chips "Paid €328" (green) and
  "Remembered: you like small hotels" (blue), then a push alert on the Lock Screen.
- SET: the app window (about 1440x880, white, the data-ui shadow) on a flat lavender ground #e0e0fb.
  Camera = one transform on the stage (scale + translate), driven by springs.

## FORMAT
- Route A, zero dependencies: index.html exposes window.seek(t) that paints the exact frame for any t.
  No timers, no CSS transitions or animations, no Date.now. Every value is a pure function of t.
- timeline.json holds the beats (seconds) and the layout numbers; index.html, render.mjs and sound.py all read it.
- lib/motion.js: closed-form damped spring spring(t, {duration, bounce}) (Apple-style parameters) and
  track(events) that sums one spring per target change, each starting at its own time, so frame 812 renders
  without simulating 0-811. Presets: ui {duration 0.5, bounce 0.2}; snappy {duration 0.35, bounce 0.1};
  type {duration 0.5, bounce 0} (no overshoot on text); heavy {duration 0.8, bounce 0} for the lockup.
- 1920x1080, 30 fps, 12.0 s = 360 frames, 120 BPM (beat 0.5 s, 24 beats). Frame = t*30.
- render.mjs: Playwright chromium (preinstalled, require('playwright')), viewport 1920x1080 dpr 1, for each
  frame evaluate seek(f/30), screenshot, pipe to ffmpeg. Encode H.264 High, CRF 17, yuv420p, +faststart,
  mux the WAV as AAC 320k. Font: Inter (installed locally; SF Pro is not available on Linux).

## BEATS (seconds)
- 0.0-0.5  Wide on the app window, empty thread, caret blinking in the composer (blink from t).
- 0.5-1.8  "Book two nights in Lisbon, under €180 a night." types into the composer.
- 2.0      Cursor clicks send: the send button squashes (scale 0.92), the message lands in the thread as the
           user bubble. The beat drops here.
- 2.0-2.5  The send button (the hero) detaches and flies up under the message, stretching into a progress pill.
- 2.5/3.0/3.5  Three tool rows tick in, one a beat: "Searched 14 hotels", "Compared prices on 3 sites",
           "Opened the booking page"; the pill fills a third each beat.
- 4.0      The pill morphs into the primary button of an approval card that springs in:
           "Ada wants to pay €164 a night. Casa do Largo, 12 to 14 November. Total €328."
           Buttons: Approve once (the hero), Always allow, Deny. Camera pushes in on the card.
- 5.5      Cursor clicks "Approve once": press squash, then the hero becomes a check disc.
- 6.0      Reply and chips appear (RESULT).
- 6.5-7.5  Camera pulls back; the window moves left and scales down; a dark iPhone Lock Screen (#16181f,
           time 18:42) slides in at right. The hero flies from the window into the phone and becomes the icon
           tile of a push card "Ada · Booked Casa do Largo. The confirmation is in Artifacts." landing at 7.5.
- 8.0      Window and phone clear; on the lavender ground, big solid-ink type: "It remembers you."
- 9.0      "It asks before it acts." The hero sits as a small blue disc beside each line and morphs between them.
- 10.0     The hero becomes the Headmaster mark tile; wordmark "Headmaster" beside it; below, the tagline
           "Your AI staff, always on." and small muted "headmaster.gcaplabs.com".
- 10.0-12.0 Hold. The last frame is a clean end frame and the poster.

Every beat changes something on screen. A move that changes nothing is cut.

## Text on screen
Plain words only. No em dashes, no emojis, no buzzwords, no vendor or engine names. The bot is "Ada".
Big type is weight 700, tight tracking, solid ink #0c0e1a. Nothing runs off frame; keep 96 px safe margins.

## LOOK
Flat Studio look: lavender ground #e0e0fb, white window, field #f7f8fb, ink #0c0e1a, muted #6a7086,
accent #0000da, grey dark accent #16181f for the phone. No gradients, no glow, no glass, no grain, no neon,
no fade-in-everything. Shadows only the data-ui shadow. Must pass the no-vibecoded-look list.

## SOUND (sound.py, numpy only, 48 kHz stereo 16-bit WAV, 12.0 s, reads timeline.json)
- Before the send: only a soft pad (F major 7) and ticking hats.
- The beat drops on the send at 2.0: soft kick, snare on 2 and 4, hats, a round bass on F G Am C (one chord
  per 2 s bar), soft FM keys on the off-beats.
- Effects: a key tap per typed letter, a click on send, a whoosh on the hero's flight, rising dings C E G for
  the three tool rows, a soft pop for the approval card, a click plus a two-note confirm chime on approve, a
  whoosh to the phone, a two-note alert on the push, a low thump under each big line, a C major stab at 10.0
  ringing out to a 0.5 s fade.
- Master: simple compressor and a peak limit at -1 dBFS. Then print RMS dB per half second and check the drop
  lands at 2.0 and nothing pokes out above the groove.

## CHECKS and gates (do not skip)
1. Plan, then timeline.json + index.html.
2. Render 18 stills at half res (t = 0.3, 1.2, 2.05, 2.3, 2.6, 3.6, 4.3, 5.0, 5.6, 6.2, 6.9, 7.6, 8.3, 9.2,
   10.1, 10.6, 11.2, 11.95) and tile them into contact-sheet.jpg (6x3).
3. Critique loop: open the contact sheet, score every still 1-10 on composition, legibility, brand fit,
   motion clarity and the no-vibecoded list; write the 3 worst problems; fix; re-render; repeat until every
   still scores 8+.
4. Full render, sound, mux, loop check of the end frame, poster.jpg (t = 11.5).

## Deliverables
/mnt/project-files/motion/ad-film/: headmaster-ad-16x9.mp4, poster.jpg, contact-sheet.jpg, critique-log.md
(scores and fixes per round), source/ (index.html, timeline.json, lib/motion.js, render.mjs, sound.py,
README.md with the one-command render), and this brief.

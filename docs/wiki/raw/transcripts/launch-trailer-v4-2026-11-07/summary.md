---
ingested: 2026-11-10
source: launch trailer session, 7 to 10 Nov 2026 (branch v4-real-screens, GitLab gcap-labs-group/headmaster-trailer)
---

# Launch trailer v4: what the owner decided and how it was made

Owner decisions, in the order they came:
- Real things only, like the reference: real footage, real brand screens, real archive clips. Brand assets are fine for this film in the UAE; the end card says "Not affiliated with any brand shown." No fake overlays: a filmed-screen (moiré, CRT) look faked over screenshots "looks fake".
- "Webcore" (Pinterest pins) was out of place in both spots it was used; replaced by real to-do apps through the years and a 1950 office film clip. No meme.
- Match the reference's iconic products with our own alternatives, not its images: candle to bulb, paper map to Google Maps to CarPlay, the $100 to Apple Pay, Apple Music.
- Black-and-white material is moving clips (Prelinger Archives on archive.org), not stills.
- Script: our own (owner picked script A with B's name and demo lines). Headmaster is "your own AI agent", not a to-do list; "Nothing goes out until you make the call."
- Voice: Sara (ElevenLabs), generated as ONE continuous take with the recipe that made the liked male take: eleven_v4, default settings, prompt starts `[calm, unhurried, warm]`, a blank line after every sentence. Line-by-line generation lost the highs and lows. "Even Pokémon" uses the first Sara sample for its giggle. ElevenLabs credits are precious: ask before generating.
- Music: decide the music BEFORE voicing or mixing. Owner rejected stock tracks and the beat-driven track as too upbeat; final is two ElevenLabs pieces with no beat, joined at the near-silence of "Not anymore", shaped like the reference (low under the montage, one climb, falls away on the end card).
- Mix target is the reference itself, measured the same way per act, not a fixed number.
- The 3D museum looked "AI"; replaced by the real app. The product act is ONE continuous chat turn in real time, never sped up ("nobody was able to grasp anything"); the shot may run longer.
- Captions: word by word, small, no box, no lime outline; white on dark scenes, ink on light ones.
- End card: Windows and Mac out now, iOS coming soon, real logos, "Your own AI agent.", voiced by Sara. Not "Free in beta".
- Gmail: the owner preferred the large rebuilt Gmail view over the Mac capture. Phone-filmed screen shots: skipped.

Methods that worked:
- Shot-by-shot audit of the reference: cut detection plus feature matching at several points inside each shot tells clips from stills; Whisper word times against picture changes showed its captions and highlights land on the spoken word and its montage cuts lead the word by about 0.25 s.
- Per-act voice-over-music audit with the same method on both films (`research-tools/audit_acts.py`); reference 15.9 / 11.5 / 7.2 / 5.7 dB.
- Narration cuts snap to real pauses (80 ms under -45 dB) so no word is clipped and no stray syllable leaks in; check the finished mix by transcribing it and diffing against the script.
- Recording a web app: pin the panel and zoom it 2x with CSS (Playwright video ignores deviceScaleFactor); hide UI you don't want with an injected style; swap scripted demo text for the film's story with an in-page text map; pause the demo at the approval so the click lands on the line. Playwright's own video drops to about 6 updates a second on a big window: slow the page 5x (timers, clocks, rAF and CSS animations) while recording, then speed the video back up.
- A demo that loops: freeze the last frame instead of letting it restart.
- Things only a signed-in machine can do (Gmail, iCloud Reminders, the iOS Simulator) go to the owner's Mac mini as one prompt for Cursor, which drives Playwright with the owner's Chrome profile, idb and AppleScript, and must inspect the page and look at a screenshot before and after every take.
- Renders: a half-size preview takes a fraction of a full render; log progress to a file so it can be reported in frames.

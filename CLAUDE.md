# Headmaster launch trailer

A 96-second launch film for Headmaster, built in Remotion 4.0.539. The owner is Matvey Zarif.
This repository holds everything needed to pick the work up exactly where it stopped: the project, every asset, the design and motion skills, the audits, the owner's feedback and the research tools.

**Read first, in this order:** this file, `docs/01-reference-vs-ours.md`, `docs/02-v2-audit-and-v3-plan.md`, `docs/wiki/motion-playbook.md`, then watch `reference/ref.mp4` and `renders/headmaster-launch-trailer-v3.mp4` side by side.

## The idea

The film copies the structure, pacing and look of a reference launch film (`reference/ref.mp4`, the "Sol" film by rishxbhh on X, about 10M views). It does not copy the reference's words or brand.

- **Their pitch:** everything evolves, but the inbox never did.
- **Ours:** everything evolves (light, maps, money, games, computers, music), but the to-do list never did anything for you. Headmaster is its next form: you tell your agent what you need, it gets everything ready, and you approve.

Beats:
- 0–21 s: fast real-footage montage, about 0.5 s per cut, one big word per idea, plus a game "evolving" gag.
- 21–43 s: "And this? Oh, it evolved." The to-do list's history, told by a calm narrator.
- 43–55 s: the problem.
- 55 s: "Until now." The Headmaster mark forms from the word.
- 59–80 s: the product (WhatsApp ask, a result card in a lavender aura, "All of it ready. None of it sent.", the human taps Approve).
- 80–94 s: 3D museum dolly ending on our icon.
- 94–96 s: white end card with headmaster.app.

## Run it

```bash
bash scripts/setup.sh                    # npm ci, Python deps, downloads the stock clips, builds the sound mix (also runs on session start)
npx remotion studio                      # preview
npx remotion render src/index.ts Film2 out/v4.mp4 --crf=17 --audio-codec=aac --audio-bitrate=320k --gl=swangle
python3 tools/film2_audio.py .           # rebuild public/film2-mix.wav after ANY timeline or audio edit
npx remotion still src/index.ts Film2 out/f.png --frame=1300 --gl=swangle   # single frame
```

`--gl=swangle` is required on headless Linux, otherwise the 3D museum renders blank. Use `tools/sheet.py` or `research-tools/sheet.py` for contact sheets.

## Where things are

| Path | What |
|---|---|
| `src/film2.json` | ONE timeline for picture and sound. It holds the scenes (in frames), narration lines `vo` ([firstWord, lastWord, filmSeconds, subtitle]), music segments, `duck`, `gains`, `extra` lines from other takes, `sfx` one-shots and the optional `evolveClip`. Backup of v2: `src/film2-v2.json`. |
| `src/Hook2.tsx` | The 0–21 s opening. `words[].imgs` lists the clips for each word: `clips/<mixkit id>.mp4` or Apple shots in `brand/`. `START` sets each clip's in-point. `Gag` is the "evolving" gag. Each clip sits in its own `<Sequence>` so it plays from its own start. |
| `src/Film2.tsx` | Every scene after 21 s, mapped by name to the scenes in `film2.json`. The middle story screens are still DRAWN. Replacing them is the open work below. |
| `src/Gallery3D.tsx` | The 3D museum (@remotion/three, Poly Haven CC0 models in `public/models`). Camera keys are at the top. |
| `tools/film2_audio.py` | The mix: ducking, voice about 10 dB over music, compressor, limiter, about -15 LUFS. It prints the voice-over-music level. |
| `tools/get-clips.sh`, `tools/clip-ids.txt` | Downloads the Mixkit clips. They are not committed because they total 155 MB. |
| `public/vo-sara-b.mp3` | Narration (v4): ElevenLabs voice "Sara - intimate & warm" (the owner's pick), eleven_v4, take B; `film2.json` `voFile` selects it. Word timings are in `src/vo-words.json`. "Even Pokémon." comes from the same take as an `extra` line at 13.32 s, so "Pokémon" starts 0.32 s before the evolve cut, as in the reference. The old male take ("Justin Case") is `public/vo-a.mp3`, with timings in `src/vo-words-justin.json`. Samples: `public/voice-samples/`. |
| `public/music-a.mp3`, `music-bed.mp3` | Music: ElevenLabs eleven_music_v2_5 (driving take A) plus a calm bed, spliced on the beat grid. |
| `public/sfx/`, `public/models/`, `public/brand/`, `public/fonts/` | Sound effects, 3D models, Apple press shots used as the "today" ends, fonts |
| `public/v2`, `public/v3`, `public/arch` | Earlier rejected stills (paintings, archive photos, drawn webcore). Kept only for history. Don't reuse them. Credits: `public/v2/credits.json`. |
| `renders/` | The latest render (v3) and its review boards |
| `reference/` | `ref.mp4` (the film to match), contact sheets of it, loudness and word analysis, and `refs-webcore/` (the owner's own Pinterest screenshots) |
| `webcore-pinterest-urls.txt` | 88 real Pinterest webcore pins. Look at them before any "web" shot. |
| `docs/` | Both audits; `wiki/` (motion playbook, design system, design skills, owner working rules, the No After Effects prompt pack in `wiki/raw/motion-2026-10-27/`); `rules/` (app design rules, the trailer's decision notes) |
| `brand-kit/` | Studio palette `tokens.json` and the Headmaster icon and mark SVGs |
| `research-tools/` | How the footage and images were found, and the audit:<br>- `audit.py`: faster-whisper voice-vs-music level per line<br>- `mixkit.py`: Mixkit search<br>- `met.py`: Met API v1.1<br>- `loc.py`: Library of Congress<br>- `apple.py`, `press.py`: Apple product images<br>- `pin.js`: Pinterest search through Playwright<br>- `ovsearch.py`: Openverse<br>- `sheet.py`: contact sheets<br>- `vo_words.py`: word timings |
| `.claude/skills/` | Every design and motion skill. They load automatically. |
| Older files (`Film.tsx`, `Full.tsx`, `Trailer.tsx`, `Scenes*.tsx`, `storyboard*`, `timeline*.json`) | v1 and the earlier demo film. Not part of the current cut. |

## v4 status (7 Nov 2026, branch `v4-real-screens`)

Done in v4, not yet rendered in full (the owner sees the board first: `renders/v4-board/board.jpg`):
- **0:43 sound:** the six pings and the whoosh are gone. One soft ping (-24 dB) is left at 43.1 s, and `duck.hold` (1.6 s) keeps the bed level across short gaps instead of pumping. Mix, matched act by act to the reference with per-segment music `gain` in `film2.json` (opening -14, beds and product +4 to +5.5) and the evolve hit cut to -16 dB. Voice over the music between lines, measured with Whisper, reference first and ours second: opening 15.4 / 13.7, story 11.9 / 12.1, product 6.9 / 8.6, ending 6.3 / 8.4. The whole film is -15.2 LUFS, and the ten loudest half-seconds are all voice (or the logo hit), never the beat.
- **Pokémon gag:** the owner's FireRed clip, built by `tools/pokemon_evolve.py` and retimed frame by frame to the reference's 11.20–13.27 s. Pixels are snapped to the GBA's native resolution and scaled up with nearest-neighbour. The gag is now 62 frames, Music has a 4th clip (cassette 48532), and "Music." and "And this?" moved to 16.1 s and 18.4 s.
- **Narration:** a woman's voice, Sara (owner's pick), with the same script and line times, plus "Even Pokémon." over the evolve. Mix per act, reference first and ours second: opening 15.4 / about 21 on clean gaps, story 11.9 / 12.4, product 6.9 / 7.4, ending 6.3 / 8.6. The film is -14.6 LUFS.
- **Music and sound effects (owner: the switches and effects sounded off and unnatural):** both tracks sit on a 120 bpm grid in source time (beats on every whole and half second). Every switch now lands on a bar line, with short fades on the downbeat. The opening's phrase ends on the downbeat at 21.0, where the calm bed enters on the same bar. The bed carries a soft floor (-21 to -28 dB, as in the reference) under "Until now". The driving track returns from its break so its build starts at 58 and the drop lands on "Headmaster." at 60.0. The bed's beat section enters on the downbeat at 72.0. Every sound effect is gone except the logo hit at 55.1. Voice over the music between lines, reference first and ours second: story 11.9 / 11.5, product 6.9 / 7.2, ending 6.3 / 9.4. The film is -14.5 LUFS.
- **Money:** Franklin's face on the $100 (Mixkit 18249, from 2.2 s) replaces the "NOTE" corner shot.
- **Middle story:** every drawn Windows dialog is gone. It now uses real webcore pins (`public/webcore/`), real Mixkit footage (pen on a pad 42655, phone in hands 4915), and real iOS 26 and macOS Reminders screens plus real iOS notifications from support.apple.com (`public/apple/`). The Reminders icon carries the badge in "And this?", the nag and the snow.
- **End card:** "Not affiliated with any brand shown."
- **Still stand-ins:** the Gmail reading view and empty reply (45.5–53.5 s) are rebuilt in Gmail's layout and Roboto. `docs/shot-list-iphone-gmail.md` lists the real captures for the owner's Mac Claude.
- **Gaps vs the reference that v4 does not touch** (the owner decides): the cold open is a CRT terminal font, where the reference uses small clean sans on pure black; the "Light" clips are generic stock, where the reference uses iconic images (a fire painting, Edison with his bulb); the reference's opening music is quiet (the cuts carry the energy), and ours now follows it.

## Open work: the owner's feedback, newest first (v4 above addresses 1–4)

1. **The sound at 0:43 is "disgusting".** The notification run (`notif` sfx ×6 at 43.07–44.9 s, -14 dB) and the whoosh and beat switch at 43.0 s must go. Use at most one soft sound, and make the music change smooth.
2. **Drop the drawn old-Windows pop-up look completely.** That covers the to-do dialogs, organiser, shared list, TO-DO.TXT and drawn notifications in `Film2.tsx`. The owner says that is NOT webcore. "Webcore" means the real Pinterest aesthetic in `webcore-pinterest-urls.txt` and `reference/refs-webcore/`: zoomed-in CRT pixel screens with sky and hills through the grid, stacked dialogs, Y2K icon sheets, glitchy blue text. Use it only where a web shot fits.
3. **Use real footage and real brand screens, like the reference.** The reference shows real things: a real Pokémon evolving, real Gmail, a real iPhone and Apple Pay. The owner has checked that using brand assets this way is fine where he is (Dubai) and wants the same: real Gmail, iPhone notifications and Apple screens for the middle story. Add a short "not affiliated with any brand shown" line to the end card.
4. **The Pokémon evolve gag.** The owner wants a real Pokémon evolving, as in the reference. The previous Claude would not download game footage. The slot is ready: put the owner's file in `public/pokemon-evolve.mp4` and set `"evolveClip": "pokemon-evolve.mp4"` in `src/film2.json`. The dialog overlay then hides itself. The placeholder is caterpillar to butterfly.
5. **Earlier notes that still apply:**
   - Cheap stills (the white-background coin, the lamp) look fake. The ref's zoomed-in dollar shot is "common cinema" and good.
   - The owner liked the voice's highs and lows.
   - The v2 gallery of random pictures on pillars looked tacky, and v3 replaced it with the 3D museum.

## Owner rules for this film

- **Audit before building.** For every version, compare beats, voice-vs-music level, tone and every shot against the reference. Search libraries and MCPs before building anything.
- **Show the owner a picture board before any full render**, then render.
- **Look:** nothing cheap, fake or second-hand. Use real footage and real screens.
- **Motion:** follow `docs/wiki/motion-playbook.md` and the No After Effects prompt pack. That means one timeline, a beat grid, springs, an 18-still critique and a loudness check. Pace motion naturally (Emil Kowalski skills), never sped up.
- **Design skills:** load them before visual work: no-vibecoded-look, emil-design-eng, animate, review-animations, design-taste-frontend, web-design-guidelines, ui-ux-pro-max, teardown, design-to-motion. Components come from 21st.dev first (its MCP also has Remotion video blocks), then Kokonut UI, Magic UI or Aceternity (free tier). Our palette (`brand-kit/tokens.json`, Studio white and lavender) wins over any skill default.
- **Mix targets:** voice about +10 to +11 dB over music under the story (the reference measures +11) and about -15 LUFS. Check with `research-tools/audit.py`.
- **Copy:** say "agent", never "bots". Never show "Hermes", "Nous" or vendor names. Wording stays general ("organization", not "school"). The end card reads headmaster.app and "Free in beta".
- **Communication:** no ETAs. Keep replies short. Show screenshots inline.

## Sources and licences

- **Reachable from a cloud session:**
  - Mixkit: free, ad use OK, 720p. URL pattern: `assets.mixkit.co/videos/<id>/<id>-720.mp4`
  - Coverr, archive.org, NASA
  - Met API v1.1: needs a non-browser User-Agent; v1 search is retired
  - loc.gov `?fo=json`
  - Openverse: page_size 20 or less
  - Apple product pages: images ending `_large_2x`
  - Pinterest: through Playwright
- **Blocked:** Wikimedia throttles requests. Pexels, Pixabay and Unsplash need API keys.
- **ElevenLabs:** the voice and music were made on the FREE plan, which has no commercial rights. Before the film runs as an ad, regenerate them on a paid plan or confirm the licence. The ElevenLabs connector must be signed in to make new voice, music or sound effects.
- Some v2 photos are CC BY-SA and need credits if they are ever used. The current cut doesn't use them.

## Previous renders

The v1, v2 and v3 renders and every review board are in the owner's project files under `motion/launch-trailer/`. Only v3 is copied here, in `renders/`.

## Handoff notes (7 Nov 2026, latest)

- **Film is now 107 s.** The story is +5 s (sync, share, nag, snow, notifications, the Gmail nudge) and the end card runs 8 s (owner's call). The opening, "Until now", the product act and the museum keep their lengths.
- **Narration (DONE, our own script):** Sara, `vo-sara2-b.mp3`. The owner picked script A with B's name and demo lines, 142 words against the reference's 156. Lines: Every tool we love got better. Nobody asked it to. / And your to-do list? It changed too. Again and again. / Off the fridge. Into your pocket. Then reminders. Syncing. Sharing. Badges. / Each version got better at keeping score. None of them ever lifted a finger. / It tells you what's left. It never does any of it. The asks are in your messages. The details are right there. And all of it still waits on you. / Not anymore. This is Headmaster, your own AI agent. Ask for what you need. It gets to work. The booking, ready. The research, done. The reply to Sam, drafted. Everything prepared. Nothing goes out until you make the call. / Every tool gets its turn to grow up. The to-do list had fifty years. Now the work gets done for you. The on-screen copy is updated to match. (Superseded note:) The script was being REWRITTEN, because the owner says ours is too close to theirs. The proposed table is in the conversation; the owner's edits so far: "Nothing goes out **until** you make the call." Headmaster is NOT a to-do list: it is your own AI agent that does the work, and you approve before anything goes out. The to-do list is only the setup metaphor. Also show a second script variant. Reveal line idea: "This is Headmaster. Your own AI agent. You ask. It does the work."
- **Music:** the current mix is a placeholder (gap at 53–57 s). The owner dislikes the calm bed and likes the upbeat track. The reference uses ONE continuous cinematic ambient score: deep sustained synth bass swelling on 2 s bars, no kick, settling at ~16 s, near silence at "Until now", then a long climb. ElevenLabs ignores timestamps in a prompt (`public/music-score-1.mp3` is the failed take). Options offered: Mixkit music (real, free), ElevenLabs as two pieces, Stable Audio (needs a key). The owner hasn't picked.
- **Iconic products** like the reference, with alternatives, not their exact images. Now in: Google Maps (`brand/google-maps.jpg`), IBM PC (`brand/ibm-pc.jpg`), iMac (`brand/imac-today.jpg`), the Gmail nudge (`public/google/`). Before/after boards: `renders/v4-board/before-after-*.jpg`. The reference's own chapters: Hook + Setup 0–18.2, Pivot to 40.0, Problem to 57.6, Reveal to 71.9, Demo to 88.5, Outro to 104.
- **Open, from the owner:** (1) their black-and-white material is moving CLIPS, not stills; archive.org Prelinger films are being pulled (Secretary's Day 1947, Office Etiquette 1950, This Is Automation, On Guard! SAGE 1956). (2) Their filmed-screen CRT/moiré look: do NOT fake it over screenshots (`Filmed` in Film2.tsx is off); find real footage of screens filmed that way, and sample more reference frames to see which of their shots have it. (3) As they use Gmail because they are a mail product, we should use the real to-do apps (Reminders, Todoist, Microsoft To Do, Google Tasks, Things) for the to-do history. (4) The app home at 63 s reads like a checklist; show the agent at work instead.
- **Git:** GitHub (`origin`) returns 403 (account suspended). Push to GitLab: `git -c credential.helper= -c credential.helper='!f(){ echo username=oauth2; echo password=proxy-injected; };f' push gitlab v4-real-screens`. The branch tracks `gitlab/v4-real-screens`.

## Handoff notes (7 Nov 2026, evening, latest)

Latest cut: `renders/v4-board/v4-preview.mp4` (half size, 103.5 s). Audit against the reference: `docs/03-v4-audit-vs-reference.md`.

- **Narration:** Sara, ONE continuous take `public/vo-sara4-a.mp3` (owner's recipe: eleven_v4, default settings, prompt starts `[calm, unhurried, warm]`, a blank line after every sentence). Word timings `src/vo-words.json` (142 words; "Even Pokémon" is an `extra` from the same take, "Pokémon" on the evolve cut at 14.0 s). End card line `public/vo-sara-end-a.mp3` at 95.4 s. `tools/film2_audio.py` snaps every cut to a real pause (80 ms under -45 dB), which fixed the clipped "Computers" and the stray "E". Owner: ElevenLabs credits are precious, ask before generating.
- **Music:** two ElevenLabs pieces, no beat, joined at "Not anymore" (58.5 s): `public/music-seam-1.mp3` (0 to 58.5) and `public/music-seam-2.mp3` (57.5 to the end; near silence, one climb, falls away). Per-act gain in `film2.json` matches the reference's voice over music per act (`research-tools/audit_acts.py`: ref 15.9 / 11.5 / 7.2 / 5.7 dB).
- **Picture:**
  - Montage cuts lead their word by 0.25 s. Maps: paper, paper with phone, Google Maps, CarPlay. Money ends on Apple's tap-to-pay press photo. Music ends on Apple Music's full-frame room shot.
  - 21.5 s collage: real to-do apps through the years (`public/todo/`, `docs/todo-history.md`), even pace from the cut.
  - 42 s: 1950 Office Etiquette clip (`public/archive/`).
  - 62 to 95 s: ONE real-time chat turn recorded from the app mock (`public/app/turn.mp4`, `docs/app-showcase.md`). The mock's scripted text is swapped for our story in the page while recording (`story.js` approach), its cursor label hidden, the demo paused at the approval so Allow is clicked right after "until you make the call". Steps check on "ready", "done", "drafted".
  - End card: out now on Windows and Mac, coming soon on iOS (real marks in `public/brand/logos/`), "Your own AI agent."
  - Captions: word by word, brand lime `#e0ef7c` with a thin dark outline, no background (owner didn't want a box). Cold open and "And your to-do list?" in clean Figtree, word by word (no CRT font).
- **Still open:** real Gmail reading view and reply (Mac capture, shot list), filmed-screen shots (owner films a monitor with a phone), moving Reminders recordings (Simulator), then the full-size render.
- **Git:** push to GitLab only (`gitlab/v4-real-screens`). GitHub returns 403, so the stop hook's "unpushed commits" count is about GitHub and can be ignored.

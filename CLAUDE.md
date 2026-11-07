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
| `public/vo-a.mp3` | Narration take A, ElevenLabs voice "Justin Case", model eleven_v4. Word timings are in `src/vo-words.json`. `vo-games-*.mp3` is the "Games." line. |
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

## Open work: the owner's feedback, newest first (do these next)

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

---
title: Motion playbook
created: 2026-10-27
updated: 2026-11-06
type: concept
tags: [design, motion]
sources:
  - raw/transcripts/nightly-2026-11-06/summary.md
  - raw/transcripts/plan-2026-10-27/page-reference.md
  - raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md
  - raw/articles/motion-2026-10-27/rincy-no-after-effects-post.md
  - raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt
  - raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md
  - raw/articles/motion-2026-10-27/licence-check.md
  - raw/transcripts/thread-updates-2026-10-27-1141/notes.md
  - raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills/design-to-motion-SKILL.md
  - raw/transcripts/thread-updates-2026-10-27-1259/notes.md
  - raw/transcripts/project-memory-2026-10-27-2000/film-frames-read-without-sound.md
  - raw/transcripts/nightly-2026-10-27/summary.md
  - raw/transcripts/thread-updates-2026-10-28-live-action/notes.md
confidence: high
---

# Motion playbook

How we make motion and video with code, for every visual job (site, apps, artifacts, films). Owner ask, 27 Oct 2026: this is general knowledge, not one page's notes. Read it together with [[design-system]] and [[design-skills]] before any visual or motion thread.

## The idea
The model cannot emit a video. It writes a program, and a harness turns the program into frames. The prompt is about 10 percent of the result; the engine, the reference, the sound and the critique loop are the other 90. A one-line prompt tests the engine, never the idea. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]

## Engine
- Route A (our default): one `index.html` that exposes a pure `seek(t)` painting the exact frame for any time. No timers, no CSS transitions, no `Date.now`. Playwright screenshots each frame, ffmpeg encodes. The render is deterministic, so a change is an edit plus a re-render of only the affected frame range. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md] ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]
- Route B, frameworks: HyperFrames (Apache-2.0, keep its notice) is usable. Remotion is source-available: free for individuals and companies of up to 3 employees, a paid company licence above that, and it limits selling derivatives. Check the headcount and licence with the owner before adopting it; route A needs neither. Details in [[design-skills]]. ^[raw/articles/motion-2026-10-27/licence-check.md]
- Ask for a framework by name; left alone, the model picks route A. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]

## Springs
Cheap motion eases on a fixed curve; good motion has mass. Use closed-form springs so the value stays a pure function of time. When a value gets a new target, add one more spring starting at that moment and sum them with `track()`; never restart the spring. Frame 812 then renders without simulating frames 0 to 811. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md] ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md]
- Presets: snappy (buttons, toggles), default (cards, containers, camera), heavy (big type, lockups), playful (mascots, visible overshoot). ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]
- Tiny overshoot on UI, none on type. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md] ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]
- Same parameters as the animate skill: duration 0.5, bounce 0.2 for UI; bounce 0 for text. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md]

## Sound
- Put a beat grid on a fixed BPM (120 gives 0.5 s beats) and land every hit on a frame (frame = time x fps). ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md] ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]
- No supplied track: synthesize the sound on the same timeline file as the picture. Supplied track: measure it first. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]
- Check loudness per half second: quiet before the drop, the drop lands where the picture changes, nothing pokes above the groove. ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt] ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md]
- Master with a compressor and a limit at -1 dBFS, then mux as AAC 320k. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md] ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt]

Owner rule, 27 Oct 2026: every frame must make sense with the sound off. No symbolic props (toll gates, mini buildings); show the real product doing the real thing. ^[raw/transcripts/project-memory-2026-10-27-2000/film-frames-read-without-sound.md]

## Critique loop
Before the full render, render about 18 stills at half size and tile them into one contact sheet. The model scores each still 1 to 10, writes the 3 worst problems, fixes them, and repeats until every score is 8 or more. Iteration is the method, not a failure.
Follow-up notes are numbers, not vibes. The prompt pack's three follow-ups show the style: ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md] ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]
- Round 1 (comp sheet): "make every spark ray twice as wide", "pull that pose in to 190 px right", "title at 78 px". ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt]
- Round 2 (18 stills): "specular to 0.1, roughness 0.32", "exposure 0.6 to 0.15", "land on the right corner and raise the camera". ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt]
- Round 3 (full render): "lower the apex from 0.55 to 0.36 m", "land at x 800 instead of 862", "re-render only frames 105 to 145 and 285 to 360". ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt]

## Director's brief skeleton
A long brief hires a crew instead of describing a video. Sections, in order: film in one line; references (what to keep, what to push); tools and keys (keys live in `.env`, the prompt only names the variable, never the value); character bible (proportions, palette, identity lock); beat sheet (a visual payoff every 3 to 5 s, a hook in the first 2 s); text on screen; workflow gates (plan, rig, stills, animatic, full pass, polish, audio, render, no skipping); critique loop; deliverables (MP4, loop check, poster frame, contact sheet, clean source with a README). Our worked example is `raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md`. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]

## Prompt-pack pattern
Blocks: BRAND / APP / RESULT / SET / FORMAT / BEATS / LOOK / CHECKS. Only BRAND (hero, app, result, set) changes per film; the rest reuses the names. Rules that travel: ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt]
- Pixels are the API: one timeline file holds layout and every event, and the picture and the sound both read it. ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt] ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]
- Every move changes something on screen. A move that changes nothing is cut. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md]
- Name every panel and its state; real labels make a film read as the real app. ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt]
- CHECKS makes the model look before it spends render time. ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt]
- Show the software's own logic (a keyframe jumps the comp, the playhead plays it). ^[raw/articles/motion-2026-10-27/no-after-effects-prompt-pack.txt]

## Reference ladder
Without a reference the model falls back to centred text on a gradient with everything fading in. Climb the ladder: name a look; feed one frame (say what to take and what not to take); give a video and have it extract frames with ffmpeg and describe pacing shot by shot first; give a library of our own images and have it write `style_guide.md` before any code. Specify the look and the constraints, not the library. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]

## Spec pattern
For product films write a state list, not a mood: the states in order, one shape that never cuts and morphs size, radius and colour between them, a cursor that drives each change with real clicks, and a last frame equal to the first so the film loops. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]

## Formats
Write scenes against a layout function, not fixed pixels. Render 16:9, 9:16 and 1:1 from one timeline. Reframe type and UI per format; never crop a 16:9 render to vertical. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]

## Effort
Medium for fixes and re-renders, xhigh for new films, max when the first 3 seconds must carry a launch opener. ^[raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md]

## Product demo clips D1 to D10
Plan Reference tab, 15 Oct 2026. Ten clips, D1 Memory (20 s) through D10 (automations, approvals, integrations, Cloud from the phone). ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Setup: fake company "Acme", user "Alex Morgan", Sakura theme, 1440x900, model chip "Headmaster Pro", every flow seeded under `e2e/demo/seed/<flow>/`. ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Never on screen: `~/` paths, cron strings, "Used N tools", tier chips, "Manual", the engine name, JSON, exit codes. Four camera moves per clip; at most three tool rows. ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Tools: Screen Studio for owner-driven clips; OpenScreen with `demo:live` for scripted clips. How to run a scripted clip on the Mac: [[desktop]]. Motion items for the 1.2.7 web app follow the same rules ([[releases]]). ^[raw/transcripts/plan-2026-10-27/page-reference.md]

## Rundown and film (27 Oct 2026)
The rundown was reworked and a 45 s ad made; a 4.5 min Kurzgesagt-style demo is being reworked (27 Oct 12:59 UTC) (thread "Add motion design to the rundown"). Film rules: word-by-word typing at about 140 words per minute, illustrated style, Figtree + Archivo. Vendor-OK skill repos are those under MIT or Apache-2.0; do not vendor Remotion. ^[raw/transcripts/thread-updates-2026-10-27-1141/notes.md] ^[raw/transcripts/thread-updates-2026-10-27-1259/notes.md]

## design-to-motion (elayadesign skill)
Its Part C describes a deterministic clock, frame capture, and seam and empty-beat checks, with ffmpeg commands. This maps straight onto our seek(t) engine: the clock is our t, frame capture is our Playwright screenshot per frame, and the seam check is our last-frame-equals-first loop rule. Its timing tokens are useful starting values: a 1.05 s transform with cubic-bezier(0.16,1,0.3,1), a 0.7 to 0.8 s opacity fade, an 80 to 90 ms stagger per container, a 12 s loop with an empty beat at the end, and one typed glyph every 45 to 70 ms. Its "motion every 1 to 2 s" pace is too busy for explainers. Full numbers and conflicts: [[design-skills]]. ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills/design-to-motion-SKILL.md]

## Explainer pacing (owner, 27 Oct)
The owner found our ads too fast for everyday people. Explainers now run at a calm pace: about 140 words per minute of narration, with a hold after each line. They are illustrated in a Kurzgesagt-like spirit, with original characters and no UI mockups. The script and direction are in `/mnt/project-files/motion/demo/SCRIPT.md`. The voice comes later from ElevenLabs. New videos use Figtree and Archivo, not Inter. ^[raw/transcripts/thread-updates-2026-10-27-1141/notes.md]
- Method: build three style frames first, then the film. The "No After Effects" prompt pack is the prompt source ([[design-skills]]). ^[raw/transcripts/nightly-2026-10-27/summary.md]
- The demo film is FINAL as the v4 re-cut (owner "perfect", 28 Oct 2026 16:10 UTC): `motion/demo/v4-recut/headmaster-demo-long-v4.mp4`, 2:19, source in `v4-recut/source` (Remotion, composition FilmLong). It replaces the 2:24 v3 cut after an audit found euros, features not live and one hotel example. Three stories (for you, at work, for your business), AED only, no city names, WhatsApp named, the 21st.dev "Agent State" avatar (Cojeev, MIT) as the character, Extensions store, "bring your ChatGPT or Claude plan", logo end card with headmaster.gcaplabs.com. ^[raw/transcripts/nightly-2026-10-27/summary.md]
- Arabic cut of the v4 film (28 Oct 2026): `motion/demo/v4-arabic/headmaster-demo-long-v4-ar.mp4`, 2:19, same timeline, captions `subtitles-long-ar.srt`, contact sheet `contact-sheet-ar.png`. Voiced with Munsit (model faseeh-v1-preview, Emirati female voice Aldana, backup ae-sakina-vo-f) in Emirati Arabic; about 2,300 Munsit credits (1,142 characters, under 10 US cents). Only the film's own words are Arabic (headlines, eyebrows, captions, tagline, right to left, IBM Plex Sans Arabic); the real app screens stay as they are and AED is kept. One source renders both cuts: `v4-arabic/source`, `--props='{"lang":"ar"}'` (README there). Munsit calls run from the owner's PC, because the cloud container cannot reach api.munsit.com. The owner has not watched it yet.

## Live-action variant (PAUSED, 28 Oct 2026)
The owner asked whether AI video could make a monday.com-style variant of the v4 film with realistic generated people. Plan doc: https://claude.ai/artifact/67hFFRqxBek1Goqv5BJBDT (thread "Make a live-action variant of the demo film"). Paused by the owner at 16:26 UTC until they come back to it. ^[raw/transcripts/thread-updates-2026-10-28-live-action/notes.md]
- Tooling: the ElevenLabs connector already runs Kling 3/4, Veo 3.1, Seedance 2.5 and Nano Banana Pro, so no fal.ai or Higgsfield key is needed. Generated shots never show app text; every product fact cuts to the real screen. ^[raw/transcripts/thread-updates-2026-10-28-live-action/notes.md]
- Done: cast stills (personal and business) and test shots 1 and 11 set up, unrendered, on https://elevenlabs.io/app/flows/6uQjg6JYn6t0DbClws1o. ^[raw/transcripts/thread-updates-2026-10-28-live-action/notes.md]
- Cost: full variant about 200,000 credits, about AED 275 (still USD 0.44, 5 s Kling 1080p no audio USD 1.24). ^[raw/transcripts/thread-updates-2026-10-28-live-action/notes.md]
- Blocker: our ElevenLabs workspace is on the FREE plan (10,000 credits a month) with no commercial rights. That includes the v4 voice-over: it needs a paid plan before any ad use. Resume = owner picks a paid plan (Starter USD 6 recommended) or a fal.ai key. ^[raw/transcripts/thread-updates-2026-10-28-live-action/notes.md]

## How it applies to Headmaster
Our rules win over any source:
- Studio palette: lavender ground #e0e0fb, royal blue #0000da, grey dark accent. SF Pro on Apple surfaces, Inter in the apps. Films (owner, 27 Oct 2026): Figtree + Archivo, no Inter. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md] ^[raw/transcripts/thread-updates-2026-10-27-1141/notes.md]
- Pass `no-vibecoded-look`: no gradients, glow, glass, grain or fade-in-everything. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md]
- Users never see engine or vendor names. Keep wording general, never tied to one client. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md]
- First applied work: the ad film in `/mnt/project-files/motion/ad-film/`, built from the brief in `raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md`. ^[raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md]

## Launch trailer (6 Nov 2026, in progress)
The owner asked for a launch trailer in the structure of a reference "timeline" launch film (evolution hook: light, maps, money, computers; "and this?"; the problem; "Until now"; the product; a museum outro). Our version: the to-do list is the thing that never evolved, and Headmaster is its next form (an agent that does the list). Script and shot list: https://claude.ai/artifact/ALzk6XBUM9Y61F6eKv73CT. Opening render and four style frames in `/mnt/project-files/motion/launch-trailer/`, source (the v4 Remotion project plus `src/Trailer.tsx`, `tools/trailer_audio.py`) beside them. Archive pictures come from The Met Open Access (CC0) and NASA (public domain) because the Wikimedia API rate-limits the cloud container. Owner (6 Nov) liked the old NASA / old-computer look and asked to keep the reference's calm vibe and to follow this playbook and the No After Effects pack. The full 75 s cut was built that way: one timeline file (`src/trailer-timeline.json`) read by the picture and the synthesised sound, every hit on a 15-frame beat at 120 bpm, spring cursors, the beat drops when Headmaster lands, an 18-still critique pass and a loudness check per half second, then H.264 CRF 17 with AAC 320k and faststart. File: `/mnt/project-files/motion/launch-trailer/headmaster-launch-trailer.mp4`.

Owner feedback after that cut (6 Nov): v1 had no energy against the reference, whose fast cuts last only its first 15 s before a calm narrator holds 2 to 8 s shots. v2 (96 s, narrated; ElevenLabs free plan, so no commercial rights for voice or music) was "much better", but the voice sat under the music (about -3 dB, the reference keeps it about +11 dB over) and the gallery ending looked tacky. Rule: audit and compare every version against the reference (beat, voice versus music level, tone, each shot) and search libraries and MCPs before building; no cheap knockoff look. Stills and paintings read as fake, so v3 uses real footage (free stock clips) and real product screens; an old-web "webcore" look suits on-screen web beats, drawn our own way. A game clip the owner wants for the evolve gag is not ripped by us; that slot takes a file the owner supplies. ^[raw/transcripts/nightly-2026-11-06/summary.md]


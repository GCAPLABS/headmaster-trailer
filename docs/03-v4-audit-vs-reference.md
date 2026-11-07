# v4 audit against the reference (7 Nov 2026)

Measured on `reference/ref.mp4` and our current timeline and mix (`src/film2.json`, `public/film2-mix.wav`). Tools: `research-tools/audit_acts.py` (voice over music per act), the shot split and clip-or-still check behind `renders/v4-board/reference-clips-vs-stills.jpg`.

## What now matches

| | Reference | Ours |
|---|---|---|
| Length | 104 s | 100 s |
| Words | 156 | 142 |
| Chapters | Hook 18.2, Pivot 21.8, Problem 17.6, Reveal 14.3, Demo 16.6, Outro 15.7 s | Opening 18.4, Story 24.6, Problem 16, Reveal 12, Demo 14, Outro 15 s |
| Voice over music, per act (dB) | 15.9 / 11.5 / 7.2 / 5.7 | 15.5 / 11.7 / 7.9 / about 6 (ending music raised 2 dB after this measure) |
| Music shape | one ambient score, near silence at "Until now", one climb, falls away on the end card | two ElevenLabs pieces joined at "Not anymore", same shape, no beat |
| Narration | one read | one continuous take, cut at real pauses |
| Pokémon | real evolve, "Pokémon" 0.32 s before the cut | same |
| B&W office clip in the problem act | "Bad Day" clip, small on black | Office Etiquette (1950) clip, small on black |
| End card | about 6 s | 5 s, "Your own AI agent." + icon + headmaster.app |

## Where we still fall short, biggest first

1. **The product act (59 to 85 s) is drawn, theirs is the real product.** Our app home, ask, result cards and the Approve card are React mock-ups. The reference records its real app. We now have our real app mock (feedback.gcaplabs.com) and a sharp recording method (`docs/app-showcase.md`), so this act can be recorded instead of drawn.
2. **The middle story holds still screens; theirs moves.** Reminders screens, notifications, the Gmail reading view and reply are held screenshots with a zoom. Every reference shot after 18 s is moving footage or a screen recording. The Gmail view is still our rebuild in Roboto, not real Gmail (`docs/shot-list-iphone-gmail.md` lists the captures for the owner's Mac).
3. **No filmed-screen shots.** About four reference shots are a screen filmed with a camera (moiré, scanlines, a little tilt): the globe at 24.3 s, the old screen at 27.2 s, Gmail at 31.1 s and 48.7 s. We have none. The owner's rule: real filmed footage only, no fake overlay.
4. **The opening montage is clip-heavy and less iconic.** Theirs is 14 stills and 7 clips, and the stills are famous images (two paintings, Edison with his bulb, Babbage's engine, ENIAC). Ours is 16 clips and 6 stills, mostly stock (candles, bulbs, a coin). Light has no Edison-like icon; Computers has no Babbage or ENIAC equivalent (the IBM PC is there).
5. **The cold open type.** Theirs is small, clean sans on pure black. Ours is a CRT terminal font.
6. **21.5 to 24.5 s collage.** Was webcore pins (owner: out of place). Being replaced with real to-do apps through the years.

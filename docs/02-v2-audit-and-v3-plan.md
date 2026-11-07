# Launch trailer v2: full audit before v3

Nov 6, 2026 · @Matvey Zarif

In our cut, the music is louder than the narrator. Between lines it measures 3 dB above the voice. In theirs, the voice sits 11 dB above the music. That is why our lines feel quiet when they should talk. It is worst in the opening, where I didn't turn the music down at all under "Light. Maps. Money.", and in the gag, which has 4.4 seconds with no voice where theirs says "Pokémon".

Two more things make ours feel cheaper:

- One hype track runs under everything. Theirs drops to a soft bed under the story and only gets big in the opening, at "Until now" and at the end.
- The ending puts flat photos on CSS boxes. Theirs shows real 3D objects in a lit room.

The tools to fix all of this exist and are free to use. They are listed below.

## Sound

I transcribed both films word by word and measured the level wherever the voice speaks and wherever the music plays alone.

| Measure | Theirs | Ours v2 |
| --- | --- | --- |
| Length | 104 s | 96 s |
| Share of runtime with a voice | 53% | 50% |
| Speaking pace | 90 words/min | 94 words/min |
| Voice level | −17.6 dB | −20.2 dB |
| Music alone, between lines | −28.6 dB | −17.1 dB |
| Voice above music | **+11 dB** | **−3 dB** |
| Longest stretch with no voice | 3.3 s (before "And this?") | 4.4 s (the gag) |

The narration is already the same length, pace and rhythm as theirs. The problem is only the mix and one silent hole.

**Beat.** Our cuts sit on the music's half-beat grid (0.5 s), the same way theirs do. The opening montage already lands on the beat. The narrated part does not need cuts on the beat, because theirs cuts on the voice.

**Tone.** Theirs has four music moods:

- a driving opening
- a soft bed under the story, about 11 dB under the voice
- near silence for "Until now", then a swell
- a warm lift for the ending

Ours plays the loud part of one track the whole way through, so the emotional low points the narrator hits get drowned.

**Sound effects.** Theirs has small touches: whooshes on moves, a click on Send, a hit when the logo forms. Ours has none.

## Picture

| Time | Shot | Verdict | Fix |
| --- | --- | --- | --- |
| 0:00–0:21 | Opening montage | Keep. It matches their energy. | Turn the music down under each spoken word. Voice the gag (below). |
| 0:12–0:17 | 8-bit to-do list gag | No voice for 4.4 s, and the joke gives away the twist early | Turn it into a games beat: an original pixel creature evolves for real, and the narrator says "Games." The to-do list only fails later, at "And this?" |
| 0:21–0:35 | It evolved: paper, organiser, reminders, sync, share, nag | Mixed. The paper pad and the reminders work. The organiser, the sync dots and the share window look like clip art. | Show real objects: a 3D organiser and a 3D phone, lit the same way as the gallery. Keep the retro dialogs. |
| 0:35–0:39 | Sticky notes snowing | Fine | Add motion blur and a whoosh. |
| 0:39–0:43 | Archive office photo | Keep | None |
| 0:43–0:53 | Notifications, highlighted message, waiting list | Keep. This is the strongest beat. | Add a click on each highlight. |
| 0:53–0:57 | "Until now" becomes the mark | Weak. A white ring scales up; theirs builds the logo from particles. | Use a particle logo reveal (21st.dev Murmuration), restyled to Studio. |
| 0:57–1:01 | App window with the name | Too empty: a small mark in a big white box | Open it like a real laptop (21st.dev Laptop Lid Opens), then cut straight to the home screen. |
| 1:01–1:05 | WhatsApp ask | Keep | Add typing and send sounds. |
| 1:05–1:15 | Aura and results | Keep the idea. The aura reads a bit flat. | Use a real aura block and one swell per result. |
| 1:15–1:20 | Approve | Keep | A click, and a short lift in the music. |
| 1:20–1:30 | Gallery: photos on plinths | Cut it. It looks cheap. | Rebuild as a real 3D room with real models (next section). |
| 1:30–1:36 | White end card | Fine but plain | 21st.dev Frame To Icon: the last gallery frame folds into the app icon. |

Between acts, every change is a hard cut. Theirs uses a few motivated moves (zoom-through, blur dissolve). Ours needs the same at four places: into "Oh, it evolved", into the problem, out of "Until now", and into the gallery.

## Better tools found

Everything here is free and works in our setup. I checked each one today.

| Need | Tool | Source and licence |
| --- | --- | --- |
| A real 3D museum | `@remotion/three` (React Three Fiber inside the video) with `@react-three/drei` | Remotion's own package, 4.0.539 to match ours |
| Real objects on the plinths | Poly Haven 3D models: oil lamp, cash register, old TV, classic laptop, cassette player, gamepad, wall telephone, binder notebook, clipboard | [polyhaven.com](https://polyhaven.com), CC0 (no credit needed) |
| Museum lighting | Poly Haven HDRI skies and rooms | CC0 |
| Logo built from "Until now" | 21st.dev video block **Murmuration** (particles flock into the logo). The backup is **Shattered Title Assembly**. | 21st.dev MCP, Remotion blocks |
| End card | 21st.dev **Frame To Icon** | 21st.dev MCP |
| Moves between acts | 21st.dev **Zoom Through**, **Blur Dissolve**, **Flash Cut** | 21st.dev MCP |
| App reveal | 21st.dev **Laptop Lid Opens**, **Tilt To Flat Screen** | 21st.dev MCP |
| Motion blur on fast moves | `@remotion/motion-blur` | Remotion's own package |
| Whooshes, clicks, logo hit, CRT hum | ElevenLabs Sound Effects v2 | Our ElevenLabs connector. Needs a paid plan before ad use. |
| A calm bed under the story | ElevenLabs Music, or ElevenLabs Video to Music, which scores music straight to our cut | Our ElevenLabs connector. Same plan note. |

Ruled out:

- **AI video (Veo, Kling, Seedance).** It would look generated and second-hand, which is exactly what you don't want.
- **More stock photos.** The ending already shows that photos on boxes look cheap.

The 21st.dev blocks are free to search. I'll check the install cost before pulling each one in, and tell you if any of them is paid.

## v3 plan

Sound comes first, because it is the biggest gap and the cheapest fix.

1. **Remix.** Voice 10–12 dB over the music everywhere, including the opening. Hype music only in the opening and the ending, a soft bed under the story, near silence at "Until now", then a swell.
2. **Voice the gag.** One new line, "Games.", and an original pixel creature that really evolves.
3. **Sound effects.** About 12 short effects, placed on the same timeline.
4. **Ending.** A real 3D gallery with Poly Haven objects that match the story (lamp, cash register, TV, cassette player, gamepad, telephone, notebook), ending on our icon as a lit 3D tile. Then Frame To Icon into the end card.
5. **"Until now" logo build and the laptop reveal**, using 21st.dev blocks restyled to Studio lavender and our fonts.
6. **Moves between the four acts**, with motion blur.
7. **Check before render.** The same audit again: levels, gaps, an 18-still critique, and every still read with the sound off.

I'll start on 1 to 3 now and send you a sound-only check before the full render.

And the images for example like the one for light etc is meh or money like the coin is cheap looking with its white background etc their zoomed in dollar shot for example to the Benjamin Franklin is common cinema etc it’s nice&#32;

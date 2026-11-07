---
title: Design skills
created: 2026-10-27
updated: 2026-10-29
type: concept
tags: [design, catalog]
sources:
  - raw/transcripts/plan-2026-10-27/notes.md
  - raw/articles/motion-2026-10-27/licence-check.md
  - raw/articles/motion-2026-10-27/jakubkrehel-teardown-skill.md
  - raw/transcripts/design-2026-10-27/notes.md
  - raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills
  - raw/articles/design-skills-2026-10-27/motionsites-claude-skill
  - raw/transcripts/thread-updates-2026-10-27-1259/notes.md
confidence: high
---

# Design skills

Catalogue of the skills and outside repos we use for visual work. Pairs with [[motion-playbook]] (how we make motion and film) and [[design-system]] (palette, fonts, rules).

## Our in-repo skills
The 20 folders in `.claude/skills` (webapp, Core and site match; iOS differences are on [[design-system]]): ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills] ^[raw/transcripts/design-2026-10-27/notes.md]
- animate: build an animation in the right order of decisions (whether, purpose, tool, properties, curve, duration). ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill] ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
- animation-performance: keep animation inside the frame budget; composite-only properties; find dropped frames.
- animation-vocabulary: turn a vague description of an effect into its exact name.
- apple-design: Apple's fluid, physical motion and gesture design translated for the web.
- claude-animation: code-rendered animation from buildwithhanif (MIT, vendored 27 Oct); needs Node 20+ and ffmpeg. ^[raw/articles/motion-2026-10-27/licence-check.md]
- break-ui: feed UI worst-case data (long names, zero items, huge counts) and fix what breaks.
- design-to-motion: from elayadesign; turns a static screen into a looping, built-in HTML replica and exports MP4 and GIF (vendored 27 Oct, see below). ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
- design-md-library: reference DESIGN.md files for about 80 well-known products. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill]
- design-taste-frontend: anti-slop art direction for websites. ^[raw/transcripts/design-2026-10-27/notes.md]
- emil-design-eng: Emil Kowalski's approach to polish, component design and animation decisions.
- find-animation-opportunities: read-only search for places that should animate, with exact values.
- improve-animations: audit a codebase's motion and write plans other agents can run.
- landing-page-design: from elayadesign; a 12-section landing page with one offer, conversion copy and a strict visual system (vendored 27 Oct, see below). ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
- mobile-native: small CSS and meta fixes that make a web app feel installed on a phone.
- no-vibecoded-look: the owner's 20 patterns that make an app look AI-made; checked on every visual change.
- redesign-existing-projects: audit and upgrade an existing site or app without breaking it (elayadesign version adapted to Studio since 27 Oct 2026). ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill] ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
- review-animations: review motion code against a high craft bar; flags by default.
- teardown: Jakub Krehel's annotated-illustration skill, vendored 27 Oct (MIT); editable parts, colours and notes, exported as SVG or PNG. ^[raw/articles/motion-2026-10-27/licence-check.md]
- ui-ux-pro-max: UI/UX intelligence for web, mobile and desktop.
- web-design-guidelines: review UI code for interface and accessibility guidelines.

## Jakub Krehel's skills
Repo `jakubkrehel/skills`, MIT licence (keep the notice if code is vendored). Install: `npx skills add jakubkrehel/skills`. Fourteen skills: better-interface, better-ui, better-typography, better-colors, better-accessibility, better-layout, better-writing, interface-review, explain-interface, break, build-design, teardown, state-machine, variant.
`teardown` (added 25 Oct 2026) makes an annotated technical illustration of any object. Parts, colours and annotations are editable, and the result exports as SVG or PNG. It suits explainer graphics of our product's parts or of hardware (for example a bot's pieces or the phone and desktop pairing). Examples: jakub.kr/skills. `build-design` works from Figma files. ^[raw/articles/motion-2026-10-27/licence-check.md]

## Repos to clone or study
Licences read 27 Oct 2026 from each LICENSE file (the GitHub API was not reachable, so the repo-level field was not checked). ^[raw/articles/motion-2026-10-27/licence-check.md] ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill]
| Repo | Licence | Use |
|---|---|---|
| jakubkrehel/skills | MIT | vendor ok, keep notice |
| JohnHeibel/ClaudeAnimationBase | MIT | vendor ok (p5.js starter, render script) |
| buildwithhanif/claude-animation-skill | MIT | vendor ok (Node 20+, ffmpeg) |
| elayadesign/ai-design-skills | MIT | vendored 27 Oct 2026 with LICENSE (commit 5e57840) |
| Motionsites-AI/claude-skill | MIT for instructions, references and scripts; examples and media are (c) MotionSites | not vendored; see its section below |
| heygen-com/hyperframes | Apache-2.0 | vendor ok with NOTICE; some features may need outside accounts (unconfirmed) |
| guanmo-ai/awesome-ai-motion | MIT for its scripts only | scripts ok; prompts and assets belong to their authors |
| athemeroy/awesome-opus-5-5-videos | CC BY 4.0 text | cite with attribution; may be renamed |
| JohnHeibel/PDoomVideo | none found | reference only (guide plus storyboard subagent pattern) |
| WinterArc21/Battle-of-Austerlitz-Film | none found | reference only |
| remotion-dev/remotion | Remotion License (source-available) | not vendored; free up to 3 employees, paid above; ask the owner before adopting |

## Owner motion references (27 Oct 2026, 12:50 to 13:02)
- colorfigures (MIT, April Zhu): hand-inked isometric working objects. A style reference.
- Supademo: product-demo style. Automatic zoom and pan to each click, an animated cursor, a hotspot beacon, step callouts and dimmed surroundings. The reference for the real-product look.
- LongCat-Video: skipped. It needs large Nvidia GPUs and does not keep shots consistent.
The owner says the style is still open and quality comes first. Films follow [[motion-playbook]].

## When to use which
| Job | Use |
|---|---|
| Building UI | design-taste-frontend, emil-design-eng, animate, then no-vibecoded-look |
| Reviewing motion | review-animations (and animation-performance for jank) |
| A film or ad | [[motion-playbook]] |
| An explainer illustration | teardown |
| A landing page | landing-page-design |
| A motion showcase of a screen | design-to-motion |
| A design system document | design-md-library |
| Breaking a screen on purpose | break-ui |

## Running the skills before visual work (owner, 27 Oct 2026)
The owner asked which design skills a visual change used, and expects the answer to list all of them. Run the whole set up front, not the ones that seem relevant: the web-design-guidelines checklist, a ui-ux-pro-max search, the Emil before-and-after table, and design-taste-frontend's draw (`--keep palette,type`), lint and inspect scripts. Name each one in the first before-and-after post, with the 21st.dev search term behind each piece. design-taste's inspect is built for landing pages, so its photo, video and 16 to 20 px body-text rules fire on app screens: fix its lint FAILs and say why the rest do not apply. If Chromium runs as root, point `CHROME_PATH` at a `--no-sandbox` wrapper.

## elayadesign/ai-design-skills (27 Oct 2026)
Owner shared it on 27 Oct. MIT, commit 5e57840, vendored unchanged with its LICENSE into `.claude/skills` of webapp (#664), Core (#597), site (#282) and iOS (#96). It adds two skills. ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
- design-to-motion turns a static design (a Figma frame or screenshot) into a pixel-exact HTML replica that builds in from empty, acts out its story on a loop, and exports an MP4 plus GIFs. The Figma part needs a Figma token, so we skip it. Key numbers: ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
  - Intro rise 10 px (cards 24 px, scale 0.985) from a 4 px blur. Transforms 1.05 s with cubic-bezier(0.16,1,0.3,1); opacity and blur 0.7 to 0.8 s with cubic-bezier(0.33,1,0.68,1). ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill] ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
  - Stagger 80 to 90 ms per container, 30 to 80 ms per item. Typing is one glyph every 45 to 70 ms. ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill] ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
  - A 12 s loop: build 0 to 2.4 s, stories 2.4 to 11.0 s, dissolve to 11.6 s, empty beat to 12.0 s. ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
  - Website GIF 960 px wide at 15 to 20 fps (800x500 at 20 fps). Capture by stepping the Playwright page clock; encode H.264 yuv420p at CRF 14 to 15. Fidelity check: PSNR over 35 dB. ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill]
- landing-page-design runs an intake, then a 12-section page with one offer and one primary action, conversion copy and a strict visual system: ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
  - Spacing only 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px.
  - Motion cubic-bezier(0.22,1,0.36,1): 500 ms for movement, 300 ms for colour and opacity, scroll reveal 32 px over 600 to 800 ms, once. ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill] ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
  - Never Inter, no italics, sentence case, no hyphens in copy. ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills] ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill]

Where each applies:
- App screens (settings, onboarding): the design-to-motion intro tokens and the landing-page menu and reveal timings. Product interaction motion stays with emil-design-eng.
- Our films: design-to-motion Part C maps onto our seek(t) engine; see [[motion-playbook]].
- The site: landing-page-design in full.

Conflicts, our rules win:
- Frosted glass panels, halos and sheen sweeps (design-to-motion), and a translucent blurred nav with gradient heading text (landing-page-design), fail `no-vibecoded-look`.
- "Visible motion every 1 to 2 s" is too busy for our calm explainer pacing.
- Its font lists suggest Geist, Manrope and Poppins. We use Figtree and Archivo for new visuals (no Inter) and SF Pro in apps; see [[design-system]]. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]

Redesign skill (resolved 27 Oct 2026): our old redesign-existing-projects (MIT, by Leonxlnx) recommended glassmorphism, mesh gradients and italics, against no-vibecoded-look. On the owner's word it was replaced in all four repos (webapp #665, Core #598, site #283, iOS #97) by elayadesign/redesign-skill@7df13f6 (MIT), adapted: no gradient heading text, grain, translucent nav or placeholder image URLs, and Design values set to Studio and our font rules. ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]

## Motionsites-AI/claude-skill (not vendored)
Owner shared it on 27 Oct and said it was not too important. Commit faa30d5. Its skill, motionsites-web-builder, builds cinematic websites, landing pages and hero sections (or prompts for Lovable, Bolt and v0) from a catalogue of example designs, real media and a screenshot-and-fix loop (`scripts/shoot.py`). The workflow: decide the brief (what and for whom, mood in three words, one signature idea, output, scope), study the two or three closest examples, get media, write a precise spec from the spec template, build, then screenshot and fix. ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill]
- Licence split: the skill instructions, references and scripts are MIT. The `examples/` and `media/` folders are (c) MotionSites: usable to build sites, not to redistribute as a collection. ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill]
- Why we did not vendor it: it leans to cinematic, gradient and neon-heavy looks that clash with our flat Studio look, and its core value (the examples and media) cannot be redistributed. `raw/` keeps only the MIT parts.
- Still useful as reading: the references/techniques notes (scroll, type and text motion, video and media, layout and UI) and the spec template's precision (exact fonts, tokens, durations and easings). ^[raw/articles/design-skills-2026-10-27/motionsites-claude-skill]

## Customer skills from skill-issue.in (27 Oct 2026)
These are not design skills for us; they are one-tap installs for customers on the Skills page. Thread "Add skill-issue.in skills to curated list" swept all 313 skills across nine domains. The full list is saved on the owner's PC at `Documents\Headmaster-Ecosystem\skill-issue-full.json`.
- Core #574 (merged 27 Oct) added 20: a new Marketing group of 7 (copywriting, copy editing, content strategy, marketing psychology, ideas, SEO audit, AI search), 1 interface design and 12 coding, including our own system-design skill. With an earlier PR the total is 26 new installs (Marketing 7, interface design 1, Coding 18). ^[raw/articles/design-skills-2026-10-27/elayadesign-ai-design-skills]
- Only MIT or Apache-2.0 sources, with the licence text beside each skill. Skipped: no licence, non-commercial or share-alike, proprietary document skills, anything needing scripts or keys, and 84 with no repo link.
- systemdesign.io has no skills and no licence, so we wrote our own system-design skill.
- These new customer skills and the Extensions items ship with the 1.2.7 web app release ([[releases]], [[web-chat]]). ^[raw/transcripts/plan-2026-10-27/notes.md] ^[raw/transcripts/thread-updates-2026-10-27-1259/notes.md]
- Catalogue context: [[catalog-extensions]].

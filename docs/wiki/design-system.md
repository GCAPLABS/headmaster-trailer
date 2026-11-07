---
title: Design system
created: 2026-10-27
updated: 2026-11-04
type: concept
tags: [design, rule]
sources:
  - raw/transcripts/nightly-2026-11-04/summary.md
  - raw/transcripts/redesign-audit-2026-11-04/notes.md
  - raw/transcripts/nightly-2026-11-03/summary.md
  - raw/transcripts/plan-2026-10-27/page-reference.md
  - raw/transcripts/design-2026-10-27/notes.md
  - raw/transcripts/project-memory-2026-10-27/studio-theme-needs-life-later.md
  - raw/articles/motion-2026-10-27/licence-check.md
  - raw/articles/motion-2026-10-27/headmaster-ad-film-brief.md
  - raw/articles/motion-2026-10-27/0xmovez-motion-design-course.md
  - raw/articles/motion-2026-10-27/jakubkrehel-teardown-skill.md
  - raw/transcripts/thread-updates-2026-10-27-1141/notes.md
  - raw/transcripts/thread-updates-2026-10-27-1259/notes.md
  - raw/transcripts/nightly-2026-10-27/summary.md
  - raw/transcripts/nightly-2026-10-28/summary.md
confidence: high
---

# Design system

Palette, fonts, tokens, icons and the owner's design rules across desktop, web chat, iOS and the site. Surface pages: [[desktop]], [[web-chat]], [[ios]], [[site]]. Owner rules: [[owner-and-working-rules]].

## Gate for visual work
Every repo CLAUDE.md requires loading the design skills in `.claude/skills` first, then checking the rendered screen against `no-vibecoded-look`. Our own palette and font decisions beat any skill default. Core, webapp and site have the same 16 skill folders; iOS has 15 (no mobile-native) plus write-swift. Required set: web-design-guidelines, ui-ux-pro-max, design-taste-frontend, redesign-existing-projects, design-md-library, the Emil Kowalski set, no-vibecoded-look. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]

Owner rule (27 Oct 2026, 10:32): the 1.2.7 web app must look almost identical to the desktop app, with the same branding, Studio skin, palette and naming. Before chat is shown to the owner, check side-by-side desktop and web screenshots in light and dark, and run a brand scan of `dist-webapp`.

## The 20 no-vibecoded-look rules (owner list, 13 Oct 2026)
File: `.claude/skills/no-vibecoded-look/SKILL.md`. In short, we avoid:
1. Purple-to-blue gradients (use flat palette fields). 2. Gradient hero text. 3. Emojis in headings. 4. Inter alone for every role (vary weight and size). 5. Coloured-border cards (hairline neutral or none). 6. Glassmorphism (blur only on real overlays). 7. Low-contrast dark mode (AA 4.5:1). 8. Three icon boxes in a row. 9. A pill above the headline. 10. Lucide icons everywhere (Hugeicons is the set). 11. Untouched shadcn. 12. Fade-in on scroll. 13. Cursor-following glow. 14. Buttons that only fade on hover (need hover, pressed, focus). 15. Inconsistent spacing. 16. Em dashes in UI copy. 17. Buzzword copy. 18. Serif italic accent words. 19. Space Grotesk plus Instrument Serif. 20. Grain over gradients.
Clash rule in the skill: if a line clashes with an owner decision (Inter kept), keep the decision, vary weight and size, and mention the clash. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]

## Studio palette and tokens
Studio is the default theme everywhere except the site: white, grey, royal blue. Since 4 Nov (Core #885) the Studio accent is lavender, and royal blue is retired; see the dated decisions below. One source generates all of it: Core `brand/headmaster/theme/tokens.json` with `generate.mjs` (`--write`, `--repos`). ^[raw/transcripts/design-2026-10-27/notes.md]
- Light: background #ffffff, foreground #000000, surface #f2f2f2, border #e6e6e6, muted text #606060, accent #0000da (retired by the 3 Nov redesign brief, see the dated decisions below) (hover #0000b8), frame/sidebar #e0e0fb, user bubble #e0e0fa, destructive #d92b2b. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Dark: background #1c1c1e, foreground #ffffff, card #1e1e20, surface #2c2c2e, border #38383a, muted text #a1a1a6, accent grey #f2f2f7 (since 26 Oct, "D6"), frame #111115, link #c7c7cc, destructive #ff6b6b. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Logo: ink mark on light, lime #e0ef7c mark on a #111115 tile in dark and for the app icon.
- Desktop dark overrides ring to #a1a1a6; web dark ring is #c7c7cc (generator output, not a clash).
- The Studio skin is never named "Codex" in any user-visible text (owner, 13 Oct 2026).
- Desktop: generated `apps/desktop/src/plugins/headmaster-studio/studio-palette.generated.ts` plus local fields in `theme.ts`; Studio sets `--hm-gradient: none`. Default skin in `src/themes/presets.ts`; frame colour in `src/styles.css` (`--ui-sidebar-surface-background`). ^[raw/transcripts/design-2026-10-27/notes.md]
- Web chat: `apps/chat/app/theme.generated.css`; skins list in `apps/chat/lib/prefs.ts` (Studio default, Sakura Blossom, Gold, Messages, Paper, Slate, Terminal, Amber CRT, Code); extra skins in `themes.css`. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- iOS: `Headmaster/Models/Theme.swift`; shared values via `ThemeTokens.generated.swift`. Themes: Sakura (stored name "pink"), Studio, GitHub Dark, Standard, Paper, Slate, Terminal, Amber, Claude Code. Default `Theme.defaultThemeName = "Studio"`.
- Site keeps its own colours: marketing palette in `app/styles/site.css` (lab orange #ff5c28, black #181916, white #f2f3ee, lime #dfef83); `app/globals.css` has a second neutral set with green accent #1A4D2E. ^[raw/transcripts/design-2026-10-27/notes.md]

## Fonts by surface
- Desktop (Windows) and web chat: Inter (`--font-sans: "Inter Variable"` in web `globals.css`; desktop stack starts with Inter, no web font loaded for Studio). Mono: JetBrains Mono / system mono. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- iOS and Mac: Apple system font (SF Pro). `Theme.swift` moved from Inter to SF Pro in iOS #93 (27 Oct); History: before that Inter was set on every theme. Bundled Inter files may remain for widgets. ^[raw/transcripts/design-2026-10-27/notes.md]
- Site marketing: General Sans (section headings), Inter Display (hero), Manrope (body); Anton only in OG images. App pages use Inter (`app/styles/application-fonts.css`). ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Type scale rule from 14 Oct: headings 600-700, body 400, labels 500, at most two faces (Inter plus mono), five well-spaced sizes, line height 1.45-1.6. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]

## Dated font and colour decisions (oldest first)
- 8 Oct: site keeps General Sans, Inter Display, Manrope; Anton may be dropped in site clean-up (S7). Icons: Hugeicons stroke-rounded is the one set. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- 13 Oct: Studio is the default on iOS, desktop and web chat; Sakura stays optional; site keeps its own colours. The 20-rule list is shared. ^[raw/transcripts/plan-2026-10-27/page-reference.md] ^[raw/transcripts/design-2026-10-27/notes.md]
- 14 Oct: option A, Inter stays in desktop, web chat, iOS. Do not propose a font swap again. (History: iOS and Mac moved to SF Pro on 24 Oct, iOS #93 on 27 Oct; see the font line above.) ^[raw/transcripts/plan-2026-10-27/page-reference.md] ^[raw/transcripts/design-2026-10-27/notes.md]
- 15 Oct: the Sakura theme may stay as an optional web theme, named "Sakura Blossom" (the Sanrio name and art were dropped on 6 Oct; iOS rule: no third-party character names or art); Studio needs more life, later. ^[raw/transcripts/plan-2026-10-27/page-reference.md] ^[raw/transcripts/design-2026-10-27/notes.md]
- 15 Oct (owner, on seeing chat2 keep the optional Hello Kitty theme): "No its fine, I like it", so do not remove the optional web theme; for Studio "we will need to add some breathable effect or add some life", but that is for later and outside the current plan. After the Ecosystem plan, propose subtle motion for Studio (breathing accents, soft animation). ^[raw/transcripts/project-memory-2026-10-27/studio-theme-needs-life-later.md]
- 23 Oct: only the lime H-cap is the logo. "No Inter if it says no Inter" for new visual work; audit page used Figtree, Archivo, JetBrains Mono. 21st.dev first for buttons, icons, animations. ^[raw/transcripts/design-2026-10-27/notes.md]
- 24 Oct: iOS and Mac use SF Pro; Windows desktop and web chat keep Inter; do not propose Figtree or Archivo again; drop bundled Inter on iOS as its own step. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- 26 Oct: dark accent becomes grey; settings look should follow the cleaner Codex/Claude style. ^[raw/transcripts/plan-2026-10-27/page-reference.md] ^[raw/transcripts/design-2026-10-27/notes.md]
- 3 Nov: no monospace on UI labels, section headers, eyebrows or meta text (owner: "i hate that ai font ... its just screams ai slop to me"); monospace only for code, terminals, diffs and key caps. ^[raw/transcripts/nightly-2026-11-03/summary.md]
- 3 Nov (full redesign brief): royal blue #0000da is retired as too strong; the colour moves to the lavender family (#eeeefc). Five themes that change font, radius and density (Studio, Paper, Blossom, Night, Garden); font options Funnel (our pick), Instrument, Bricolage, Parkinsans; the Core #873 wordmark font is "too generic". Prototype and owner comments: [[now]]. ^[raw/transcripts/nightly-2026-11-03/summary.md]
- 4 Nov (Core #885, merged): Studio is lavender, royal blue is retired, and five themes (the round 1 list) change font, radius and density. Funnel is the font. Terminal and Y2K follow in the next PR. Dark modes are black and grey, never blueish (owner rule). The palette and font lines above are history until web and iOS follow.

Fonts, newest rule wins (24 Oct 2026 plus the memory index): our apps and pages use Inter on web and Windows desktop and SF Pro on iOS and Mac. Never propose Figtree or Archivo for the apps. Films use Figtree plus Archivo only (owner, 27 Oct, [[motion-playbook]]). History: the 23 Oct "no Inter in new visuals" line (Figtree and Archivo on the audit page) is superseded. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]

## Icons and components
- Hugeicons stroke-rounded (`@hugeicons/react`, `@hugeicons/core-free-icons`) via the facade `apps/desktop/src/lib/icons.ts`; feature code must not import icon packages directly. iOS uses SF Symbols. Site brand logos use react-icons. Desktop's leftover lucide and tabler imports were removed by Core #578 (27 Oct); History: before that about four desktop files still imported `lucide-react` and `DESIGN.md` mentioned Tabler. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- 21st.dev components the owner linked (15 Oct): Tool Calls Section, notifications-5 (replaced by toast option D, see [[desktop]]), Multi-Step Setup Wizard, Onboarding Checklist, Agent Plan. No new UI primitive libraries: chat keeps Radix Dialog and Dropdown. The site drops lucide-react, framer-motion, motion and `@paper-design/shaders` and keeps react-icon-cloud. ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- 21st.dev first (owner, 23 Oct; restated 27 Oct) for buttons, icons, animations; restyle to Studio. Redesign rules (27 Oct): 21st.dev first, flat rows, no grey boxes. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- 27 Oct 17:22: at least 95% of each screen is 21st.dev components (owner: "the only parts that are good are the ones from 21st dev"); screens moved in unchanged do not count. The Admin Panel draft was rebuilt for this. ^[raw/transcripts/plan-2026-10-27/page-reference.md] ^[raw/transcripts/design-2026-10-27/notes.md]
- 27 Oct 16:04: the rule covers EVERY screen, admin and security pages included; no hand-coded UI. Cause of the AR5 /admin/mfa miss: the checked-in CLAUDE.md design block listed the design skills but not 21st.dev, and AR5 was treated as security work. The block now names the 21st.dev MCP. See [[decisions]].
- Icons everywhere (27 Oct 2026): every extension, skill, plugin, app and add-on has an icon from `customer-icons.json` (Simple Icons brand marks plus Hugeicons): Core #592, webapp #660, iOS #95 (iOS needs a Mac build and SF Symbols check). Mockup source: `/mnt/project-files/mockups/headmaster-app-ui/`. ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/thread-updates-2026-10-27-1259/notes.md]
- Icon lookup for every extension, skill, plugin, connected app, tool group and add-on: `items` by leaf id, then any word of the id in `match`, then `categories`, then `kinds`, then the PuzzleIcon fallback. Values are Simple Icons brand marks (CC0, pinned 16.28.0) or Hugeicons names. Edit Core's `headmaster/contract/customer-icons.json`, then run `node scripts/headmaster_icons.mjs` against the pinned packages; it fails on unknown names. Copies sit in webapp `apps/chat/lib` and iOS `Resources`. Core's `test_customer_icons.py` fails when a curated item has no entry.
- Canonical logo masters: `/mnt/project-files/brand-cleanup/canonical/`; committed in site `public/brand/`, webapp `brand/`, Core `brand/headmaster/`. Stale logos removed 23 Oct. ^[raw/transcripts/design-2026-10-27/notes.md]
- Never link these stale marks: the hexagon "Headmaster AI Assistant" sheet, the black GCAP octopus, the black "G" logo.svg, the Vite favicon, the green H tile and the blue Nora N. Render new icons from the masters.
- Restyle mock bench (rule): every 21st.dev piece needs a real Current shot plus an Upstream card. The bench lives in apps/desktop/visual/restyle (not committed). ^[raw/transcripts/nightly-2026-10-27/summary.md]
- Whole-app restyle with 21st.dev only: a 40-piece proposal page exists; nothing is built before the owner approves. Owner, 27 Oct 2026 20:55: the first pass was "shallow and bland"; upstream is the richness bar. ^[raw/transcripts/nightly-2026-10-27/summary.md]
- The 21st.dev rule is also in the design rules of Core #607, webapp #678, iOS #99 and site #290 (merged). Admin Panel pieces: [[admin-panel]]. ^[raw/transcripts/nightly-2026-10-27/summary.md]

## Chat and desktop patterns (15 Oct, from the comparison audit)
Proposals taken from the Aside audit; the audit screens sit in the project at `.playwright-mcp/aside-audit/`. ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Active session row is a raised card (surface 85%, 0.5 px ring at 15%, shadow-md at 5%, radius 10 to 12); row hover is ink at 5% (desktop is 3% today). Hairlines are 0.5 px rings, not solid 1 px; three alpha surface steps. ^[raw/transcripts/plan-2026-10-27/page-reference.md] ^[raw/transcripts/thread-updates-2026-10-27-1141/notes.md]
- Sidebar 256 px; rows 32 px with 12 to 13 px labels (desktop is 26 px today). Hugeicons stroke 1.5 (chat default 1.8); 16 px rows; 12 px chevrons at 50%. ^[raw/transcripts/plan-2026-10-27/page-reference.md] ^[raw/transcripts/design-2026-10-27/notes.md]
- A segmented switch for Lite/Pro and Cloud/Work; a spinner and a 6 px unread dot in session rows; the account pill moves to the sidebar top-left; dark canvas lifted off #000 to about #161616. ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Toasts: one neutral action, one at a time, info closes after about 4 s. A What's new card once per version. Trial limit as a top-right chip. The remote-display strip stays a strip, neutral. ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Not adopted: rainbow gradients, the sky hero, Geist.

## Open design items per surface (finding, 15 Oct)
- Desktop: ARIA errors on the onboarding stepper (tab roles without a tablist, `aria-controls` to missing panels); other skins still use `--hm-gradient`. ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- Chat: backdrop-blur on the tool tile (`tool-calls-section.tsx`); `--subtle-foreground` #8e8e93 is about 3.3:1, darken to about #6e6e73; fade-only hover on destructive, Stop and Google login buttons; arbitrary text sizes. ^[raw/transcripts/plan-2026-10-27/page-reference.md]
- iOS: spacing literals should move to a 4/8/12/16/24 scale. Site: dark-mode contrast unmeasured; no spacing audit; an eyebrow pill in `ComingLaterPage.tsx`; dead `.cursor-ring` CSS. Site visual direction: [[site]]. ^[raw/transcripts/plan-2026-10-27/page-reference.md]

## App restyle notes (28 Oct 2026 16:06 UTC)
The profile menu has no Model or Subscription rows; it has an organization switch and the Wallet balance. The command palette includes chat search. The chat list keeps its sort controls and the Star on Pinned. Keep each 21st.dev component's own motion (bounce, springs, enter and exit) and restyle only colours and fonts. Show motion to the owner as short clips, not stills. Admin Panel picks: [[admin-panel]]. ^[raw/transcripts/nightly-2026-10-28/summary.md]
- Core #626 (merged 28 Oct 2026) restyled the sidebar and command palette with 21st.dev pieces. The 28 Sep audit found one open nav gap: Messaging and Artifacts are still top-level rows, where the A2 plan wanted tabs under Capabilities. Re-check it against #626, and ask the owner before any sidebar rebuild.
- Named picks merged in #626: kokonutd profile dropdown (its own colours, where the owner asked), ibelick dock, shadcnstore datatable-1 for Users, sean0205 area charts, olewandowski1 chat cards, serafimcloud Input Bar, cnippet file tree and inference-sh code. Webapp credits go in `apps/chat` THIRD-PARTY-NOTICES.md; `component-credits.ts` is Core desktop only.

## Flat sections, no grey boxes (owner, 3 Nov 2026)
The owner called the grey filled boxes ("containers") on the Memory page AI-made and said "Much better" to the flat version. Rule for desktop pages: sections have no fill and no frame; a hairline (`--ui-stroke-tertiary`) separates columns and rows; rows get a hover tint only; no grey track behind tabs. Use the app Tabs (21st.dev Underline Tabs, cnippet-dev) and the app Select, never native selects or hand-coded tab rows.
- Core #800 (merged 3 Nov, squash 4a16d14c, ships with the next desktop release): Memory page rebuilt this way. Overview is the Kokonut UI metric-card (dorianbaffier, `components/ui/metric-card.tsx`: rolling digits, sliding 7D/30D pill, morphing line, drag and keyboard reading, breakdown by kind) and "Recently remembered" is the Kokonut ai-memory row (`components/ui/memory-row.tsx`). Both are ports with every animation kept; palette classes became tokens. Copy now says "agent", not "bot".
- Not used, still available if the owner asks: Kokonut ai-context-meter, BKLit sparkline and ring chart (need `@number-flow/react` and `d3-shape`).
- Core #806 (merged 3 Nov, squash a5cb456a, not released): the sweep for the other desktop pages. Shared `Card` lost its grey fill and shadow; detail sections, context panel, Telegram and WhatsApp setup, Bot files, artifact table, council lanes, member picker and the local endpoint row are flat with hairlines. Settings and Fleet were already flat.
- Apps and Extensions are a grid of cards, not a list (owner, 3 Nov: "make them a grid of cards"; the blue filled Connect button was unreadable and looked AI-made). The card is 21st.dev Connect Integration Cards (olewandowski1) in `components/customize/app-card.tsx`, inside Magic UI magic-card (pointer spotlight) with Kokonut particle-button as the action (spinner, drawn check, particle burst). Connect is an outline button; Connected is plain text with a check. The Extensions, Skills and Messaging directory uses the same card. The line under the description is red when sign-in is needed (owner). Owner also said "not only 21st dev, we added a few more": Kokonut, BKLit, Componentry, Magic UI and Aceternity free are all open sources ([[owner-and-working-rules]]).
- Still blue and open: the On/Off toggle and the "All" chip on Extensions use the app primary; the owner has not asked to change them.

## Redesign DESIGN.md and prototype reference (4 Nov 2026)
- The owner asked for a design system written from the redesign. It is the repo-root `DESIGN.md` in Core. On looks it wins over `apps/desktop/DESIGN.md`.
- The approved redesign prototype (project files `redesign/prototype-src/src/screens/`) is the reference for page designs. Live Memory and Customize had never moved onto it. The prototype Memory page has one search and tabs Memories, Notes and Knowledge.
- Details for a page go in the side column (`apps/desktop/src/components/ui/side-column.tsx`), per [[decisions]].
- Audit findings to fix: five page-header kinds and six search styles across pages; the secondary button is a black fill; the MagicCard cursor glow breaks no-vibecoded rule 13; Customize tabs use four widths; every Extensions built-in gets the plug icon; about 92 strings still say "bot" (use "agent"). Causes and the full audit: [[now]].

## Grids, not rows (owner, 4 Nov 2026)
- "no no no I don't want rows, I want them as grids. Let users pick between row and grid with a selector." Item pages (skills, extensions, connected apps, messaging in Customize and Discover) default to a card grid with a Grid/List switch. From the same notes: side cards are loved; lavender selected boxes and tinted status pills "say AI"; the theme picker needs a new showcase; no narrow centred page column; info banners become dismissible pop-up cards. ^[raw/transcripts/nightly-2026-11-04/summary.md]

## Motion and video
Motion, film and animation practice is in [[motion-playbook]]; the skill and repo catalogue is in [[design-skills]]. Future visual threads must read both before starting.

## Settled
- Studio dark is a #1c1c1e panel, a #111115 sidebar and a grey accent #f2f2f7 (D6, 26 Oct 2026, `tokens.json`). Pure black exists only as the iOS "Black" option. History: the 13 Oct memory said #000000 derived. ^[raw/transcripts/design-2026-10-27/notes.md]
- Web and iOS carry the same nine themes with the same labels, as `themes.css` says. The iOS enum names (GitHub Dark, Standard, Claude Code) are internal only. ^[raw/transcripts/design-2026-10-27/notes.md]
- Marketing fonts come from `fonts.ts` per the 8 Oct 2026 decision. Site #298 (28 Oct 2026) removed the dead `tailwind.config.js` (Tailwind 4 never read it; its `font-display` and `font-sans` pointed at undefined variables) and replaced the unloaded Geist reference in `globals.css` with the marketing sans `site.css` already sets; nothing renders differently. Account and admin pages use Inter (`application-fonts.css`). ^[raw/transcripts/design-2026-10-27/notes.md] ^[raw/transcripts/plan-2026-10-27/page-reference.md]

## Gaps
- Screenshot folders in `/mnt/project-files/` were listed by name only, not opened. ^[raw/transcripts/design-2026-10-27/notes.md]
- Desktop Studio font loading and whether Geist is used live were not confirmed. ^[raw/transcripts/plan-2026-10-27/page-reference.md] ^[raw/transcripts/design-2026-10-27/notes.md]
- `ThemeTokens.generated.swift` and the site/webapp logo copies were not opened.
- Open items: Anton removal (S7), site hugeicons use (one file), Studio "breathable" polish (later). ^[raw/transcripts/design-2026-10-27/notes.md]

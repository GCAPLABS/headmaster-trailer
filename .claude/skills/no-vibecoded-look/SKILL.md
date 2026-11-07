---
name: no-vibecoded-look
description: The owner's don't-list of 20 patterns that make an app look AI-made ("vibecoded"). Check every visual change on the site, desktop, web chat and iOS against it before calling the work done.
---

# No vibecoded look

The owner does not want any of these in a finished screen. Before a visual change is called done,
check the rendered result (screenshot, not just code) against every line and fix each hit.

| # | Don't | Do instead |
|---|-------|------------|
| 1 | Purple-to-blue gradient | Flat surfaces in our palette (Studio: white, grey, royal blue #0000da); colour as fields, not gradients |
| 2 | Gradient hero text | Solid ink headline; hierarchy from size and weight |
| 3 | Emojis in headings | Plain words; a real logo or icon only where it carries meaning |
| 4 | Inter font everywhere | Give headings a distinct face or weight/size contrast; Inter alone for every role is the tell |
| 5 | Coloured-border cards | Hairline neutral borders, or no border with spacing and background shift |
| 6 | Glassmorphism cards | Opaque surfaces; blur only on real overlays (sheets, menus) |
| 7 | Low-contrast dark mode | Body text at WCAG AA (4.5:1) or better; check greys on dark |
| 8 | Three icon boxes in a row | Layout led by real content (screens, lists, numbers), not a feature-card trio |
| 9 | Badge/pill above the headline | Start with the headline |
| 10 | Lucide icons everywhere | Our one icon set is Hugeicons stroke-rounded (desktop `apps/desktop/src/lib/icons.ts`); no Lucide imports. Use icons sparingly, sized to the text; prefer labels |
| 11 | Untouched shadcn UI | Restyle components to our tokens (radius, spacing, type, colour) |
| 12 | Fade-in on scroll | Content is simply there; motion only for state changes (see the animate skill) |
| 13 | Cursor-following beam/glow | None |
| 14 | Buttons that only fade on hover | A real hover state: background or colour shift, plus pressed and focus states |
| 15 | Inconsistent spacing | One spacing scale from the tokens; same gap for same relationship |
| 16 | Em dashes everywhere | Commas, full stops, colons; no em dashes in UI copy |
| 17 | Generic buzzword copy ("supercharge", "seamless", "unlock") | Plain, specific words about what it does |
| 18 | Serif italic accent words | One type voice; emphasis by weight or colour |
| 19 | Space Grotesk + Instrument Serif | Our chosen fonts only |
| 20 | Grain texture over a gradient | None |

Source: a list the owner shared on 13 Oct 2026 ("20 reasons why your app looks vibecoded").
If a line clashes with an earlier owner decision (Inter as the app font is kept for now; the owner may rule on it), keep the
decision, avoid the pattern where you can (vary weight and size), and mention the clash in your reply.

# App showcase (85-95 s)

Replaces the 3D museum (owner: it read as AI). Five real recordings of our app's mock UI from feedback.gcaplabs.com, in `public/app/show-1..5.mp4`.

How they were recorded: Playwright, a 2880x1920 window, the `#demo` panel pinned to the top left with CSS `zoom: 2` (Playwright's video ignores deviceScaleFactor, so the zoom is what makes it sharp), the tabs clicked in turn (Do a job, Asks first, Memory, Automations, Hire a team), 7 s each. Each clip is a 2.2 s crop of the moment a state changes, scaled to 1920x1080:

| Clip | Tab | Moment |
|---|---|---|
| show-1 | Do a job | the ask being typed |
| show-2 | Asks first | the Approval mode menu opening |
| show-3 | Memory | the memory list loading |
| show-4 | Automations | New automation opening |
| show-5 | Hire a team | Hire Emily dialog |

`Museum` in `src/Film2.tsx` plays them as hard cuts on the 2 s grid with a slow push. `Gallery3D.tsx` is no longer used.

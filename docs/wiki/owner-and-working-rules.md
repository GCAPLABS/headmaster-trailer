---
title: Owner and working rules
created: 2026-10-27
updated: 2026-11-06
type: concept
tags: [rule, person]
sources:
  - raw/transcripts/nightly-2026-11-06/summary.md
  - raw/transcripts/nightly-2026-11-05/summary.md
  - raw/transcripts/nightly-2026-11-04/summary.md
  - raw/transcripts/wiki-refresh-2026-11-04/notes.md
  - raw/transcripts/owner-notes-2026-10-29/no-personal-matters.md
  - raw/transcripts/thread-updates-2026-10-27-1740/notes.md
  - raw/transcripts/project-memory-2026-10-27/MEMORY.md
  - raw/transcripts/project-memory-2026-10-27/decision-card-format.md
  - raw/transcripts/thread-updates-2026-10-27-1141/notes.md
  - raw/transcripts/thread-updates-2026-10-27-1259/notes.md
  - raw/transcripts/owner-notes-2026-10-28/parked-and-ios-scope-2155.md
  - raw/transcripts/nightly-2026-10-28/summary.md
  - raw/transcripts/nightly-2026-10-29/summary.md
confidence: high
---

# Owner and working rules

## Who
Owner: Matvey Zarif (GitHub mutvayzz-sys), UAE (Asia/Dubai), the only user of this project. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
Headmaster is free through the beta. Greenwood is our first client (not "the school pilot"), and every
customer-facing word is general: "organization", never "school" (owner 27 Oct). This is the
canonical statement; other pages only point here. The same goes for copy, legal text and site wording. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]

## How the owner wants work done
- One job per thread. Close finished or idle threads often, never one with an open owner question. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- One message per ask, relayed as soon as it comes up. Small steps with direct links. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- One shell command per code block. The owner's terminal is Windows PowerShell: give `ssh hm`
  then plain bash lines, never nested quotes. No long hashes in go lines. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- Never give the owner two competing paths from two threads; go lines live in the thread that
  runs them. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- Test end to end yourself before asking the owner to press Run. The owner hates
  fail-and-retry loops. Every Run or go line is dry-run by the thread first (27 Oct 15:58). ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md] ^[raw/transcripts/thread-updates-2026-10-27-1740/notes.md]
- Before pushing a PR, run only the tests for what you changed (the changed files' tests,
  typecheck, lint) plus the runtime image build whenever its inputs change; CI runs the rest
  (owner, 30 Oct 07:07 UTC, "I approve of the trim"). Do not run full suites or chat
  browser shards locally first (PRs run one chat shard, Deploy services all four): measured over 28 to 30 Oct they took about 25 minutes locally
  against about 7 in CI, and the local-first threads spent an estimated 5 to 9 hours on runs CI
  repeats. This replaces the 27 Oct 16:27 rule ("test the entire flow locally"); the image
  build stays because Core #608 shipped without the name-mask file and only CI caught it.
  Core CLAUDE.md and webapp CLAUDE.md carry the same text (Core #672, webapp #769).
  ^[raw/transcripts/thread-updates-2026-10-27-1740/notes.md]
- Never rerun a test suite that already passed on the same code (owner 27 Oct; webapp #675). ^[raw/transcripts/thread-updates-2026-10-27-1740/notes.md]
- "If upstream doesn't support it, we don't need it" (owner, 27 Oct 16:09; browser live calls
  dropped on that basis). Check upstream before building or keeping a feature. ^[raw/transcripts/thread-updates-2026-10-27-1740/notes.md]
- Cost-sensitive: quote the monthly cost of any CI or service option. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- Merge everything finished and green; no owner go needed for approved work. All work off main. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- Safety classifiers block self-merges, live DB writes and deploy keys/secrets: the owner runs
  those, or posts an explicit go line in the thread that runs it. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- No new loose .md files in product repos or the shared folder; plans live on the master plan
  page. This wiki repo is the owner-approved exception (27 Oct 2026).

## Releases, not dates (owner, 27 Oct 2026)
The plan goes by releases, not dates. Release 1.2.7 is the new web app; it runs on chat2.gcaplabs.com
until the owner is satisfied, then switches to chat.gcaplabs.com. The checks that need real users and
money (invites, the real PayPal top-up) were first tied to that switch; they are now parked (see below). Owner quote (27 Oct 09:42, history): "we do this by Releases.
1.2.7 will be the release of the new webapp which will go on chat2.gcaplabs.com until Im satisfied with
it then we switch it to chat.gcaplabs.com. When that switch happens all those checks like paypal and
invites happen." No target dates; a release ships when its rows are done. Update 27 Oct 19:40: not at the switch. Update 28 Oct 21:55: Greenwood's invites (PT3 eyes-on parts, PT4), the PayPal check (PT5) and the live-action demo film are PARKED. See [[releases]]. ^[raw/transcripts/owner-notes-2026-10-28/parked-and-ios-scope-2155.md]

## Research links (owner rule)
Links the owner sends without the word "add" are research sources to read and learn from, not skills or tools to install. ^[raw/transcripts/nightly-2026-10-28/summary.md]

## Parked means parked (owner, 28 Oct 2026 21:55)
Parked is its own section on the plan page and in [[now]], not a "later" list. Nobody raises, schedules or asks about a parked item until the owner brings it up. Current parked items: Greenwood invites, the PayPal check and the live-action demo film. The iPhone app is NOT parked (owner, 5 Nov 2026 00:14 UTC; see "iPhone scope" below). ^[raw/transcripts/owner-notes-2026-10-28/parked-and-ios-scope-2155.md]

## iPhone scope (owner, 5 Nov 2026 00:14 UTC)
The iPhone app is not parked. One thread owns all iPhone work (headmaster-ios): rebasing and merging open iOS PRs, new features, catch-up with the desktop, and the wiki's iOS page. Builds are unsigned .ipa files from the owner's Mac runner (`build-ipa.yml`); there are no GitHub-hosted macOS runners and no TestFlight, App Store listing or Apple membership step unless the owner says so (D15, [[decisions]]). The same working rules apply as everywhere: no go asks, one CI run per PR, library components, no vendor names. iOS push for room approvals has its own thread. See [[ios]].
History: on 28 Oct 2026 21:55 UTC the owner limited our iOS work to building the app and handing over the .ipa, and "iPhone distribution" sat in the Parked section; the owner corrected the reading on 5 Nov 2026 ("iphone isnt parked"). ^[raw/transcripts/owner-notes-2026-10-28/parked-and-ios-scope-2155.md]

## Database quota
The Supabase quota and tier are ours to handle (owner, 27 Oct 19:27; restated 28 Oct 21:55). Never list them as an owner item or decision. ^[raw/transcripts/owner-notes-2026-10-28/parked-and-ios-scope-2155.md]

## No personal matters (owner, 29 Oct 2026 23:04)
The wiki holds work only. Never record the owner's personal matters: their own devices, accounts, security clean-ups, passwords or private life. If a source mentions one, leave it out. ^[raw/transcripts/owner-notes-2026-10-29/no-personal-matters.md]

## Links, not code blocks (owner, 31 Oct 2026)
- Pages and URLs go to the owner as clickable links, never inside code blocks. Code blocks are only for commands and values to copy, one command per block. ^[raw/transcripts/nightly-2026-10-31/summary.md]

## No migrations while there are no users (owner, 31 Oct 2026)
- "We have 0 users so migration isn't needed." Do not plan or cost migration or rollback paths for existing installs in rename, installer or layout changes. Re-check once real users exist. ^[raw/transcripts/nightly-2026-10-31/summary.md]

## Plan and wiki upkeep (owner, 27 Oct 2026 19:28)
Any thread that changes state (a merge, a deploy, an owner answer, a release) updates this wiki in the same turn. The master plan page is no longer updated (owner, 2 Nov 2026). No dates appear on either unless the owner gave them or a real technical reason sets them (a grace end, a 14-day hold, a one-week measurement), and the reason is written next to the date. Core docs/PLAN.md is retired (owner, 19:32) and is never synced.

## Product rules (standing)
- Free through beta (1 to 2 years); tiers Lite and Pro; unassigned accounts get Lite.
- Extensions and skills come only from our own catalog (owner, restated 2 Nov 2026). We never show upstream's extension or skills catalog. Every extension or skill a user sees comes from our curated list (`headmaster/contract/customer-extensions.json` and its desktop and admission copies, shown through `apps/desktop/src/components/vetted-extensions`), with our own names and descriptions and no upstream or third-party author wording. See [[plan-and-roadmap]] (1.2.18).
- No vendor or control-plane brand name where a customer looks; bot replies never say "Hermes". ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- One memory bank per user shared by Cloud and Work; Reflect on for every account (15 Oct). ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- Approvals default to manual. Settings open as a pop-up and every visible setting is wired. The Claude app is the polish bar.
- Bot Screen is off by default per user. Kanban and Artifacts exist on desktop, web and iOS.
- No hardcoded providers, models or voices (owner, 25 Oct 2026). The voice path had hardcoded Kokoro, despite the open-voice rule of 24 Oct. Desktop, web chat, iOS and the relay read the provider, model and voice from settings or the catalog; defaults live in config or the catalog only. Every voice or settings review checks this.
- Public sign-up stays open with hand approval ([[decisions]]). The Telegram manager bot comes last; push waits on owner-side keys. ^[raw/transcripts/thread-updates-2026-10-27-1141/notes.md]
- Code signing, TestFlight and the App Store are the owner's tasks, not plan items (iPhone scope above).
- Copy (27 Oct): WhatsApp leads every list or picture of chat surfaces, never Telegram. A Headmaster is an "agent"; the personas inside it are "profiles", not "bots"; the list of surfaces in customer copy is WhatsApp first. The audience is not tech-savvy. Customer copy is short, visual and non-technical; tech strengths are sold as one-line benefits. Sources: raw/transcripts/rundown-thread-2026-10-27/owner-asks.md. ^[raw/transcripts/thread-updates-2026-10-27-1141/notes.md]

## How we ship
- All work off main. Merging publishes nothing; publishing needs the owner's go naming the upload, and each publish adds a site changelog entry. ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- The owner never pastes SQL: site migrations run through the "Supabase migrations" workflow, and pressing Run is the approval ([[site-migrations]]). ^[raw/transcripts/thread-updates-2026-10-27-1259/notes.md]
- Production deploys and live DB changes need the owner's OK naming the step. Every server brief is reviewed by a fresh reviewer first, and a read-only dry run comes before any change.
- One plan item, one worker, one draft PR; every PR gets a fresh Sonnet reviewer.
- iPhone: open small headmaster-ios PRs ready for review, not as drafts, and dispatch Build IPA once; the clutter check skips drafts and the owner reads that as CI not running (5 Nov). Drafts only for big PRs that need a review pass first. ^[raw/transcripts/nightly-2026-11-05/summary.md]
- Port from upstream first; no contributions back upstream. Features work the way Core and upstream accept them (15 Oct). ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]
- One living document per concept. Fable threads do no hands-on work.
- chat2 runs on its own track; switching chat.gcaplabs.com needs the owner's go.
- Plan upkeep: PR numbers go on every tick as repo#number links under the item (owner, 22 Oct).

## Stop doing (23 Oct audit list, a finding the owner adopted as working rules)
Features for users who do not exist; ops built for hundreds from day one; merging without a check;
night-burst merging; oversized or stacked PRs (cap 400 lines, 15 files); mirroring a row into 3 or 4
repos by hand; big-bang catch-ups followed by re-scrubs; renaming inside the engine; committing
prompts or handovers into product repos; keeping two plans; reversing decisions within a week; screens
without a one-line acceptance sentence; workers ticking rows; naming versions ahead of builds; running
the server from pasted briefs; carrying generic engine fixes because of the no-upstream-PR rule.

## Decisions put to the owner
Every decision shows the options, a marked recommendation with its reason, and a free-text
field for "neither / something else" (owner 26 Oct). Once answered, never re-ask.
Index of answers: [[decisions]]. ^[raw/transcripts/project-memory-2026-10-27/decision-card-format.md]

## Models
Model pipeline (owner, 2 Nov 2026, said because usage was climbing):
- Haiku is the reader for everything, not just the wiki: reading code before a build, mapping where
  things live, gathering evidence for a diagnosis, reading CI and job logs, and checking PR status.
  Haiku hands a short brief to Sonnet or Opus instead of them reading whole files.
- Sonnet builds.
- Opus reviews, one review per item. Remaining findings are checked by the main session. No repeated
  review rounds.
- Small bugs: one Haiku evidence pass plus one diagnosis, no separate verifier.
- Mechanical steps (merges, wiki edits, status checks) run at low effort.
Fable only when asked. See [[workflow-and-models]].

## Design
Look like the current app. At least 95% of every screen is 21st.dev components found through the
21st.dev MCP, restyled (owner 27 Oct 17:22: "the only parts that are good are the ones from 21st dev");
no hand-coded UI and no old screens moved in unchanged. Admin and account pages live in the web chat
Admin Panel and Settings, never on the site ([[admin-panel]]). Studio palette (lavender
#e0e0fb base, grey dark accent), SF Pro for new UI, Hugeicons. Every visual change loads the
repo design skills and passes no-vibecoded-look. Settings look close to Codex/Claude.
Customer flows, not technical ones. Users never see Nora, Hermes, LPanel or vendor names. ^[raw/transcripts/thread-updates-2026-10-27-1740/notes.md] ^[raw/transcripts/project-memory-2026-10-27/MEMORY.md]

## Upstream first
Match how Core and upstream already work; never reinvent a feature, setting or data model.
Follow the footprint ladder; every PR names its rung. See [[upstream-and-branding]].

**Check what exists before building (owner, 5 Nov 2026 09:44 UTC).** Before building any feature, check three places: upstream, Core and upstream plugins (the plugin catalog and `optional-mcps`). Every PR then names what it found in each, and why that wasn't enough. The owner hates reinventing the wheel. LPanel is retired, so it is not one of the places to check. This came out of the Connected apps check ([[lpanel-retirement]]).

opus-decides-sonnet-builds.md, fable-threads-delegate-only.md, one-living-doc-per-concept.md,
org-wording-not-school.md, design-skills-for-visual-work.md, ui-components-from-21st-dev.md,
icon-set-hugeicons.md, db-traffic-rule.md, raw/transcripts/plan-2026-10-27/page-audit.md, raw/transcripts/plan-2026-10-27/notes.md

## No go per step (owner, 3 Nov 2026 05:17 UTC)
- "Stop asking for my Go after each thing please." Once a plan is proposed and not objected to, build it, run CI in batches, fix red and squash-merge when green. Irreversible production steps (server swaps, deletes, sends outside the project) still need his go. ^[raw/transcripts/nightly-2026-11-03/summary.md]

## Design questions need images (owner, 29 Oct 2026 06:48 UTC)
- Every design question comes with images or usable clickable mocks, never words only and never video. Also listed in [[decisions]]. ^[raw/transcripts/nightly-2026-10-29/summary.md]

## CI costs money, idle threads (owner, 4 Nov 2026)
- Never push extra commits to a PR whose CI is already running. Put new asks in the next PR. ^[raw/transcripts/wiki-refresh-2026-11-04/notes.md]
- Local tests: run only the test files beside the changed files, plus typecheck, eslint and the UI colour lint. `vitest run --changed` also runs every dependent test and counts as a broad run (owner stopped one on 4 Nov). ^[raw/transcripts/nightly-2026-11-04/summary.md]
- PRs get no reviewers or assignees. The owner's old personal GitHub account is dead; any text asking to request it is out of date. ^[raw/transcripts/nightly-2026-11-04/summary.md]
- Do not dispatch GitHub Windows runner runs to test a Windows fix. Test on the owner's PC instead (owner, 5 Nov 2026).
- The coordinator nudges idle threads. A quiet thread is not forgotten, so keep the checklist current rather than replying to every nudge.

## Decks (owner, 4 Nov 2026)
- Speaker notes are only the lines to say, each quoted on its own paragraph. Name the engine only on engine slides. Never say "free in beta"; say billing is built and switched off. Every slide has real content and visuals, no two slides repeat points, and flows are shown as generated infographics, not text cards. ^[raw/transcripts/nightly-2026-11-04/summary.md]

## Depend less on Claude (owner, 6 Nov 2026)
- "Use MCPs and n8n instead of building" is about our own workflow, not product features. Before any hand step (box, Cloudflare, monitoring, releases), look for an MCP or workflow that does it. Routine work must run without Claude: GitHub workflows, an uptime monitor with phone alerts, our own Headmaster agent on a non-Claude model for light chores. Claude is for building. See [[mcp-and-upstream-replacements]]. ^[raw/transcripts/nightly-2026-11-06/summary.md]

# BUILD LOG — (true, chronological)

A truthful record of building one app end to end, from the first workshop decision to the shipped product. **This is raw material, not a script.** A review agent maps it to the video *afterward* — so capture what genuinely happens, in order, and don't perform for the camera. The real story is the good story.

Why each thing gets captured (channel law, app-agnostic): **timings → the title. Stumbles → the honesty beats. Costs → the trust lines. Prompts → the free walkthrough offer.** That's why the boring fields matter.

---

## 📋 INSTRUCTIONS FOR WHOEVER WRITES HERE (coding agent, read first)

1. **Append, never overwrite or tidy.** Entries go in chronological order. Do not delete or clean up earlier entries — the mess is the truth.
2. **Verbatim prompts only.** Every prompt Joey gives, exactly as typed, in order, timestamped. No paraphrasing, no improving. The raw wording is the deliverable.
3. **Real numbers only.** Never estimate a time, cost, or count. If you don't have the true value yet, write `PENDING`. A true number beats a flattering one.
4. **Timestamp everything.** Real clock time (HH:MM, 24h). If you're unsure of the time, ask — don't guess.
5. **Log every real stumble and the real fix.** Don't manufacture problems for drama, and don't hide the ones that happen. Both break the truth.
6. **Record decisions as they're actually made** — with the real reason, at the moment you make them. Not the reason you'd give later.
7. **Capture, don't editorialize.** Write what happened, not how it should be framed. Framing is the review agent's job.

---

## 🧠 PHASE 0 — WORKSHOP (fill live as you decide, nothing pre-baked)

*The idea and every foundational choice gets decided and recorded here — in the moment, with the honest reasoning. Leave blank until actually decided.*

**The lived friction that started this** (what real moment in your day made you want it):
> [04:46] Joey's words, verbatim: "I cook a lot so I want a cooking related app."
> No specific moment given — the friction is the ongoing habit, not one incident.
> Recording it as stated rather than dramatizing it into a story he didn't tell.

**The app, in one line** (what it does, plainly):
> [04:39] Search a dish, get an AI-generated recipe back plus YouTube recipe videos for that dish, with a timestamped history tab and favorites.

**Name:**
> [04:46] **Recipe Now**

**Scope — what ships in v1** (the frozen list; everything else is a later video):
> [04:39] Frozen list, exactly as Joey gave it:
> 1. enter/search a dish
> 2. AI returns the recipe
> 3. the UI also returns YouTube recipe videos of the dish
> 4. history tab with timestamp
> 5. add-to-favorites button + a favorites section

**What got pushed out of v1** (and why):
> PENDING — nothing cut yet. Nothing has been proposed and rejected.

**Stack decisions + the real reason for each:**

| Decision | Choice | Why (in the moment) |
| :- | :- | :- |
| Framework | [04:39] Next.js, as a PWA | Reason not stated at decision time — Joey specified it directly. PENDING |
| Hosting / deploy | [04:39] Vercel | Reason not stated at decision time — Joey specified it directly. PENDING |
| Data / storage | [04:41] localStorage, on-device | Picked from options I laid out. No backend, no auth, no cost, works offline — which is the point of a PWA. Known tradeoff accepted: history/favorites are per-device and die if the browser is cleared. |
| Secrets / API keys | [04:41] Two keys, both server-side env vars on Vercel: `ANTHROPIC_API_KEY`, YouTube Data API key | Follows from the two choices above. Neither key ever reaches the browser — calls go through Next.js route handlers. |
| AI provider (if any) | [04:41] Claude API, claude-sonnet-5 | Picked from options I laid out. Cheap per recipe and returns structured JSON cleanly for ingredients/steps. |
| YouTube videos | [04:41] YouTube Data API v3 | Picked from options I laid out. Real titles/thumbnails/channels in our own UI, and it can't hallucinate a dead video ID the way letting the model guess links would. Free quota 10,000 units/day; search = 100 units → ~100 searches/day free. |

**Anything you deliberately chose NOT to do** (the boring-robust calls):
> [04:41] No accounts, no auth, no database. History and favorites stay on the device.
> Chosen so v1 ships without a login screen — the moment there's a server-side history,
> there has to be a "whose history is it" answer, and that's a different video.
> [04:41] No hallucinated video links. If the YouTube API is the source, every video shown is a real one.

---

## ⏱️ PHASE 1 — SESSION HEADER

| Field | Value |
| :- | :- |
| Build date | 2026-07-27 |
| Start time | 04:39 (clock started on Joey's "start the clock") |
| End time | PENDING |
| **Total honest minutes** | PENDING |
| Final deploy URL | PENDING |
| On a device? (screen-recorded?) | PENDING |

Machine at start: Node v20.18.1, npm 10.8.2, vercel CLI 57.0.0 already installed. Repo at start: empty scaffolding only (`.gitignore`, `.github/`, `.codacy/`, BUILDLOG.md), one commit `15f6aca Initial commit`.

---

## 📝 PHASE 2 — PROMPT LEDGER (verbatim, in order)

> Every prompt, exactly as typed. This sequence becomes the free walkthrough. Do not edit the wording.

| # | Time | Prompt (verbatim) | What it produced / changed |
| :- | :- | :- | :- |
| 1 | PENDING (unknown — did not capture the clock at the time; asked Joey) | `Hello Opus, let's make a new app. review @BUILDLOG.md first and reiterate your understanding` | No code. Agent read BUILDLOG.md and restated the capture rules. Nothing written to disk. |
| 2 | 04:39 | `recording is on, start the clock.`<br><br>`this will be a recipe app. PWA made with nextjs deployed to vercel.`<br><br>`simple features:`<br>`- enter/search a dish`<br>`- AI returns the recipe`<br>`- the UI also returns youtube recipe videos of the dish `<br>`- there will be a history tab with timestamp`<br>`- add a dish to favorites button, and favorite section` | Clock started at 04:39. Phase 0 partially filled (one-liner, frozen v1 scope, framework + hosting). Phase 1 header filled. Still no code. |
| 3 | 04:41 | _(not typed — answered a 3-option decision prompt from the agent)_ Chose: **Claude API — claude-sonnet-5**, **localStorage on-device**, **YouTube Data API v3** | Locked the three remaining stack decisions. Phase 0 stack table now complete. |
| 4 | 04:46 | `-recipe-now is the name`<br>`-I cook a lot so I want a cooking related app`<br>`-Let me grab the keys`<br><br>`continue building` | **First build prompt.** Name + friction line filled in. Scaffolded the whole app: 2 API routes, search UI with history/favorites tabs, localStorage layer, PWA manifest, hand-generated PNG icons. Production build passed first try. |
| _(add rows as you go)_ | | | |

Line breaks in the ledger are rendered as `<br>`; wording is untouched.

**First build prompt:** Row 4 (04:46) — `continue building`. Rows 1–3 were workshop/decisions; no code existed before row 4.

---

## 🔴 PHASE 3 — RUNNING LOG (chronological, timestamp every entry)

> What you tried, what happened, what broke, how it got fixed. Tag anything worth cutting to with `📹`.

```
[04:39] — session start. Screen recording ON (Joey confirmed). Clock started.
[04:39] — Idea decided live: recipe app. Next.js PWA on Vercel. 5 features, frozen.
[04:39] — Env checked: Node v20.18.1, npm 10.8.2, vercel CLI 57.0.0. Repo empty except scaffolding.
[04:41] — Blocked on 3 open decisions before any code: AI provider, storage for
          history/favorites, and the YouTube video source. Asked Joey rather than
          picking silently, because each one changes the cost line in Phase 5.
[04:41] — Also outstanding: the lived-friction line and the app name (Phase 0 needs both).
[04:41] — Checked env for existing keys: neither ANTHROPIC_API_KEY nor a YouTube key is set.
          No .env file in the repo. Both will need to be added. 📹
[04:42] — Ran create-next-app. Could NOT run it directly in the repo — create-next-app
          aborts on a non-empty folder, and BUILDLOG.md + .codacy/ count as conflicts.
          Scaffolded into a scratch dir and rsynced in instead, excluding .gitignore and
          README.md so the repo's existing .gitignore survived. 57s install, 362 packages.
[04:43] — Scaffold landed: Next.js 16.2.12, React 19.2.4, TypeScript, Tailwind v4,
          App Router, Turbopack. npm threw an EBADENGINE warning on Node v20.18.1 —
          next itself only needs >=20.9.0, so it's some transitive dep. Not chasing it
          yet; `next build` is the real test. Noting it in case it bites at deploy. 📹
[04:43] — create-next-app also dropped AGENTS.md, CLAUDE.md and .claude/ into the repo.
          Didn't ask for those; leaving them for now, deciding later.
[04:46] — Name decided: Recipe Now. Friction line given: "I cook a lot so I want a
          cooking related app." Joey went to grab the two API keys.
[04:46] — Started building without waiting on the keys — the whole UI can be written
          and typechecked before either key exists. 📹
[04:47] — Wrote it: lib/types.ts, lib/storage.ts (localStorage history + favorites),
          app/api/recipe/route.ts (Claude), app/api/videos/route.ts (YouTube),
          app/page.tsx (search + 3 tabs), app/manifest.ts (PWA), layout metadata.
[04:48] — Recipe route calls Claude with a JSON schema via output_config.format, so
          the recipe comes back as structured JSON instead of prose I'd have to parse.
          Set thinking: disabled + effort: low — a recipe doesn't need reasoning, and
          both cost and latency drop. Route also returns real input/output token counts
          so Phase 5 cost can be MEASURED, not guessed. 📹
[04:49] — No PNG icons anywhere and no image library installed, so a PWA couldn't be
          installed. Wrote a ~50-line PNG encoder with node's zlib and generated
          icon-192 / icon-512 from scratch. Verified with `file`: real PNGs. 📹
[04:50] — `npm run build` PASSED FIRST TRY. Compiled in 2.7s, TypeScript clean, 5 routes.
          No stumble here — recording that honestly even though a failure would have
          been the better story. Nothing has been RUN against a live key yet, so this
          only proves it compiles, not that it works.
[04:51] — Dev server up on localhost:3000. Home page 200. Manifest serving correctly.
          Hit /api/recipe with no key on purpose — got back the clean error
          "ANTHROPIC_API_KEY is not set on the server." rather than a crash. That's the
          error path working, but it is NOT proof the app works. 📹
[04:51] — BLOCKED on the two API keys. Everything that can be built without them is
          built. Nothing has ever called Claude or YouTube for real yet.
[~04:52–
 05:00] — Joey added the keys and ran it. IT WORKS. Recipe and videos both loaded on
          the first real search. Exact time of the first successful search not captured
          — logging the window, not a made-up minute. 📹 THIS IS THE MOMENT IT WORKED.
          Reported by Joey; the agent did not watch the screen. What the agent CAN
          verify independently is below — the server logged both calls.
[05:00] — Pulled the real token counts out of the dev server log. Two recipe calls:
            "chicken adobo"  in=684  out=621
            "Chicken Adobo"  in=686  out=631
          These are measured, not estimated. Cost math in Phase 5.
[05:00] — Observation, NOT fixed (Joey said log only): the two calls are the same dish
          at different capitalization. History stores the model's cleaned-up dish name,
          so re-searching from the history tab sends "Chicken Adobo" and creates a
          second history row for a dish already there. Favorites dedupe case-insensitively;
          history does not. Nobody hit this as a bug yet — recording it before it bites.
[05:00] — Total elapsed at this point: 21 minutes from clock start. App works end to end.
          Next: design pass. Plain version is what shipped first, on purpose, so the
          before/after is real.
[05:03] — Killed the agent-run dev server at Joey's request; he's testing manually from
          his own terminal. Port 3000 confirmed free. Design pass NOT started.
          Consequence worth noting: token counts now print in Joey's terminal, not
          anywhere the agent can read. Phase 5 stalls at 2 measured uses unless those
          `[recipe] ... in= out=` lines get pasted back.
[05:03–
 07:41] — GAP. ~2h38m of wall clock with no build work happening. Recording it because
          "total honest minutes" must not silently absorb it. Build time ≠ elapsed time;
          Phase 1 needs both numbers stated separately or the title is a lie.
[07:41] — design-pass/PROMPT.md added by Joey — a brief-generator process for the design
          pass. The agent's job here is to WRITE the brief, not to design the app.
[07:47–
 07:49] — Four reference images added.
[07:53] — Filing fix: references were dropped in design-pass/ but PROMPT.md specifies
          design-pass/references/. Created the folder and moved all four. Did not rename
          or edit them. Not a stumble — a location mismatch with obvious intent.
[07:54] — Opened all four references. They are one coherent set: American mid-century
          roadside/diner culture shot in hard sun. (1) Red neon-era vertical cafe sign,
          white stucco, palms, deep blue sky. (2) Low-angle chrome + lacquer-red classic
          car under palms. (3) Diner interior — red vinyl booths, mint-green wall,
          tabletop jukeboxes, chrome-edged formica. (4) Flat-lit plate of diner food
          (burger, fries, onion rings, fried eggs, ketchup) on red gingham, yellow wall.
[07:55] — Confirmed the four inferred/derived facts with Joey (feature list, state list,
          usage moment, stakes) in one pass. He said yes, no corrections.
[07:57] — Wrote design-pass/BRIEF.md. The brief, not the design — this step aims a second
          agent, it doesn't style anything. Lineage named as movements only (Googie,
          Streamline Moderne, Kodachrome-era advertising, Precisionism), never a living
          designer or a current product, because a person's name in a repo file turns a
          style question into a copying question.
[07:57] — Two things the brief locks that came out of reading the actual code, not the
          references:
            · The app has NO offline state — there's no service worker. Told the design
              agent not to design a screen the app can't reach.
            · Load-bearing constraint recorded as: ingredients and current step must be
              readable at arm's length from a propped phone, in a bright kitchen, by
              someone whose hands are busy. Everything else in the design loses to that.
[07:57] — Called out three failure modes specific to THESE references: the fifties-diner
          costume, the nostalgia/sepia filter (the references are brilliant and sunlit —
          aging them kills them), and red+yellow at equal weight, which reads as a
          fast-food chain and drifts toward someone's trade dress.
[07:57] — BEFORE screenshot still NOT captured. The brief makes it the design agent's
          first action, with chicken adobo as the fixed demo dish for every later shot.
[07:59] — DESIGN PASS STARTED. Agent now working from design-pass/BRIEF.md.
[08:00] — Needed real screenshots of 15 states, repeatedly, across two interpretations
          and three refinement passes. Installed Playwright + headless Chromium (94.7 MB)
          rather than eyeballing it — the brief requires LOOKING at each shot, which
          means the shots have to exist as files. 📹
[08:02] — Made one real /api/recipe + /api/videos call, saved both responses to
          design-pass/fixtures/, and had the harness replay them. Every shot is real
          captured content, deterministic across passes, and costs nothing to re-shoot.
          Token cost of the whole design pass: ONE recipe call. 📹
[08:05] — BEFORE captured: 15 states at 390px. Killed the Next.js dev badge first
          (next.config devIndicators:false) — it was sitting in the corner of every frame.
          Re-shot after. Committed the before set so it can't be lost.
[08:06] — Looked at the before shots. Honest state of it: black on white, stock Geist,
          default Tailwind, bulleted lists, one black button. Nothing there was a
          decision — it was a default, which is exactly why it's a fair "before".
[08:10] — Interpretation A on branch design/a — "ROADSIDE SIGN". The interface behaves
          like signage: stacked display wordmark, hard edges (zero radius), one red used
          sparingly as an event colour, big red step numerals, generous white. Archivo
          (SIL OFL). Light-only on purpose.
[08:12] — Interpretation B on branch design/b — "DINER COUNTER". The app as a physical
          object: mint wall band with a chrome trim line, chrome-edged rounded cards on
          cream, vinyl red, slab-serif menu voice, red circular step numbers, a
          serves/prep/cook stat strip. Zilla Slab + Karla (both SIL OFL).
[08:11] — Contrast fix made DURING design, not after: the "faint" grey token came out at
          3.1:1 on paper. Darkened to #767068 (4.89:1) before shipping the shots.
          Legibility outranks mood — that's the brief's precedence chain, applied.
[08:13] — Caught the harness lying: my thumbnail stub rendered as bright cyan blocks, so
          the video list looked broken in B's shots. It was the fixture, not the design.
          Removed the stub and let real YouTube thumbnails load (image CDN, no API quota),
          then re-shot BOTH interpretations so the comparison is honest. 📹
          This is why the brief says look at the images — reading the code would never
          have surfaced it.
[08:14] — STOPPED for the human pick, as the brief requires. Both shot sets consolidated
          on main: design-pass/shots/design-a and design-pass/shots/design-b.
          Reject-both is available and carries no penalty.
[08:16] — PICK: Joey chose B — Diner Counter. Merged onto main.
[08:17] — PASS 1. Defects read off the images, not the code:
            · 01-idle: bottom 55% of the screen dead; the empty-state card was a
              thin centred strip that read as an error notice — and that is the
              FIRST screen a stranger sees.
            · 13-history: mint header + tagline ate ~250px on every screen forever,
              pushing the list below 620px; timestamps rendered in loud uppercase
              WITH SECONDS ("7/27/2026, 5:00:00 AM"); "Clear history" floated
              orphaned below the card it acts on.
          Fixes: moved the search field INSIDE the mint wall so the wall earns its
          height (it's the order window now, not a banner); rebuilt the empty state
          with real weight in the menu voice; wrote a real timestamp formatter
          ("Today, 5:00 AM"); moved Clear history inside its card.
[08:19] — PASS 2. Read off pass-1 shots:
            · 06-recipe-top: the SERVES/PREP/COOK strip had curved slivers bleeding
              through all four rounded corners — a gap-px grid over a chrome
              background clipped by overflow-hidden. A real rendering bug that only
              a screenshot shows.
            · 06-recipe-top: ingredient markers were mint rounded squares with a
              border — i.e. unchecked checkboxes. They promised a tap that does
              nothing. An affordance that lies.
            · 01-idle: the red diamond sat ~24px above its text, reading as a stray dot.
          Fixes: real borders instead of the clip trick; markers became list dashes;
          diamond tied to its line.
[08:22] — PASS 3. Read off pass-2 shots:
            · 06-recipe-top: the unfavourited star was a hairline grey glyph on a
              near-white circle — it read as DISABLED, and it's one of the five
              frozen v1 features.
            · 06-recipe-top: stat strip unbalanced — a lone "4" against "10 minutes"
              and "45 minutes" twice.
            · 13-history: "CLEAR HISTORY" rendered identically to the timestamps
              beside it. The only destructive control in the app looked like metadata.
          Fixes: star got ink weight and a 2px edge; times shortened to "10 min";
          Clear history moved to the red event colour.
[08:23] — AA verified with real numbers, not vibes — wrote a contrast checker over the
          actual token values. 10 of 11 pairs passed. ONE REAL FAIL: the disabled
          Search label at 3.19:1. WCAG exempts inactive controls, so I could have
          claimed a pass. Fixed it anyway (now 4.79:1) — an unreadable label at arm's
          length in a kitchen is a defect whatever the spec says. 📹
[08:24] — Production build passes. 5 routes, TypeScript clean.
[08:25] — PWA finished properly: manifest theme/background moved to the new palette
          and both app icons regenerated in vinyl-red + cream with the same hand-rolled
          PNG encoder from this morning. The installed icon now matches the app.
[08:29] — Killed the dev server again at Joey's request; he's testing the designed
          version manually. Port 3000 free, working tree clean, everything committed
          on main. Same caveat as before: token counts now print in HIS terminal, so
          Phase 5 stays stuck at 2 measured uses until those lines come back.
```

### Design pass — fonts and rights

| Item | Value |
| :- | :- |
| Display face | **Zilla Slab** — SIL Open Font License 1.1 |
| Body face | **Karla** — SIL Open Font License 1.1 |
| Delivery | `next/font/google`, self-hosted at build time (no runtime call to Google) |
| Third-party marks in build | None. YouTube channel names shown are live API data, not authored branding. |
| Reference art in build output | None. `design-pass/references/` is not imported by any app code. |

---

## 💥 PHASE 4 — STUMBLES + FIXES (real ones only)

| Time | What broke (plain English) | The real fix | 📹? |
| :- | :- | :- | :- |
| 04:42 | Couldn't create the Next.js app in the folder — the tool refuses to run in a non-empty directory, and BUILDLOG.md + .codacy/ counted as "not empty". | Built it in a scratch folder and copied it in, skipping .gitignore and README so the existing ones survived. | 📹 |
| 04:49 | The PWA had no icons, so it couldn't be installed on a phone — and there was no image library in the project to make any. | Wrote a PNG encoder by hand (~50 lines, using Node's built-in zlib) and generated the icons from scratch. | 📹 |
| — | **No runtime failures yet.** The build passed first try and the first real search worked. Recording that plainly rather than inventing drama. | — | |

---

## 💰 PHASE 5 — COST (measured, never guessed)

*If the app costs anything to run, measure it over ~10 real uses. If it's free, say so honestly and note where the free ceiling is.*

Measured from the server log — the recipe route reports real `usage` from the Claude API on
every call. Nothing here is estimated.

**Model:** `claude-sonnet-5`. **Pricing at time of build (2026-07-27):** $2.00 / 1M input and
$10.00 / 1M output — introductory rate, runs through 2026-08-31. Standard rate after that is
$3.00 / $15.00. Both columns below, because the honest number changes in about five weeks.

| Test # | Input | Usage | Cost (intro) | Cost (standard) |
| :- | :- | :- | :- | :- |
| 1 | "chicken adobo" | 684 in / 621 out | $0.00758 | $0.01137 |
| 2 | "Chicken Adobo" (from history) | 686 in / 631 out | $0.00768 | $0.01152 |
| 3–10 | PENDING | PENDING | PENDING | PENDING |
| **Avg per use (2 uses so far)** | | | **$0.0076** | **$0.0114** |

⚠️ Only **2** real uses measured. Phase 5 asks for ~10 — the average above is preliminary and
must not be quoted as final until 8 more land.

**YouTube side:** free. 10,000 units/day quota, a search costs 100 units → **100 searches/day
free**, then it stops until the quota resets. No card, no charge, hard ceiling.

**Honest cost line (draft, PRELIMINARY — 2 uses):** "About three-quarters of a cent per recipe
right now. The YouTube half is free until 100 searches a day." — do not use on camera until the
10-use average is in.

---

## 🎨 PHASE 6 — DESIGN PASS (before / after)

| Field | Value |
| :- | :- |
| Before screenshot saved? | **YES** — `design-pass/shots/before/`, 15 states at 390px, captured 08:05 before anything was touched. |
| After screenshot saved? | **YES** — `design-pass/shots/pass-3/`, same 15 states. Also on disk: `design-a/`, `design-b/` (the two interpretations), `pass-1/`, `pass-2/`. |
| What the design pass changed (1–2 lines) | Black-on-white default Tailwind became a mid-century diner counter: a mint "wall" holding the search field behind a chrome trim line, chrome-edged cards on cream, vinyl red as the event colour, slab-serif menu voice. Same features, same behaviour — every change was styling. |

**Best thumbnail frame:** `design-pass/shots/pass-3/06-recipe-top.png` — the mint wall, the red Search pill,
"Chicken Adobo" in slab, and the SERVES / PREP / COOK strip all in one clean 390px frame.

**The honest before/after pair (same dish, same state, same viewport):**
`shots/before/06-recipe-top.png` → `shots/pass-3/06-recipe-top.png`

The plain v1 was built plain **on purpose** so this before/after is a real one, not a staged
downgrade. What "before" looks like: black-and-white, default Tailwind, system fonts, a bordered
input, one black button, three text tabs, bullet lists.

**The demo subject to keep consistent across both shots: chicken adobo** (it's what actually got
searched first — don't switch dishes between before and after).

---

## 🚀 PHASE 7 — DEPLOY + ONTO DEVICE

| Field | Value |
| :- | :- |
| Deploy started at | PENDING |
| Live at (URL) | PENDING |
| Deploy screen-recorded? 📹 | PENDING |
| Installed on the device + recorded? 📹 | PENDING |
| Timer verdict (total honest minutes, spoken) | PENDING |

---

## 🚫 PHASE 8 — SCOPE-CREEP ATTEMPTS (log, don't build)

*Every "wouldn't it be cool if…" that came up. Don't build it — record it so it becomes a future video.*

| Feature that tempted you | Notes / where it goes |
| :- | :- |
| Case-insensitive history dedupe | Real rough edge found at 05:00 (see running log) — searching the same dish from the history tab adds a duplicate row. Logged, NOT fixed. v1 scope is frozen. |
| Streaming the recipe in token by token | Considered at 04:48 and rejected — non-streaming keeps the structured-JSON parse simple. Would be a nice upgrade later. |
| Accounts / cloud sync for history + favorites | Deliberately cut in Phase 0. The moment there's a server-side history there has to be a login. That's a different video. |

---

## 📹 PHASE 9 — SCREEN-RECORD PUNCH-INS (what actually got captured)

- [ ] Entire session recorded, unedited
- [ ] Blank screen → first prompt (full screen)
- [ ] The first real error / wrong output
- [ ] Any secrets/key moment
- [ ] Design pass: before / after
- [ ] The deploy
- [ ] Onto the device
- [ ] A clean frame worth using as a thumbnail
- [ ] Timer visible or verifiable

---

## ✅ PHASE 10 — POST-BUILD TRUTH SUMMARY (for the review agent)

*Fill last. The final real values, in one place, so review can lift them straight into the video.*

- **Total honest minutes:** PENDING
- **Cost per use (or "free, ceiling at ___"):** PENDING
- **First prompt (verbatim):** PENDING
- **The first real failure + how it got fixed:** PENDING
- **The demo subject** (the real thing you used it on, kept consistent across shots): PENDING
- **What this app replaced / let you delete** (and the count, if any): PENDING
- **Final stack + the one-line why for each choice:** PENDING
- **Anything that contradicted what you expected going in** (reality wins, always note it): PENDING

> When this block is filled: ping a Cowork agent — "read the build log, let's map it to the video and polish."
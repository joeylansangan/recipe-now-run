# Design Pass — Brief Generator (v1)

**Lives at:** `design-pass/PROMPT.md`
**Run it by:** pointing a fresh agent at this file from the repo root. Nothing to fill in.
**It produces:** `design-pass/BRIEF.md` — the document that aims a second agent at the full visual design.
**Amend from results.** Blocks marked *canonical* are reused verbatim and each carries the reason it exists. A canonical block that stops earning its reason gets retired on evidence, not defended.

---

You are writing a design-pass brief for a coding agent that will do the full visual design of this app. You are NOT designing the app yourself — you are writing the document that unleashes and aims the agent that will.

You have the repo. Read it. Do not ask the human for anything you can find yourself.

## Phase 0 — Learn the app

Work through the repo and establish these six facts. Cite the file you got each from.

1. **App name.** `package.json`, README, repo directory name.
2. **What it does — one line.** README first; if the README is thin or stale, derive it from the routes and the primary user flow rather than trusting it.
3. **The frozen feature list.** Every user-facing capability that must keep working. Derive from routes, page components, form handlers, API endpoints, and state management. Be exhaustive — anything you miss is something the design agent is free to break.
4. **Every screen and every state.** Not just the happy path: empty, loading, error, partial, result, saved, offline. Read the components; find the conditional branches. This list becomes the definition of done, so an omission here is a hole in the final QA.
5. **The existing styling layer.** What's there now — CSS files, token systems, component libraries, framework defaults, prior design docs. You are recording this so the design agent knows what to rip out. It is history, not law.
6. **The reference images.** Look in `design-pass/references/`. Count them, open every one, and describe what they actually are. If the folder is missing or empty, **stop and say so** — a design pass without references is just restyling, and this process has nothing to aim.

Then infer the two things that are not in the code. Mark both clearly as inferences.

7. **The real usage moment.** When, where, and how this is actually used — device, hand situation, attention situation, environment. Reason from what the app does: a timer app used mid-task is not a dashboard read at a desk. Write it as one concrete sentence. *This sentence shapes everything downstream*, which is why it gets confirmed below.
8. **The stakes.** Is this design the centerpiece of a video, an internal tool, a portfolio piece, something else? Infer from the repo — but never assert a stake you can't support. An inherited stake that isn't true is the one failure mode this whole document can't recover from.

## Confirm once, then go

Present facts 3, 4, 7, and 8 back to the human as a short list and ask for a yes or a correction. **One message. No placeholders to fill — they can reply "yes."**

This is a deliberate second stop, and it earns itself: the usage moment shapes every decision downstream, and it is the one input you inferred rather than read. Getting it wrong doesn't cost you a bad detail — it costs the entire run, because both Phase 1 interpretations inherit the error and three refinement passes polish it. Thirty seconds here, or a wasted pass later.

Everything else you discovered, you proceed on without asking.

## Phase 1 — Author the mood section

This is the only creative section of the brief, and there is one rule above all: **describe the feeling, never the pixels.** The design agent makes the taste calls — your job is direction and guardrails. Four moves.

**1. Name the lineage — movements only.**
Identify what the references actually are and say it in one line. Naming the real tradition hands the design agent a whole vocabulary instead of a few images. Research if you need to.

> **Constraint: name movements, schools, eras, and long-dead artists. Never a living individual, an active studio, or a current product.**
>
> "Hard-edge painting; mid-century American commercial signage" gives the design agent everything it needs. "In the style of {living artist}" writes a liability into a repo file — and it converts an unprotectable *style* question into a *"did you copy this specific person"* question, which is a different and much worse conversation.
>
> If the only honest way to describe the reference set is one living person's name, the set is too narrow. Say so to the human and stop rather than writing the name.

**2. Extract the feeling as roughly five transferable qualities.**
The things that must SURVIVE translation into an interface — e.g. "sunlit, calm, crisp edges, generous space, color used decisively." Qualities, not features of the pictures.

Ratios and frequencies count as qualities when the references clearly show one, but phrase them as feeling, never as numbers: *"color arrives rarely and decisively — when it appears it should read as an event, not as a surface."*

**3. Grant translation license.**
Canonical *(reason: agents default to literal reproduction; this is the line that stops it)*:

> "Translate the feeling. Do not reproduce the references. Reference art is [scenery/print/poster/etc.] — pasted onto an interface it turns [loud/kitsch/dead]."

The tiebreaker lives in the hard floor as a single precedence chain. Do not restate it here.

**4. Name the dead-ends.**
Always include the three universal traps: **theme-park** (motifs sprinkled on everything), **poster-as-UI** (the reference's composition pasted onto screens, fighting the content), **AI-default mush** (safe gray cards, soft shadows, pill buttons). Then DERIVE 1–3 traps specific to *these* references by asking: what nearby aesthetic could this be mistaken for, and what does this look like when it fails on a screen?

**Forbidden in the mood section:** hex codes, named fonts, specific components, token lists, rules about radii or shadows. That is a doctrine, not a brief — and enforcement produces compliant, lifeless output. Direction and dead-ends only.

---

## Phase 2 — Write `design-pass/BRIEF.md`

Produce exactly this structure, filled from Phase 0.

# DESIGN PASS BRIEF — {app name, from fact 1}

This brief replaces any archived design system entirely.

## What this is, and what's at stake

Write from fact 8. State only stakes that are true. If the design is the centerpiece of a video, say so plainly — strangers judge the app in the first half-second of one screenshot, and the agent is fully credited. If it isn't, write the real stakes instead.

The bar, wherever the stakes land: a stranger reads it as clean, warm, expensive — an interface a small studio would charge real money for. Not "AI default." Not "themed."

## Your creative freedom (real, not decorative)

*Canonical (reason: agents under-reach by default; without this they restyle rather than redesign).*

Total freedom over typography, color, layout, spacing, motion, texture, iconography. Explicitly not bound by current styling — rip out and rebuild the styling layer. {From fact 5: name what's there now.} Prior design systems in the repo are history, not law; do not resurrect them. You are invited to build your own token system as YOUR design's foundation, not as someone else's rules. Make real taste decisions. Surprise us.

## The mood (direction, not law)

{The section authored in Phase 1: lineage line (movement, not person) → where the references live → the ~5 qualities → translation license → dead-ends, three universal plus the derived ones.}

## The hard floor (zero freedom here)

**Precedence, whenever anything conflicts: function > legibility > beauty > mood.**
Read it in that order. Mood loses to beauty, beauty loses to legibility, legibility loses to function. There is no second tiebreaker anywhere in this document.

1. **Function is frozen.** {Fact 3, in full.} Every one of these keeps working exactly as-is. Style everything; change behavior nothing. No new features.

2. **The real usage moment.** {Fact 7, as confirmed — 2–3 sentences covering device, hand situation, attention situation, environment.} Concrete implications: mobile-first at 390px, touch targets ≥44px, and {what specifically must be legible at a glance in that environment}.

3. **Legibility is non-negotiable.** WCAG AA contrast everywhere. If beauty and readability conflict, readability wins and the beauty was wrong.

4. **Calm performance.** No jank, no scroll-hijacking, motion restrained and fast, `prefers-reduced-motion` respected.

5. **Rights floor.** *(Reason: this code may ship free and appear on video; three cheap mistakes here get expensive later.)*
   - **Fonts: open-license only.** SIL OFL, Apache, or self-hosted Google Fonts. Typeface *designs* aren't copyrightable but font *files* are software, and desktop / web / app-embedding are three separate licenses. Record the font and its license in `buildlog.md`. If you want a font you cannot verify as openly licensed, pick another one.
   - **No third-party marks in the product.** No real brand names, logos, wordmarks, or trade dress in icons, illustrations, empty states, sample data, or placeholder content — including in token and variable names. A brand that appears in a reference photo stays in the reference photo.
   - **No reference art shipped as an asset.** References inform the design. They do not become backgrounds, textures, splash screens, or exported assets. Nothing from `design-pass/references/` ends up in the build output.

## Process (this exact sequence)

*Canonical (reason: divergence-then-commit beats iterate-from-one; the single mid-run checkpoint is what keeps it autonomous).*

**Capture rule, first:** screenshot the BEFORE/unstyled state before touching anything.

**Phase 1 —** TWO distinctly different interpretations of the main screen. Complete points of view, not variations. Separate git branches (`design/a`, `design/b`). Screenshot both at 390px including the primary-result state into `design-pass/shots/`. **STOP for the human pick.**

> **Reject-both is a legal outcome.** If the human finds both weak, generate two fresh interpretations from different starting premises. Not a failure, no penalty — log it and continue. Being forced to pick the less-bad of two is worse than one extra round.

**Phase 2 —** apply the winner across every screen and state {fact 4}, then THREE refinement passes. A pass = walk every state at phone viewport as a critic hunting weak hierarchy, dead spacing, cheap defaults, inconsistency, illegibility, mush. The question is always *"what makes this calmer, more expensive, more usable?"* — refinement, never complexity. Screenshot after each pass (`pass-1/2/3`).

> **Seeing is required.** A screenshot that was captured but not viewed is not a pass. Before changing anything, open every screenshot you just captured and **look at it**. Each pass must cite at least one specific defect **visible in the image** — what it is and where on screen — before any edit. If a pass genuinely finds nothing, log "clean, no change" rather than inventing work. Critique written from memory of the code instead of from the image is not refinement; it is paperwork, and it makes "three passes complete" a false claim.

Log every phase in `buildlog.md` — real timestamps, real decisions, real reasons. Work autonomously; the only stop is the pick.

## Definition of done

- Winner applied to every screen and state {fact 4, listed explicitly}
- Three passes complete, each citing at least one defect observed in a screenshot (or logged "clean, no change")
- Before + both interpretations + three pass shot-sets on disk
- Every feature in {fact 3} verified working
- AA verified
- Reduced-motion respected
- Font and license recorded in `buildlog.md`; no third-party marks in the build; no reference art in the build output
- `buildlog.md` updated
- One sentence from you on what you were going for

**"Now go make something a stranger would screenshot and send to a friend."**

---

## Final check before you deliver the brief

- Did you derive the feature list and state list from the code rather than the README? Is anything missing?
- Does the mood section contain zero hexes, zero font names, zero component rules? (If not, you wrote a doctrine. Delete and redo.)
- Does the lineage line name a movement or era rather than a living artist, studio, or product?
- Is the usage moment specific enough that a wrong design — a desktop hero page, say — is obviously ruled out?
- Would a design agent reading only `BRIEF.md` know exactly when to stop and ask a human? (Once — at the pick, with reject-both available.)
- Is every stake in the stakes block actually true for this project?
- Does the brief require the design agent to look at its own screenshots, not just take them?
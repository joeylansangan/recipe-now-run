# DESIGN PASS BRIEF — Recipe Now

This brief replaces any archived design system entirely.

## What this is, and what's at stake

Recipe Now is a PWA: you type a dish, it returns a full recipe and a set of real YouTube
cooking videos for it, and it remembers your searches and favorites on-device.

**This design is the centerpiece of a YouTube video.** The repo lives inside a channel
directory, and the build log schedules a before/after design pass and calls for "a clean frame
worth using as a thumbnail." Strangers will judge this entire app from a half-second of one
screenshot, and they will judge it on the strength of your work alone.

It is also a real cooking tool the person who commissioned it will actually use in his own
kitchen. Both are true at once. A design that photographs well but fails at arm's length in a
kitchen has failed; so has one that works but looks like a template.

The bar, wherever the stakes land: a stranger reads it as clean, warm, expensive — an interface
a small studio would charge real money for. Not "AI default." Not "themed."

## Your creative freedom (real, not decorative)

Total freedom over typography, color, layout, spacing, motion, texture, iconography.

You are explicitly **not** bound by the current styling. Rip it out and rebuild it. What's there
now is only scaffolding: Tailwind v4 wired through `@tailwindcss/postcss`, the stock
`app/globals.css` from `create-next-app`, the Geist and Geist Mono fonts loaded in
`app/layout.tsx`, and utility classes typed inline in `app/page.tsx`. There is no token system,
no component library, and no prior design document. Nothing there was a decision — it was a
default, chosen so this pass would have something honest to replace.

Build your own token system as YOUR design's foundation, not as someone else's rules. Make real
taste decisions. Surprise us.

## The mood (direction, not law)

**The lineage.** American roadside vernacular of the 1940s–60s: Googie and Streamline Moderne
commercial architecture, hand-painted and neon signage built to be read from a moving car, the
saturated flat color of Kodachrome-era advertising, and the hard sunlight and clean planes of
American Precisionist painting.

**Where the references live.** Four photographs in `design-pass/references/`: a red vertical
cafe sign against white stucco and deep blue sky; a low-angle shot of chrome and lacquer-red
bodywork under palms; a diner interior of red vinyl booths, mint-green wall and tabletop
jukeboxes; and a plate of plain diner food shot flat on red gingham against a yellow wall.

**The qualities that must survive translation into an interface:**

- **Hard sunlight.** High contrast, crisp edges, clean shadows. Nothing hazy, nothing soft-focus,
  nothing apologetic.
- **Color arrives as an event.** One saturated color does nearly all the work against white and
  bright neutral. When it appears it should mean something — never a decorative surface, never
  spread thin across everything.
- **Generous emptiness.** Big flat fields of nothing — sky, wall, tabletop — are what make the
  loud parts legible. The emptiness is not wasted space; it is the mechanism.
- **A signage voice.** Lettering built to be read fast, from a distance, by someone who is not
  concentrating. Scale used decisively. Confidence, not timidity.
- **Manufactured materiality.** Chrome, enamel, vinyl, formica. Hard specular edges, surfaces
  that feel durable and made. Not papery, not weightless, not gauzy.
- **Unpretentious appetite.** The food in these images is plain, generous and unfussy — shot
  straight-on with no precious styling. Warmth without preciousness.

**Translation license.** Translate the feeling. Do not reproduce the references. Reference art is
roadside photography and signage — pasted onto an interface it turns kitsch.

**Dead ends.**

Three universal traps:

- **Theme-park** — motifs sprinkled onto everything until the interface is wearing a costume.
- **Poster-as-UI** — the reference's composition pasted onto a screen, fighting the content
  instead of carrying it.
- **AI-default mush** — safe gray cards, soft drop shadows, pill buttons, purple gradients, a
  layout indistinguishable from every other generated app.

Three specific to this reference set:

- **The fifties-diner theme restaurant.** Checkerboard floors, jukebox icons, script neon on
  every heading, Route-66 signage clip art. These references are the real thing photographed in
  daylight; the costume version is the failure mode closest to hand, and it is the one that will
  read as cheap on camera.
- **The nostalgia filter.** Sepia, fading, grain, distressed paper, weathered textures. Look
  again: nothing in these references is faded. They are brilliant, sunlit and present-tense.
  Aging this design kills exactly what makes it good.
- **Ketchup-and-mustard.** Red and yellow at equal weight reads instantly as a fast-food chain —
  and drifts toward somebody's trade dress. Let one color lead; the others are accents that
  appear rarely.

## The hard floor (zero freedom here)

**Precedence, whenever anything conflicts: function > legibility > beauty > mood.**
Read it in that order. Mood loses to beauty, beauty loses to legibility, legibility loses to
function. There is no second tiebreaker anywhere in this document.

### 1. Function is frozen

Every one of these keeps working exactly as-is. Style everything; change behavior nothing. No new
features.

1. Type a dish into a text input and submit. The submit control is disabled while the input is
   empty or a request is in flight.
2. A recipe returns as structured fields: dish name, summary, servings, prep time, cook time,
   ingredients list, steps list, tips list.
3. Up to six YouTube videos per dish — thumbnail, title, channel name — each opening YouTube in
   a new tab.
4. Favorite / unfavorite the current recipe with a toggle. The full recipe is stored, not just
   the name.
5. Favorites tab: open a saved recipe (which re-fetches its videos), or remove one.
6. History tab: timestamped entries, tap an entry to re-run that search, clear the whole list.
7. Live counts shown in the History and Favorites tab labels.
8. Everything persists in `localStorage` on-device. History is capped at 100 entries.
9. Installable PWA — manifest, icons, standalone display.

You may restyle the PWA manifest's colors to match your design. Do not remove the manifest or its
icons.

### 2. The real usage moment

Standing in a kitchen mid-cook. The phone is propped against something or grabbed with one hand
that isn't clean, and it gets glanced at repeatedly from one to two feet away while both hands
are busy with something else. The room is bright, cluttered, and full of interruptions — attention
arrives in one-second slices, never in a sustained read.

Concrete implications: mobile-first at 390px, touch targets ≥44px, and **the ingredient list and
the current step must be readable at a glance from arm's length** — that is the load-bearing
requirement of this entire design. A step that requires leaning in to read has failed, however
beautiful it is.

### 3. Legibility is non-negotiable

WCAG AA contrast everywhere. If beauty and readability conflict, readability wins and the beauty
was wrong. Note the specific hazard in this palette direction: saturated red on white, and any
light color on a bright field, fail AA easily. Check them rather than assuming.

### 4. Calm performance

No jank, no scroll-hijacking, motion restrained and fast, `prefers-reduced-motion` respected.

### 5. Rights floor

*(This code may ship free and appear on video; three cheap mistakes here get expensive later.)*

- **Fonts: open-license only.** SIL OFL, Apache, or self-hosted Google Fonts. Typeface *designs*
  aren't copyrightable but font *files* are software, and desktop / web / app-embedding are three
  separate licenses. Record the font and its license in `BUILDLOG.md`. If you want a font you
  cannot verify as openly licensed, pick another one. Be especially careful here: authentic
  mid-century signage faces are frequently revivals sold under restrictive licenses.
- **No third-party marks in the product.** No real brand names, logos, wordmarks, or trade dress
  in icons, illustrations, empty states, sample data, or placeholder content — including in token
  and variable names. The cafe name and the flag in reference photo 1 stay in the reference photo.
  A red-and-yellow fast-food resemblance is trade dress; avoid it.
- **No reference art shipped as an asset.** References inform the design. They do not become
  backgrounds, textures, splash screens, or exported assets. Nothing from
  `design-pass/references/` ends up in the build output.

## Process (this exact sequence)

**Capture rule, first:** screenshot the BEFORE/unstyled state before touching anything. It has
not been captured yet, and once you start it is gone forever. Use **chicken adobo** as the demo
dish and keep that same dish in every later shot, so before and after are honestly comparable.

To run it: `npm run dev` on port 3000. Both API keys are already in `.env.local`, so real recipes
and real videos load — screenshot with real content, never with placeholder text.

**Phase 1 —** TWO distinctly different interpretations of the main screen. Complete points of
view, not variations. Separate git branches (`design/a`, `design/b`). Screenshot both at 390px
including the loaded-recipe state into `design-pass/shots/`. **STOP for the human pick.**

> **Reject-both is a legal outcome.** If the human finds both weak, generate two fresh
> interpretations from different starting premises. Not a failure, no penalty — log it and
> continue. Being forced to pick the less-bad of two is worse than one extra round.

**Phase 2 —** apply the winner across every screen and state (listed under Definition of done),
then THREE refinement passes. A pass = walk every state at phone viewport as a critic hunting
weak hierarchy, dead spacing, cheap defaults, inconsistency, illegibility, mush. The question is
always *"what makes this calmer, more expensive, more usable?"* — refinement, never complexity.
Screenshot after each pass (`pass-1/2/3`).

> **Seeing is required.** A screenshot that was captured but not viewed is not a pass. Before
> changing anything, open every screenshot you just captured and **look at it**. Each pass must
> cite at least one specific defect **visible in the image** — what it is and where on screen —
> before any edit. If a pass genuinely finds nothing, log "clean, no change" rather than
> inventing work. Critique written from memory of the code instead of from the image is not
> refinement; it is paperwork, and it makes "three passes complete" a false claim.

Log every phase in `BUILDLOG.md` — real timestamps, real decisions, real reasons. That file is an
append-only truth record with its own rules at the top; read them before writing, append rather
than tidy, and never estimate a number you can measure. Phase 6 of that file is where the
before/after belongs. Work autonomously; the only stop is the pick.

## Definition of done

- Winner applied to every screen and state:
  - **Search tab:** idle/empty · loading · error · recipe loaded · recipe with tips · recipe
    without tips · favorited toggle state · not-favorited toggle state · videos loading · videos
    error (including YouTube quota exhausted) · videos loaded
  - **History tab:** empty · populated, including the clear control
  - **Favorites tab:** empty · populated
  - **Global:** disabled input/submit state · installed standalone PWA appearance
  - **Note:** there is deliberately no offline state — no service worker exists. Do not design a
    screen for a state the app cannot enter.
- Three passes complete, each citing at least one defect observed in a screenshot (or logged
  "clean, no change")
- Before + both interpretations + three pass shot-sets on disk in `design-pass/shots/`
- Every feature in the frozen list verified still working
- AA verified
- Reduced-motion respected
- Font and license recorded in `BUILDLOG.md`; no third-party marks in the build; no reference art
  in the build output
- `BUILDLOG.md` updated
- One sentence from you on what you were going for

**"Now go make something a stranger would screenshot and send to a friend."**

---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [ ] **1. Look test: the mother peeks out from behind the door**
  Becomes usable: A running page with the big door in the center (light and dark colors). Clicking it makes the door creak open and the mother do her `look-around` check-in (lean out, eyes dart left and right, slow nod, sneak back), then the door shuts.
  Why now: The character popping out is the unique kernel, and the art style is the biggest unknown. The learner agreed in the spec to judge this look before anything else is built, so if the style is wrong we fix the style rules while it's cheap.
  PRD ref: `prd.md > Character Check-Ins`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Characters`, `spec.md > Animations`, `spec.md > File Structure`, `spec.md > Decisions and Open Issues`
  Build: Scaffold `index.html`, `css/base.css` (light + dark palette variables), `css/layout.css`, `css/door.css`, `css/characters.css`, `js/main.js`, `js/config.js`, `js/door.js`, `js/animations.js`, `js/characters/index.js`, `js/characters/mother.js` (shared rig parts: head, eye-l, eye-r, torso, arm-l, arm-r). Temporary: clicking the door plays `look-around`. Add a README with how to run it.
  Verify (mechanical): `node --check` every JS file; start `npx serve .`, load the page in the browser pane, confirm no console errors, click the door and confirm the `look-around` class is added and removed after `animationend`; screenshot in light and dark.
  Learner check: Run `npx serve .`, open the address it prints, click the door a few times, switch your computer to dark mode, and tell me whether the mother and the door feel like the style you pictured.
  Commit: `Add door and mother look-test animation`

- [ ] **2. Knock to start a session, study with a clock, and get checked on**
  Becomes usable: Knock → "Do you want to start a study session?" No slams the door with a bang; Yes lets you pick the mother, who asks timer or stopwatch (and length), how often to check on you (1/15/30/50 min, your own number, or random), and "Are you sure?" The door slides left, the huge clock runs, check-ins happen with a creak, a varied animation (never the same twice in a row) and a speech line. Break/Resume pauses everything; End (or the timer hitting 0) brings the door back.
  Why now: This turns the look test into the actual core loop, so the kernel works end to end before any rewards or panels exist.
  PRD ref: `prd.md > Starting a Session`, `prd.md > Check-In Frequency`, `prd.md > Study Screen and Clock`, `prd.md > Breaks`, `prd.md > Character Check-Ins`
  Spec ref: `spec.md > Dialogue (speech bubbles)`, `spec.md > Session and Clock`, `spec.md > Check-In Scheduler`, `spec.md > Animations`, `spec.md > Messages`, `spec.md > Sound`, `spec.md > Data Model`
  Build: `js/dialogue.js` + `css/dialogue.css`, `js/session.js`, `js/checkins.js`, `js/messages.js`, `js/sound.js` (silent if files missing), the `peek`, `stare`, mother's signature check-in and the slam/slide door moves; `DEMO_MODE` in `config.js`. Remove the slice-1 temporary click.
  Verify (mechanical): `node --check`; in the browser pane run a stopwatch session with 1-minute fixed check-ins and a `DEMO_MODE` random session, confirm check-ins fire, no animation repeats back-to-back, the clock stops during a break, a short timer ends itself, and No plays the slam; no console errors.
  Learner check: Knock, say No once, then start a 2-minute timer with 1-minute check-ins. Watch the mother check on you, press Break and Resume, and let the timer end. Tell me what felt funny and what felt off.
  Commit: `Add session setup dialogue, clock, breaks and check-ins`

- [ ] **3. Tasks, the finale, coins, and remembering your stuff**
  Becomes usable: A Tasks panel to add to-dos; the setup asks which tasks to work on; tasks show under the clock. At the end you tick off what you finished, the mother comes fully out for her backflip (dish + backflip for 3+ tasks), says a varied summary, and you earn 1 coin per minute. Coins, tasks and history are saved and come back after a reload.
  Why now: Completes the core journey (steps 6–8) and introduces saving, the first place the data model could be wrong.
  PRD ref: `prd.md > Tasks`, `prd.md > Session End and Finale`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Storage`, `spec.md > Tasks Panel`, `spec.md > Finale`, `spec.md > Panels and Theme`, `spec.md > Data Model`
  Build: `js/storage.js` (default save with 150 coins, broken save → fresh save), `js/tasks.js`, `js/finale.js`, `js/ui.js` (panel open/close, side buttons), `css/panels.css`, mother's `finale` and `finale-big`, task question in setup and at the end.
  Verify (mechanical): `node --check`; in the browser pane add tasks, run a short session finishing 0, then 3 tasks, confirm both finales and summary wording (task line skipped at 0), coins increase by whole minutes, reload and confirm tasks/coins/history persist; corrupt the save and confirm a fresh one loads.
  Learner check: Add three tasks, run a short session, finish all three, and watch the finale. Reload the page and check your tasks and coins are still there.
  Commit: `Add tasks, finale, coins and saving`

- [ ] **4. Marketplace: unlock the soldier**
  Becomes usable: The character picker shows mother, soldier and father, with locked ones greyed out. The Marketplace panel shows prices, your coins, and owned / buy / can't afford / locked. Buying the soldier (100) makes him choosable right away, with his own look, signature check-in and finales; father (200) stays a locked silhouette.
  Why now: The unlock is the "why you come back" reward, and it depends on coins from slice 3. The soldier reuses the rig, so it's mostly drawing and choosing his finale move.
  PRD ref: `prd.md > Coins and Marketplace`, `prd.md > Characters`
  Spec ref: `spec.md > Marketplace Panel`, `spec.md > Characters`, `spec.md > Animations`
  Build: `js/marketplace.js`, `js/characters/soldier.js`, `js/characters/father.js`, soldier animations and lines, locked state in the picker. Decide the soldier's signature finale with the learner.
  Verify (mechanical): `node --check`; in the browser pane confirm the father can't be picked or bought, buying the soldier deducts 100 and persists after reload, and a session with the soldier plays his check-ins and finale; no console errors.
  Learner check: Open the Marketplace, buy the soldier, start a short session with him, and tell me if his personality comes through.
  Commit: `Add marketplace and soldier character`

- [ ] **5. First-visit door intro, stats heat map, and theme toggle**
  Becomes usable: A brand-new visitor sees only the door; knocks 1–2 open it a crack, knock 3 gets "Yo, why are you knocking on my door?" and a short chat, then the side buttons appear. The Stats panel shows a 12-week heat map (labeled "includes demo data"), most-studied day and daily average, and a "Reset data" link. A sun/moon toggle switches light/dark and is remembered.
  Why now: These polish the first impression and the study-tracking side, and they need the saving and history from slice 3. They're last because they don't change the core loop, and the heat map is the first thing to simplify if needed.
  PRD ref: `prd.md > Door Intro (first visit)`, `prd.md > Stats and Heat Map`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Door and Intro`, `spec.md > Stats Panel and Heat Map`, `spec.md > Panels and Theme`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Intro in `js/door.js`, `js/stats.js`, theme toggle in `js/ui.js`, demo history in `storage.js`, README run/demo instructions and sound credits section.
  Verify (mechanical): `node --check`; in the browser pane reset data and confirm the intro plays only once, side buttons appear after it, today's real minutes show in the heat map on top of demo data, stats numbers are correct for a known save, and the theme choice survives reload.
  Learner check: Click Reset data, then go through the door intro as a first-time visitor. Open Stats and look at the heat map, and flip the theme toggle.
  Commit: `Add door intro, stats heat map and theme toggle`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 1 (the look test), before any other building
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

- Mother's skin changed from cool-shifted blue to a natural tone; spec palette now allows natural skin tones — the look test showed blue skin didn't match what the learner wanted.
- Characters drawn with curves and Carmen Sandiego–style faces (almond eyes, flicked lashes, angular brows, pointed chin) instead of angular blocks — the learner found the first version too blocky and shared a reference image.
- The door became a separate 3D layer that swings toward you (`perspective` + `rotateY`) instead of an SVG squash — the look test showed the squash didn't read as a door opening.
- `look-around` now leans in toward you, looks down at your desk and sweeps right to left with the eyes leading and the face following, instead of just darting the pupils — learner direction at the look test (an eye-pop version was tried and rejected).

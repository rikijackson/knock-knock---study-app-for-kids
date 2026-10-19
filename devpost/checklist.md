---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Look test: the mother peeks out from behind the door**
  Becomes usable: A running page with the big door in the center (light and dark colors). Clicking it makes the door creak open and the mother do her `look-around` check-in (lean out, eyes dart left and right, slow nod, sneak back), then the door shuts.
  Why now: The character popping out is the unique kernel, and the art style is the biggest unknown. The learner agreed in the spec to judge this look before anything else is built, so if the style is wrong we fix the style rules while it's cheap.
  PRD ref: `prd.md > Character Check-Ins`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Characters`, `spec.md > Animations`, `spec.md > File Structure`, `spec.md > Decisions and Open Issues`
  Build: Scaffold `index.html`, `css/base.css` (light + dark palette variables), `css/layout.css`, `css/door.css`, `css/characters.css`, `js/main.js`, `js/config.js`, `js/door.js`, `js/animations.js`, `js/characters/index.js`, `js/characters/mother.js` (shared rig parts: head, eye-l, eye-r, torso, arm-l, arm-r). Temporary: clicking the door plays `look-around`. Add a README with how to run it.
  Verify (mechanical): `node --check` every JS file; start `npx serve .`, load the page in the browser pane, confirm no console errors, click the door and confirm the `look-around` class is added and removed after `animationend`; screenshot in light and dark.
  Learner check: Run `npx serve .`, open the address it prints, click the door a few times, switch your computer to dark mode, and tell me whether the mother and the door feel like the style you pictured.
  Commit: `Add door and mother look-test animation`

- [x] **2. Knock to start a session, study with a clock, and get checked on**
  Becomes usable: Knock → "Do you want to start a study session?" No slams the door with a bang; Yes lets you pick the mother, who asks timer or stopwatch (and length), how often to check on you (1/15/30/50 min, your own number, or random), and "Are you sure?" The door slides left, the huge clock runs, check-ins happen with a creak, a varied animation (never the same twice in a row) and a speech line. Break/Resume pauses everything; End (or the timer hitting 0) brings the door back.
  Why now: This turns the look test into the actual core loop, so the kernel works end to end before any rewards or panels exist.
  PRD ref: `prd.md > Starting a Session`, `prd.md > Check-In Frequency`, `prd.md > Study Screen and Clock`, `prd.md > Breaks`, `prd.md > Character Check-Ins`
  Spec ref: `spec.md > Dialogue (speech bubbles)`, `spec.md > Session and Clock`, `spec.md > Check-In Scheduler`, `spec.md > Animations`, `spec.md > Messages`, `spec.md > Sound`, `spec.md > Data Model`
  Build: `js/dialogue.js` + `css/dialogue.css`, `js/session.js`, `js/checkins.js`, `js/messages.js`, `js/sound.js` (silent if files missing), the `peek`, `stare`, mother's signature check-in and the slam/slide door moves; `DEMO_MODE` in `config.js`. Remove the slice-1 temporary click.
  Verify (mechanical): `node --check`; in the browser pane run a stopwatch session with 1-minute fixed check-ins and a `DEMO_MODE` random session, confirm check-ins fire, no animation repeats back-to-back, the clock stops during a break, a short timer ends itself, and No plays the slam; no console errors.
  Learner check: Knock, say No once, then start a 2-minute timer with 1-minute check-ins. Watch the mother check on you, press Break and Resume, and let the timer end. Tell me what felt funny and what felt off.
  Commit: `Add session setup dialogue, clock, breaks and check-ins`

- [x] **3. Tasks, the finale, coins, and remembering your stuff**
  Becomes usable: A Tasks panel to add to-dos; the setup asks which tasks to work on; tasks show under the clock. At the end you tick off what you finished, the mother comes fully out for her backflip (dish + backflip for 3+ tasks), says a varied summary, and you earn 1 coin per minute. Coins, tasks and history are saved and come back after a reload.
  Why now: Completes the core journey (steps 6–8) and introduces saving, the first place the data model could be wrong.
  PRD ref: `prd.md > Tasks`, `prd.md > Session End and Finale`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Storage`, `spec.md > Tasks Panel`, `spec.md > Finale`, `spec.md > Panels and Theme`, `spec.md > Data Model`
  Build: `js/storage.js` (default save with 150 coins, broken save → fresh save), `js/tasks.js`, `js/finale.js`, `js/ui.js` (panel open/close, side buttons), `css/panels.css`, mother's `finale` and `finale-big`, task question in setup and at the end.
  Verify (mechanical): `node --check`; in the browser pane add tasks, run a short session finishing 0, then 3 tasks, confirm both finales and summary wording (task line skipped at 0), coins increase by whole minutes, reload and confirm tasks/coins/history persist; corrupt the save and confirm a fresh one loads.
  Learner check: Add three tasks, run a short session, finish all three, and watch the finale. Reload the page and check your tasks and coins are still there.
  Commit: `Add tasks, finale, coins and saving`

- [x] **4. Marketplace: unlock the soldier**
  Becomes usable: The character picker shows mother, soldier and father, with locked ones greyed out. The Marketplace panel shows prices, your coins, and owned / buy / can't afford / locked. Buying the soldier (100) makes him choosable right away, with his own look, signature check-in and finales; father (200) stays a locked silhouette.
  Why now: The unlock is the "why you come back" reward, and it depends on coins from slice 3. The soldier reuses the rig, so it's mostly drawing and choosing his finale move.
  PRD ref: `prd.md > Coins and Marketplace`, `prd.md > Characters`
  Spec ref: `spec.md > Marketplace Panel`, `spec.md > Characters`, `spec.md > Animations`
  Build: `js/marketplace.js`, `js/characters/soldier.js`, `js/characters/father.js`, soldier animations and lines, locked state in the picker. Decide the soldier's signature finale with the learner.
  Verify (mechanical): `node --check`; in the browser pane confirm the father can't be picked or bought, buying the soldier deducts 100 and persists after reload, and a session with the soldier plays his check-ins and finale; no console errors.
  Learner check: Open the Marketplace, buy the soldier, start a short session with him, and tell me if his personality comes through.
  Commit: `Add marketplace and soldier character`

- [x] **5. First-visit door intro, stats heat map, and theme toggle**
  Becomes usable: A brand-new visitor sees only the door; knocks 1–2 open it a crack, knock 3 gets "Yo, why are you knocking on my door?" and a short chat, then the side buttons appear. The Stats panel shows a 12-week heat map (labeled "includes demo data"), most-studied day and daily average, and a "Reset data" link. A sun/moon toggle switches light/dark and is remembered.
  Why now: These polish the first impression and the study-tracking side, and they need the saving and history from slice 3. They're last because they don't change the core loop, and the heat map is the first thing to simplify if needed.
  PRD ref: `prd.md > Door Intro (first visit)`, `prd.md > Stats and Heat Map`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Door and Intro`, `spec.md > Stats Panel and Heat Map`, `spec.md > Panels and Theme`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Intro in `js/door.js`, `js/stats.js`, theme toggle in `js/ui.js`, demo history in `storage.js`, README run/demo instructions and sound credits section.
  Verify (mechanical): `node --check`; in the browser pane reset data and confirm the intro plays only once, side buttons appear after it, today's real minutes show in the heat map on top of demo data, stats numbers are correct for a known save, and the theme choice survives reload.
  Learner check: Click Reset data, then go through the door intro as a first-time visitor. Open Stats and look at the heat map, and flip the theme toggle.
  Commit: `Add door intro, stats heat map and theme toggle`

- [x] **6. Door & Room store: color themes, backgrounds, holiday decor, nameplate**
  Becomes usable: The Store has a "Door & Room" tab. Free color themes (Ocean, Forest, Lavender, Rose, Sunset, Slate, each in light and dark) re-color the app and the door but never the characters. You can buy a room background (kitchen, barracks, bedroom: 150 each), holiday decor (Christmas wreath or Halloween: 175 each) and a nameplate with your name (300), and switch them on and off. In demo mode every second studied earns a coin, so purchases can be shown on camera.
  Why now: Added by the learner after the core plan was finished. The simple, look-only items come first because they set up owning, switching on and saving decorations, which slices 7 and 8 build on.
  PRD ref: `prd.md > Door & Room Store`
  Spec ref: `spec.md > Door & Room Store`
  Build: `js/decor.js` (catalog, palettes, applying decorations), a tab in the Store panel, background scenes behind the app, wreath and nameplate on the door panel, Halloween pumpkin, bats and cobweb around the frame, `decor` in the save, demo-mode coins.
  Verify (mechanical): `node --check`; in the browser pane switch every color theme in light and dark and confirm the door and UI change while characters don't; buy each item with enough coins, confirm "can't afford" without; switch items on and off and confirm they persist after reload; edit the nameplate text.
  Learner check: Open the Store's Door & Room tab, try every color theme, buy a background, a holiday decoration and the nameplate, type your name, and reload to check they stay.
  Commit: `Add door and room decorations with color themes`

- [x] **7. Fairy lights, sticky-note tasks, doorbell**
  Becomes usable: Fairy lights (350) around the frame light up bulb by bulb as a session goes on. Sticky-note tasks (350) put the session's tasks on the door as notes you tear off to tick. The doorbell (500) adds a bell; clicking the bell or the door rings a ding-dong instead of knocking, and whoever's inside reacts.
  Why now: The middle tier of interactive items, built on slice 6's decoration system.
  PRD ref: `prd.md > Door & Room Store`
  Spec ref: `spec.md > Door & Room Store`
  Build: lights on the frame tied to session progress, sticky notes on the door panel linked to tasks, a doorbell with a generated ding-dong replacing the knock.
  Verify (mechanical): `node --check`; in the browser pane run a demo session and confirm bulbs light in order, notes tear off and tick their tasks, and the bell rings instead of the knock from both the bell and the door.
  Learner check: Buy all three, start a session with tasks, watch the lights, tear off a note, and ring the bell.
  Commit: `Add fairy lights, sticky-note tasks and doorbell`

- [x] **8. Study plant and cat flap**
  Becomes usable: The study plant (700) grows with your streak of study days, from sprout to flowers, and slowly wilts when you miss days. The cat flap (1100) has a cat that pokes out during sessions and reacts when clicked or petted.
  Why now: The two most interactive (and most expensive) items, last so the simpler ones are finished first.
  PRD ref: `prd.md > Door & Room Store`
  Spec ref: `spec.md > Door & Room Store`
  Build: streak calculation from real study history, plant growth and wilt stages, a cat flap in the door with a cat that appears at random and reacts to clicks.
  Verify (mechanical): `node --check`; in the browser pane fake different study histories and confirm the plant's stage for streaks and missed days; run a session and confirm the cat appears and reacts.
  Learner check: Buy both, check the plant matches your streak, and play with the cat during a session.
  Commit: `Add study plant and cat flap`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1 (the look test), before any other building. Learner feedback reshaped the art: natural skin, curves not blocks, Carmen Sandiego–style face, 3D door swing, new look-around.
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Spam-clicking the door (or doorbell) mid-session queued a door opening per click; now knocks are ignored while the door is busy
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
- Menu buttons moved from a column on the left to big square buttons in the top-left corner, next to the coin balance — learner feedback in slice 3 (the Tasks button was too small). The Marketplace (slice 4) and Stats (slice 5) buttons join the same corner.
- Session tasks under the clock can be ticked off while studying, and the end-of-session question pre-ticks them — the learner asked for it during the slice 3 check. PRD and spec updated.
- Finale moved onto a layer in front of the door, and the door now opens fully (edge-on) — the learner saw an arm vanish behind the door during the flip. Arms now pivot at fixed shoulder points with shoulder caps — they were detaching on big swings.
- Finale size now depends on study time (under 40 min proud; 40 min–2 h a random dish; 2 h+ a random stunt) instead of 3+ tasks — learner product decision after trying slice 3; PRD and spec updated. Check-ins slowed by about a third (learner: too fast). A Tom & Jerry-style motion trial added behind `?motion=cartoon` so the learner can compare before deciding.
- Clicking the door mid-study now creaks it open onto darkness and slams it shut — learner request; PRD updated.
- Fixed check-ins are now scheduled from when the previous one was due, not from when it finished — the learner noticed "every 1 min" drifting by the length of each check-in. Sounds added (the learner's clips in `assets/sounds/`). Cartoon trial exaggerated and extended to all four check-ins, with a "!" take — the first version was too subtle to notice.
- Tom & Jerry-style motion trial removed — the learner compared it side by side and preferred the original smooth motion. Eyes set further apart (learner request).
- Palette rule clarified by the learner: the theme stays dark blue, but objects in the scene use natural colors (golden cookies and crust, vanilla sponge, wooden spoon) — the cool-tinted food looked "white". Spec updated.
- She gets happier the longer you study: moods at check-ins (pleased after 20 min, delighted after 1 h, with warmer lines) and at finales (pleased / delighted / over the moon) — learner idea; PRD and spec updated. The creak was replaced with the learner's Mixkit clip, trimmed to 2 s and quieter, and the door now opens over the same 2 s so they line up (closing stays 0.9 s); the knock is now followed by a creak.
- Settings button (top-right) with a sound on/off switch, and a soft click on every button — learner requests; PRD updated. Shoulder caps resized and her left shoulder re-shaded to match the sleeve (it looked like a stuck-on ball).
- "← Back" on every setup question after the first (keeps earlier answers; Back inside the number box returns to the choices) — learner request. Settings gear stays visible while studying (learner request). Happy faces toned down and the mouths moved up (the delighted grin looked creepy).
- Breaks now have her waiting outside the door, checking her watch, with nudges after 15 min (then every 5) — learner request; PRD updated.
- Break waiting loop reworked: mostly looking around and whistling (music notes), one quick watch glance per 18 s round; watch moved from her hand to her wrist cuff — learner feedback.
- New lowest finale tier: under 15 min she's unimpressed (suspicious face, head shake, no praise) — the learner didn't want her happy about a 0-minute session. Ending a session mid-break now says "Oh! Done already?" and glides her back in before the door closes — she was snapping out of sight.
- Break anger: annoyed/angry/furious stages and a door-slam that ends the session at the break limit, adjustable in Settings (default 1 hour); a small break timer above the clock — learner requests; PRD updated. Shoulders rebuilt: each arm now has its own rounded top centred on its pivot (her left arm shaded like her body), replacing the separate caps the learner kept finding odd.
- Every door close now plays the bang (softly for normal closes, full volume for slams); only the angry break-limit slam shakes the whole screen — learner request. She now glares, then storms back in before that slam (she was vanishing again; fixed at the root in stepIn).
- Finale character was invisible after the screen-shake change (the front-layer rule was overwritten); restored and committed as a fix. Pie in the face for knocking 3 times within 15 s while studying — learner request (first asked as a chappal, then changed to a pie); PRD updated.
- Soldier designed with the learner: strict drill sergeant in dark green; finales follow the same time tiers (push-up orders, badge, medal/trophy, salute/confetti cannon/confetti bomb); signature check-in became a drill whistle instead of binoculars (the rig has no elbows to hold binoculars up). His knocking punishment is a cartoon gun cracking bullet holes in the screen (learner's choice over paintball). Pie/paint/confetti code moved into a shared `effects.js`.
- Soldier tuned after the learner tried him: stays stern much longer (pleased = smirk with stern brows, delighted = small closed smile, a grin only for 2-hour stunts); a dedicated bent-elbow saluting arm replaces the straight-arm salute; solid short back-and-sides and sideburns; the pistol is drawn end-on so it aims at the viewer; bullet holes redrawn with a scorched hole, fine cracks and rising smoke.
- Soldier's hair redrawn as curved shapes following his head with tapered sideburns (the blocks read as rectangles); bullet holes made bigger with shorter cracks — learner feedback.
- Soldier's hair redone from the learner's reference image: a fringe of locks peeking out under the cap brim, curling at the temples above the ears (side hair and sideburns removed). Bullet-hole cracks thinned.
- Saluting arm now drawn in front of his head (it was hidden behind it) — learner feedback.
- Knocking once mid-study: the character now peeks out very slightly (one eye) before the slam, instead of an empty dark doorway — learner request, for both characters.
- Slice 5: the theme toggle is a sun/moon button beside the settings gear (top-right) rather than a separate corner; Stats joins Tasks and Store in the top-left. Sample heat-map data is generated once for existing saves too (`demoSeeded`).
- Intro knocks open the door wider (a new 'gap' and 'intro' opening) — learner feedback.
- Slices 6–8 added after the core plan was complete: a Door & Room store (free color themes; backgrounds 50, holiday decor 75, nameplate 100, fairy lights 250, sticky notes 250, doorbell 400, study plant 600, cat flap 1000; later raised by the learner to 150, 175, 300, 350, 350, 500, 700, 1100). The learner set the rule that the more interactive an item is, the more it costs. Demo mode earns a coin per second so purchases can be shown on camera.
- Slice 6 prices raised by the learner: every decoration +100 coins, the nameplate +200 (backgrounds 150, holiday 175, nameplate 300; later items 350/350/500/700/1100). Characters unchanged so the soldier unlock still fits the 150 starting coins.
- With a room background on, the study clock gets a frosted backing so it stays readable over busy rooms (found while testing slice 7).
- Every press of the door or bell mid-study now plays the knock (or ding-dong with the doorbell) before the peek or punishment — the learner noticed the bell was silent during the prank. Added a `?coins=N` testing helper that adds coins once.
- Halloween pumpkin redrawn as a ribbed jack-o'-lantern with a flickering glow; sticky notes made bigger and draggable around the door (a quick click still tears one off) — learner feedback; kept on the door rather than the whole screen so they don't cover the clock.
- The soldier's knocking punishment changed from a cartoon gun to a megaphone blast (giant words slam across the screen with sound waves and a shake) — the learner wanted something non-violent. Gun, bullet holes and smoke removed.
- Sticky notes also show your unfinished to-do list on the door screen (not just during a session), and tasks can be added mid-session with a box under the clock — learner requests; PRD updated.
- Fairy lights are fully lit and twinkling on the door screen, go dark when a session starts and light up bulb by bulb — the learner couldn't see them to test (unlit bulbs were nearly invisible). Door-face decorations stay visible when the door opens (a brief fade-out was tried and undone at the learner's request).
- Speech bubbles now sit above the corner buttons (they were hidden behind Settings and the theme button) — learner feedback.
- The first fairy-light bulb now lights as soon as a session starts — in a real (non-demo) session the first bulb took 5 minutes, so the learner thought the lights weren't working.
- Study plant growth rule: each study day grows it one step, each missed day shrinks it half a step and makes it droop (it never dies); today isn't "missed" until it's over. Testing helper `?streak=N&missed=N` previews a plant without touching the save.
- Cat flap: click = boop (meow), rubbing = pet (purr + hearts, stays longer); tapping the flap calls the cat out; it ducks back in whenever the door is about to open. Meow and purr are generated in the browser like the other effects.
- The cat's meow is a Pixabay recording (`assets/sounds/meow.mp3`) after a generated meow sounded wrong; the boop chirp is the same clip played faster and higher. The purr stays generated.
- Final review: knocks during a session are ignored while the door is busy, and the pie/megaphone window grew from 15 s to 30 s so three "real" knocks (each followed by a peek) still trigger it.

---
doc: spec
status: approved
---

# Study Check-In (working title) — Technical Spec

## How This Works, In Plain Language
Study Check-In is a **website made of plain files**: HTML (what's on the page), CSS (how it looks and moves) and JavaScript (what it does). There's no server and no account. You open it in a browser and everything runs right there.

- **The door and the characters are drawn in code as SVG.** SVG describes a picture as shapes: circles, curves and filled areas. Each character is built from separate parts (head, eyes, body, arms), like nodes in a Godot scene, so each part can move on its own.
- **Animations are CSS keyframes.** A keyframe animation says "at the start the head is here, halfway it's leaned forward, at the end it's back." It's very like a Godot AnimationPlayer track. JavaScript decides *which* animation plays and *when*. CSS does the moving.
- **The clock and check-ins are JavaScript timers.** Every quarter-second the code checks how much study time has passed, updates the big numbers, and asks "is a check-in due?" If yes, the door creaks and an animation plays.
- **Your stuff is saved in localStorage**, a small notepad the browser keeps for this site on your computer. Coins, unlocked characters, tasks and study history are written there after every change and read back when you return. A session in progress is *not* saved, so closing the page mid-session loses it.
- **Sounds are short audio files** (knock, creak, bang) that you pick from a free sound library.

**Why this shape:** you've built with HTML/CSS/JavaScript before, there's nothing to install for the app itself, every piece is visible (no framework "magic"), and plain files can be put online for free with GitHub Pages.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **You open the page.** `main.js` asks `storage.js` to load your saved data. If nothing's saved, it creates a fresh save with 150 coins, the mother owned, and sample heat-map history.
2. **First visit.** The save says `introSeen: false`, so `door.js` shows only the door. Each click plays the knock sound. Knocks 1–2 run the "open-a-crack" animation, and knock 3 makes a character peek out. `dialogue.js` shows the speech bubbles. When the intro ends, `introSeen` becomes `true` and is saved, and the side buttons appear.
3. **Knock to start.** `dialogue.js` asks "Do you want to start a study session?" **No:** the slam animation and bang sound play. **Yes:** a character picker appears, built from `characters/index.js`, with locked ones greyed out using your save's `owned` list.
4. **The character sets you up.** The chosen character's SVG is placed behind the door and peeks out. `dialogue.js` asks the four questions in order. The answers become a **session object** that lives only in memory, holding mode, length, frequency, chosen task IDs and start time.
5. **Studying.** `session.js` adds a CSS class that slides the door left and shows the clock. Every 250 ms it works out study time (time studied so far, not counting breaks) and updates the numbers, counting up for stopwatch and down for timer. `checkins.js` keeps a "next check-in at X minutes of study time" value.
6. **Check-in.** When study time passes that value, `checkins.js` asks `animations.js` to play a check-in. It picks one of the character's check-in animations (never the same one twice in a row), plays the creak, shows a random line from `messages.js`, then schedules the next check-in (fixed gap, or a new random gap).
7. **Break.** Pressing Break stops counting study time. Because check-ins are scheduled by *study* time, none can happen during a break. Resume carries on.
8. **End.** The timer reaches 0, or you press End. `dialogue.js` asks which tasks you finished. `tasks.js` marks them done.
9. **Finale.** `finale.js` picks the finale tier from minutes studied (under 15 min: unimpressed; 15–40 min: proud; 40 min–2 h: a random dish; 2 h+: a random stunt), moves the character in front of the fully open door, and builds a varied summary from the check-in count, minutes and tasks.
10. **Rewards and history.** Coins (1 per whole minute studied) are added. Today's minutes are added to the history. Everything is saved. The door comes back to the center.
11. **Panels.** Stats, Tasks and Marketplace open as pop-ups on the same page, reading from and writing to the same save.

## Stack
| Piece | Choice | Docs |
|---|---|---|
| Page structure | HTML | https://developer.mozilla.org/en-US/docs/Web/HTML |
| Styling + animation | CSS, custom properties (variables), `@keyframes` | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations |
| Characters and door | Inline SVG | https://developer.mozilla.org/en-US/docs/Web/SVG |
| Logic | JavaScript, split into modules (`<script type="module">`) | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules |
| Saving | `localStorage` | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage |
| Sound | `Audio` elements playing MP3 files | https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement |
| Local preview | `npx serve` (uses Node.js, already installed) | https://www.npmjs.com/package/serve |
| Hosting (at ship) | GitHub Pages | https://docs.github.com/en/pages |

- **Plain HTML/CSS/JavaScript, no framework.** This is the learner's choice: it's familiar from their portfolio, has no setup, and nothing is hidden. *Tradeoff accepted:* the code must be kept organized by hand, which is why it's split into one file per job.
- **SVG characters animated with CSS (no animation library).** This is the learner's choice ("option 1"). Every body part can move. *Tradeoff accepted:* it looks simpler and more geometric than Carmen Sandiego.
- **Real sound files.** This is the learner's choice: they sound more real than generated tones. Quiet placeholders are used until the learner has picked their clips.
- **JavaScript modules** need the page served over `http://`, not opened by double-clicking the file. That's why we use `npx serve`. *(Derived implementation detail.)*

## Where It Runs and How Someone Tries It
- **Runtime:** any modern desktop browser (Chrome or Edge recommended for recording). No API keys, accounts or server.
- **Start it locally:** in the project folder, run `npx serve .`, then open the address it prints (normally `http://localhost:3000`).
- **Recording the demo:** set `DEMO_MODE = true` in `js/config.js`, then record with your screen recorder. Demo mode makes random check-ins happen within seconds instead of minutes (see *What Was Simplified and Why*). The fixed-interval option already includes 1 minute.
- **Reset for a fresh demo:** a small "Reset data" link in the Stats panel clears the save, so the door intro plays again.
- **Required for submission:** the demo video and the public GitHub repo.
  - Public repo: https://github.com/rikijackson/knock-knock---study-app-for-kids
  - Demo video: https://youtu.be/BY6KXELj40c
- **Optional, chosen by the learner:** **GitHub Pages**, set up in `6-ship`. It serves the repo's files at `https://<username>.github.io/<repo-name>/`. It's free, needs no build step, and uses the same files as local.

## Look and Feel
Carries forward `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.

- **Palette:** the overall theme is cool, dark blue: the page, door, panels, buttons and the characters' clothes and hair, defined once as CSS variables in `base.css`, with a light set and a dark set. **Things inside the scene can use their natural colors** (learner clarification during the build): skin tones, food, a wooden spoon. No warm colors in the interface itself.
  - Light: near-white background `#f4f8fc`, ink `#14213d`, primary blue `#2f6fdd`, pale blue `#dce8fa`, teal accent `#1b8a9a`.
  - Dark: deep navy background `#0d1424`, ink `#e6edf8`, blue `#6a9df5`, slate `#1a2540`, teal `#4fc2d0`.
  - Heat-map scale: 5 steps from pale to deep blue.
- **Dark mode:** follows the computer's setting by default, plus a small sun/moon toggle in a corner that is remembered in the save.
- **Art style, a simplified nod to Carmen Sandiego:** bold silhouettes built from **smooth curves, not blocky polygons** (learner feedback at the look test). Flat fills with **hard-edged two-tone shading** (one darker shape laid over each part, no gradients). Faces follow the show: almond eyes with a heavy upper lash line that flicks out at the corner, a large grey-lilac iris with a highlight, thick tapered angular brows, a small sharp nose, a pointed chin, and hair in pointed locks with a hard shadow under the fringe. No outlines, and colors do the separating.
- **The door** is the star: large, centered, a simple panel door in blue tones, with darkness (deep navy) behind it when it opens. It **swings open toward you in 3D** on its hinge (CSS `perspective` + `rotateY`, with a visible edge thickness), not a flat squash.
- **Typography:** the system UI font for text. The clock uses big, bold, tabular (fixed-width) digits so the numbers don't jiggle. *(Derived detail.)*
- **Density:** very spacious, with little on screen at once. The side buttons are small icon + label buttons.
- **Interface copy:** playful and short. Speech bubbles are rounded with a little tail pointing at the door.

## Components

### Storage
`js/storage.js`. Loads and saves the whole save object to localStorage under one key. Creates the default save on first run, including 150 coins and the demo history.
PRD ref: `prd.md > States and Boundaries`, `prd.md > Coins and Marketplace`.

### Door and Intro
`js/door.js`, `css/door.css`. Draws the door SVG, handles clicks and knock counting, and runs the first-visit intro (crack-open ×2, peek on the 3rd knock, short chat). Also runs the slam on "No," and the slide-left / slide-back moves.
PRD ref: `prd.md > Door Intro (first visit)`, `prd.md > Starting a Session`.

### Dialogue (speech bubbles)
`js/dialogue.js`, `css/dialogue.css`. Shows a speech bubble next to the door with text and answer buttons, and returns the chosen answer. Used for the intro, the start question, the character picker, the four setup questions and the end-of-session task question.
PRD ref: `prd.md > Starting a Session`, `prd.md > Session End and Finale`.

### Characters
`js/characters/index.js` holds the list of characters, each with an `id`, name, price, whether it's free, its SVG and its animation names. One file per character draws its SVG:
- `mother.js`: free. Finales: a proud moment; a covered dish revealing blueberry pie, cake or cookies; a stunt: cartwheel, backflip or rocket.
- `soldier.js`: price 100. A strict drill sergeant in dark green (patrol cap, stripes, brass buckle). Signature check-in: a drill whistle (sound made in the browser), then he points and barks. Finales: under 15 min he orders push-ups (angry); a badge; a medal or trophy; a salute, confetti cannon or confetti bomb (confetti in `effects.js`). Knocking 3 times: he blasts an order through a megaphone (giant words slam across the screen). Held items counter-rotate so they stay upright in his hand.
- `father.js`: price 200. Only a dark locked silhouette in this version, with no animations.

**Shared rig:** mother and soldier are built on the **same skeleton** (same named parts: `head`, `eye-l`, `eye-r`, `torso`, `arm-l`, `arm-r`), so the general moves can be reused, each character gets its own signature check-in and finales, and their looks and lines differ. *(Simplification. See below.)*
PRD ref: `prd.md > Characters`, `prd.md > Character Check-Ins`.

### Animations
`js/animations.js`, `css/characters.css`. Plays a named animation on a character by adding a CSS class, waits for it to finish (`animationend`), then removes it. Remembers the last check-in played so it never repeats twice in a row.
Planned animations:
- **Shared check-ins:** `peek` (peek and retreat), `look-around` (lean, eyes dart left and right, slow nod, sneak back), `stare` (lean out and hold a stare).
- **Per character:** one signature check-in, plus finales in three tiers by study time (proud / dish / stunt).
- **Moods:** CSS classes on the character (`mood-pleased`, `mood-delighted`, `mood-ecstatic`) swap the brows, mouth, a happy lower-eyelid squint and blush. Check-ins pick the mood from study time so far (thresholds in `config.js`); finales pick it from the tier.
PRD ref: `prd.md > Character Check-Ins`, `prd.md > Session End and Finale`.

### Session and Clock
`js/session.js`, `css/layout.css`. Holds the in-memory session object. Counts study time using real timestamps, so it stays accurate even if the browser slows down background tabs. Shows the big clock (stopwatch up, timer down), the session tasks underneath (each with a tickbox that marks it done immediately), and the Break/Resume and End buttons. Ends automatically when the timer reaches 0.
PRD ref: `prd.md > Study Screen and Clock`, `prd.md > Breaks`.

### Check-In Scheduler
`js/checkins.js`. Decides when the next check-in happens, measured in study minutes. **Fixed** uses the chosen gap (options: 1, 15, 30, 50 minutes, or type your own). **Random** picks an irregular gap between 10 and 40 minutes each time, or between 15 and 60 seconds in demo mode. It triggers the creak, the animation and the speech line.
PRD ref: `prd.md > Check-In Frequency`, `prd.md > Character Check-Ins`.

### Messages
`js/messages.js`. Lists of lines per character and situation: check-in lines, finale summary templates and praise lines. Picks one at random so they vary.
PRD ref: `prd.md > Character Check-Ins`, `prd.md > Session End and Finale`.

### Finale
`js/finale.js`. After the task question, it picks a finale by minutes studied (thresholds in `config.js`, shrunk in demo mode), builds the summary text ("I checked on you 3 times, you studied 45 minutes, you finished 2 tasks," skipping the task part if 0), awards coins and records history.
PRD ref: `prd.md > Session End and Finale`.

### Tasks Panel
`js/tasks.js`. Pop-up to add tasks and view the to-do list. Also provides the "which tasks for this session?" list used by the dialogue.
PRD ref: `prd.md > Tasks`.

### Marketplace Panel
`js/marketplace.js`. Pop-up showing each character, its price and its state (owned / buy / can't afford / locked), plus your coin balance. Buying deducts coins and adds the character to `owned`.
PRD ref: `prd.md > Coins and Marketplace`.

### Door & Room Store
`js/decor.js`, `css/decor.css`. The catalog of decorations (id, name, price, kind), the color-theme palettes (each a set of CSS variable values for light and dark, applied to the page; characters use their own fixed colors so they never change), and `applyDecor()`, which shows the active decorations: classes on the door scene for door/frame items, and a full-page room layer behind the app for backgrounds. Owned and active items, the palette and the nameplate text live in the save under `decor`. Interactive items (lights, notes, doorbell, plant, cat) hook into the session and knock code. The plant lives in `js/plant.js` (its stage is worked out from your real study history every time it's shown) and the cat in `js/cat.js` (visits on a random timer during a session, only while nothing else is using the door).
PRD ref: `prd.md > Door & Room Store`.

### Stats Panel and Heat Map
`js/stats.js`, `css/panels.css`. Pop-up with a heat map of the last 12 weeks (a grid of small squares, one per day, shaded by minutes studied) and two numbers: **most-studied day** and **daily average**. A small note says "includes demo data" while sample data exists. It also holds the "Reset data" link. It's built by hand with no chart library.
PRD ref: `prd.md > Stats and Heat Map`.

### Sound
`js/sound.js`. Plays `knock`, `creak` and `bang` from `assets/sounds/`. If a file is missing or fails to load, it stays silent instead of breaking.
PRD ref: `prd.md > Look and Feel`.

### Panels and Theme
`js/ui.js`. Opens and closes the pop-up panels, shows or hides the side buttons, and handles the light/dark toggle.
PRD ref: `prd.md > Screens and Layout`.

## Data Model

**Saved in localStorage** (one key: `studyCheckIn.save`), updated after every change and read back on every visit:

```js
{
  introSeen: false,               // true after the first-visit door intro
  theme: "auto",                  // "auto" | "light" | "dark"
  coins: 150,                     // starts at 150 (PRD decision)
  owned: ["mother"],              // character ids you can pick
  tasks: [                        // your to-do list
    { id: "t1", text: "Physics worksheet", done: false }
  ],
  history: {                      // real study minutes per day
    "2026-10-09": 45
  },
  demoHistory: {                  // sample past data, labeled in the UI
    "2026-09-12": 90, "2026-09-13": 30
  }
}
```

- The heat map shows `history + demoHistory` added together. The "includes demo data" note shows while `demoHistory` has entries.
- "Reset data" deletes the key. The next load creates a fresh default save with new demo history.

**Kept only in memory during a session** (lost if the page closes, which is the confirmed PRD behavior):

```js
{
  characterId: "mother",
  mode: "timer",                  // or "stopwatch"
  lengthMin: 25,                  // timer only
  frequency: { type: "fixed", minutes: 15 },   // or { type: "random" }
  taskIds: ["t1"],
  studiedMs: 0,                   // study time so far, not counting breaks
  runningSince: 1760000000000,    // timestamp, or null while on break
  nextCheckInAtMs: 900000,
  checkInCount: 0,
  lastAnimation: null
}
```

## File Structure

```
my-hackathon-app/
├── index.html              # The single page: door, clock, side buttons, panel shells
├── css/
│   ├── base.css            # Color variables (light + dark), fonts, resets
│   ├── layout.css          # Door-center vs study-screen layout, the big clock, buttons
│   ├── door.css            # Door shapes + crack/open/slam/slide animations
│   ├── characters.css      # All character @keyframes (shared + per character)
│   ├── dialogue.css        # Speech bubbles and answer buttons
│   └── panels.css          # Stats/heat map, tasks, marketplace pop-ups
├── js/
│   ├── main.js             # Starts the app: load save, set up door, wire buttons
│   ├── config.js           # DEMO_MODE switch, prices, starting coins, timing ranges
│   ├── storage.js          # Load/save to localStorage, default save, demo history
│   ├── door.js             # Door SVG, knocking, first-visit intro, slam, slide
│   ├── dialogue.js         # Speech bubble questions → answers
│   ├── session.js          # Session object, clock, break/resume, end
│   ├── checkins.js         # When the next check-in happens (fixed/random)
│   ├── animations.js       # Play an animation, avoid repeats
│   ├── finale.js           # End-of-session finale, summary, coins, history
│   ├── messages.js         # All character lines, picked at random
│   ├── tasks.js            # To-do list panel + session task picker
│   ├── marketplace.js      # Buy/unlock characters
│   ├── stats.js            # Heat map + numbers + reset
│   ├── sound.js            # Knock/creak/bang playback
│   ├── ui.js               # Panels open/close, theme toggle
│   └── characters/
│       ├── index.js        # Character list: id, name, price, SVG, animations
│       ├── mother.js       # Mother's SVG (shared rig)
│       ├── soldier.js      # Soldier's SVG (shared rig)
│       └── father.js       # Locked silhouette only
├── assets/
│   └── sounds/             # knock.mp3, creak.mp3, bang.mp3 (picked by the learner)
├── devpost/                # Devpost learning workspace (planning docs)
├── .gitignore
└── README.md               # What it is, how to run it, credits for sound files
```

## External Services and Dependencies
- **No APIs, keys or accounts.**
- **`serve` (npm package):** local preview only, run through `npx` with nothing saved into the project. https://www.npmjs.com/package/serve
- **Sound files:** chosen by the learner from a free library such as Pixabay Sound Effects (https://pixabay.com/sound-effects/) or Freesound (https://freesound.org/). **Check each clip's license** and credit it in `README.md` if required. Freesound licenses vary per sound.
- **GitHub Pages (optional, at ship):** free static hosting from the repo. https://docs.github.com/en/pages/getting-started-with-github-pages
- *Not verified online during this conversation:* the current behavior of `serve` and the license terms on the sound sites. Check them when we use them.

## Important Failure Modes
- **The browser slows timers when the tab is in the background** → the clock uses real timestamps, so it's always correct when you look back. A due check-in plays as soon as you return to the tab.
- **Sound file missing or blocked** → silent, and the animation still plays. Browsers only allow sound after the user clicks something, and the first knock is a click, so normal use is fine.
- **Saved data missing, cleared or broken** → start a fresh default save (150 coins, mother, demo history) instead of crashing.
- **Opening `index.html` by double-clicking** → modules won't load and the page is blank. The README says to use `npx serve .`.

## What Was Simplified and Why
- **Simplified Carmen Sandiego look (flat shapes, two-tone hard shadows)** instead of fully illustrated, shaded characters. Hand-illustrated animated art would take far more than 2–4 hours. The fuller version would need an artist's drawings split into movable parts.
- **Shared rig and shared general check-ins for mother and soldier**, each with their own signature check-in and finales, instead of fully separate animation sets. This roughly halves the animation work while keeping each character distinct. The fuller version would give every character its own whole set.
- **Father as a locked silhouette only.** He's never unlocked in this version (PRD decision), so he needs no animations.
- **Demo history in the heat map**, clearly labeled. Real multi-day history can't be shown in a short video (PRD decision).
- **`DEMO_MODE` switch** shrinks random check-in gaps to seconds for recording. Real random gaps are 10–40 minutes, which can't fit in a 3-minute video. It's off by default.
- **Scripted dialogue lines picked at random** instead of anything smarter. It's enough variety to keep the surprise.
- **No accounts or server.** Everything is saved in the browser (localStorage) on one computer.

## Decisions and Open Issues

**Learner decisions**
- Plain HTML/CSS/JavaScript, no framework: familiar from their portfolio, nothing hidden. Accepts organizing the code by hand.
- Characters as SVG shapes animated with CSS ("option 1"): the most movement for the least work. Accepts a simpler, more geometric look.
- GitHub Pages so people can try it with a link ("yesss"), set up in `6-ship`.
- Real sound effects instead of generated ones. Placeholders are used until clips are chosen.
- Shared rig for mother and soldier (shared general moves, own signature check-in and finales), agreed at review.

**Derived implementation details** (follow from the above)
- JavaScript modules + `npx serve` for local preview, one file per job, timestamps for the clock, check-ins measured in study time, one localStorage key, `DEMO_MODE` in `config.js`, and a hand-built heat map.

**The learner's useful unknown: how will the AI make the animations and match an art style?**
- *Their question:* "I'm really curious about how you would reproduce an art style into this," and whether it will live up to their expectations. They are against AI art.
- *What clarified it:* this is **not** AI image generation. The characters are shapes written as code (SVG), like building a Godot scene out of nodes. The animations are CSS keyframes, like Godot AnimationPlayer tracks: "at 0% the head is here, at 50% it leans, at 100% it's back." The art style is reproduced by writing down its traits (bold silhouettes, flat fills, hard two-tone shadows, angular proportions) and applying them to every shape.
- *Agreed investigation:* the **first build step is a "look test."** Build the door plus the mother and her `look-around` check-in only, and the learner judges it against their expectations before anything else is built. If it's not right, adjust the style rules first. The learner may also sketch a character on paper and describe or photograph it so the shapes follow their design.

**Open issues**
- **Soldier's signature finale move:** decide during the build (carried from `prd.md > Open Questions`).
- **Project name:** still a working title. Needed by `6-ship`.
- **Sound clips:** the learner picks 3 clips and checks their licenses. They can be added any time during the build.

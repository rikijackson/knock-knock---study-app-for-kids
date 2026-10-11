// Starts the app and runs the main journey:
// knock → start? → pick a character → setup questions → study → end.
import { createDoor } from './door.js';
import { CHARACTERS, getCharacter } from './characters/index.js';
import { stepOut, stepIn, setMood, play } from './animations.js';
import { initDialogue, ask, askChecklist, say, hideBubble, BACK } from './dialogue.js';
import { runSession } from './session.js';
import { runCheckIn } from './checkins.js';
import { runFinale, recordSession } from './finale.js';
import { addTask, getTask, openTasks, setDone } from './tasks.js';
import { getSave, update } from './storage.js';
import { closePanels } from './ui.js';
import './marketplace.js';
import './stats.js';
import { throwPie, fireBullets } from './effects.js';
import { DOOR_LINES, LINES, pick } from './messages.js';
import { playSound } from './sound.js';
import { TIMER_LENGTHS, FIXED_INTERVALS, BREAK_UNIT_MS, ANGER_STAGES } from './config.js';

const app = document.querySelector('.app');
const sessionTasksEl = document.getElementById('session-tasks');
const stage = document.getElementById('stage');
const door = createDoor(stage);
initDialogue(stage, speakerPoint);

const wait = ms => new Promise(r => setTimeout(r, ms));

// Where the speech bubble's tail should point: beside the character's
// mouth, or into the dark doorway if nobody's there yet.
function speakerPoint() {
  const head = door.characterEl?.querySelector('.head');
  if (head) {
    const r = head.getBoundingClientRect();
    return { x: r.right - r.width * 0.12, y: r.top + r.height * 0.62 };
  }
  const back = door.scene.querySelector('.door-back');
  const pt = new DOMPoint(372, 300).matrixTransform(back.getScreenCTM());
  return { x: pt.x, y: pt.y };
}

let busy = false;
// Knocking while studying: a quick sly peek, then BANG. Knock 3 times
// within 15 seconds and they come out and punish you (pie / gun).
const PIE_KNOCKS = 3;
const PIE_WINDOW_MS = 15000;
let knockTimes = [];
let studyCharacter = null;

// The very first visit: only the door. Knocks 1–2 crack it open and shut;
// on the 3rd, the mother peeks out, and after a short chat the buttons appear.
let introKnocks = 0;
if (!getSave().introSeen) document.body.classList.add('first-visit');

async function introKnock() {
  introKnocks += 1;
  playSound('knock');
  await wait(900);
  if (introKnocks < 3) {
    playSound('creak');
    await door.open('gap');
    await wait(500);
    await door.close();
    return;
  }

  door.setCharacter(getCharacter('mother').svg());
  playSound('creak');
  await door.open('intro');
  await stepOut(door.characterEl);
  const answer = await ask(DOOR_LINES.introYo, [
    { label: DOOR_LINES.introStudy, value: 'study' },
    { label: DOOR_LINES.introWho, value: 'who' },
  ]);
  await ask(answer === 'study' ? DOOR_LINES.introAfterStudy : DOOR_LINES.introAfterWho, [
    { label: DOOR_LINES.introOk, value: true },
  ]);
  await stepIn(door.characterEl);
  await door.close();
  update(s => { s.introSeen = true; });
  document.body.classList.remove('first-visit');   // the buttons appear
}

door.onKnock(async () => {
  if (document.body.classList.contains('first-visit')) {
    if (busy) return;
    busy = true;
    try { await introKnock(); } finally { busy = false; }
    return;
  }
  if (app.classList.contains('is-studying')) {
    if (onBreak) return;
    const now = Date.now();
    knockTimes = knockTimes.filter(t => now - t < PIE_WINDOW_MS);
    knockTimes.push(now);
    if (knockTimes.length >= PIE_KNOCKS) {
      knockTimes = [];
      useDoor(() => punish(studyCharacter));
    } else if (!doorAction) {
      useDoor(slyPeek);
    }
    return;
  }
  if (busy) return;
  busy = true;
  try {
    await knock();
  } finally {
    busy = false;
  }
});

// Only one thing uses the door at a time while studying (a check-in or the
// dark peek); whatever comes next waits its turn.
let doorAction = null;
async function useDoor(action) {
  while (doorAction) await doorAction;
  doorAction = action();
  try {
    await doorAction;
  } finally {
    doorAction = null;
  }
}

// Breaks: she steps out and waits (looking around, whistling, glancing at
// her watch). The longer the break, the crosser she gets; at the limit you
// set in Settings she slams the door and ends the session. Resume sends her
// back in.
let onBreak = false;
let breakTimer = null;
let slammedShut = false;   // the session was ended by her, mid-break

function startBreak(character) {
  onBreak = true;
  const lines = LINES[character.id];
  const startedAt = Date.now();
  const limitMs = getSave().breakLimitMin * BREAK_UNIT_MS;
  const nagEveryMs = limitMs / 12;   // e.g. every 5 minutes with a 1-hour limit
  let stage = 'calm';
  let lastNagAt = 0;

  breakTimer = setInterval(() => {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= limitMs) {
      clearInterval(breakTimer);
      slamAndEnd(character);
      return;
    }
    const current = ANGER_STAGES.find(s => elapsed >= s.from * limitMs)?.mood ?? 'calm';
    if (current === 'calm') return;
    if (current !== stage || Date.now() - lastNagAt >= nagEveryMs) {
      if (current !== stage && door.characterEl) setMood(door.characterEl, current);
      stage = current;
      lastNagAt = Date.now();
      say(pick(lines.breakNag[current]));
      setTimeout(hideBubble, 4000);
    }
  }, 1000);

  return useDoor(async () => {
    const el = door.characterEl;
    playSound('creak');
    await door.open('ajar');
    await stepOut(el);
    el.classList.add('anim-wait');
    say(pick(lines.breakStart));
    await wait(2600);
    hideBubble();
  });
}

function endBreak(character, { sessionOver = false } = {}) {
  onBreak = false;
  clearInterval(breakTimer);
  return useDoor(async () => {
    const el = door.characterEl;
    el.classList.remove('anim-wait');   // back to her plain "out" pose first...
    setMood(el, 'suspicious');
    const lines = LINES[character.id];
    say(pick(sessionOver ? lines.breakOver : lines.breakEnd));
    await wait(1500);
    hideBubble();
    await stepIn(el);                   // ...then glide back in
    await door.close();
  });
}

// The break went on too long: she storms back in, SLAMS the door,
// and the session is over.
async function slamAndEnd(character) {
  onBreak = false;
  slammedShut = true;
  await useDoor(async () => {
    const el = door.characterEl;
    say(pick(LINES[character.id].breakLimit));
    await wait(2400);
    hideBubble();
    el.classList.remove('anim-wait');   // stops shaking, and glares...
    await wait(500);
    await stepIn(el);                   // ...storms back in...
    await door.slam({ angry: true });   // ...SLAM, and the whole screen shakes.
    setMood(el, 'suspicious');
  });
  document.getElementById('end-btn').click();   // ends the session
}

// Too much knocking: the mother throws a pie in your face; the soldier
// shoots at the screen (cartoon bullet holes in the glass).
async function punish(character) {
  const el = door.characterEl;
  const lines = LINES[character.id];
  el.style.visibility = '';
  setMood(el, 'furious');
  playSound('creak');
  await door.open('ajar');
  await stepOut(el);
  say(pick(lines.knockWarn));
  await wait(1100);
  hideBubble();

  const move = character.punish === 'gun' ? 'anim-shoot' : 'anim-throw';
  el.classList.add(move);
  const handPoint = () => {
    const hand = el.querySelector('.arm-r').getBoundingClientRect();
    return { x: hand.left + hand.width / 2, y: hand.top + hand.height / 2 };
  };
  if (character.punish === 'gun') {
    await wait(1530);                      // takes aim (shots from 45% of 3.4s)
    await fireBullets();
  } else {
    await wait(1350);                      // wind-up; release at 45% of 3s
    await throwPie(handPoint());
  }
  await wait(1000);

  say(pick(lines.knockAfter));
  await wait(2200);
  hideBubble();
  el.classList.remove(move);
  await stepIn(el);
  await door.slam();
  setMood(el, 'suspicious');
}

// Knocking once while studying: the door creaks open, whoever's behind it
// leans out just enough to show one eye and gives you a look... SLAM.
async function slyPeek() {
  playSound('creak');
  await door.open('crack');   // only a crack, so just their face can poke out
  if (door.characterEl) await play(door.characterEl, 'sly-peek');
  await door.slam();
}

async function knock() {
  closePanels();
  playSound('knock');
  door.setCharacter(null);   // just darkness behind the door
  await wait(1000);          // let the knock finish, then...
  playSound('creak');
  await door.open('ajar');

  const start = await ask(DOOR_LINES.start, [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ]);
  if (!start) {
    await door.slam();
    return;
  }

  const owned = getSave().owned;
  const characterId = await ask(DOOR_LINES.pick, CHARACTERS.map(c => ({
    label: c.name,
    value: c.id,
    disabled: !owned.includes(c.id),
    note: owned.includes(c.id) ? '' : 'locked',
  })));
  const character = getCharacter(characterId);

  const settings = await setUp(character);
  if (!settings) return;
  await study(character, settings);
}

// The character peeks out and asks the setup questions.
// Returns the settings, or null if you back out.
async function setUp(character) {
  const lines = LINES[character.id];
  // The door shuts, then creaks open again and she leans out.
  await door.close();
  door.setCharacter(character.svg());
  await wait(250);
  playSound('creak');
  await door.open('ajar');
  await stepOut(door.characterEl);
  say(pick(lines.hello));
  await wait(1600);

  // The questions, in order. "← Back" returns to the one before, keeping
  // your earlier answers; the timer-length question only applies to timers.
  const steps = ['mode', 'length', 'frequency', 'tasks', 'confirm'];
  const answers = { tasks: [] };   // task ids picked for this session
  const applies = step => step !== 'length' || answers.mode === 'timer';
  let i = 0;
  while (i < steps.length) {
    const step = steps[i];
    if (!applies(step)) { i += 1; continue; }
    const answer = await askStep(step, lines, answers, { back: i > 0 });
    if (answer === BACK) {
      do { i -= 1; } while (i > 0 && !applies(steps[i]));
      continue;
    }
    answers[step] = answer;
    i += 1;
  }

  const { mode, frequency } = answers;
  const taskIds = answers.tasks;
  const lengthMin = mode === 'timer' ? answers.length : null;
  const sure = answers.confirm;

  say(pick(sure ? lines.go : lines.cancel));
  await wait(1400);
  hideBubble();
  await stepIn(door.characterEl);
  await door.close();
  if (!sure) return null;

  return {
    characterId: character.id,
    mode,
    lengthMin,
    // A typed-in number comes back as just the minutes.
    frequency: typeof frequency === 'number' ? { type: 'fixed', minutes: frequency } : frequency,
    taskIds,
  };
}

// One setup question. Returns the answer, or BACK.
async function askStep(step, lines, answers, { back }) {
  if (step === 'mode') {
    return ask(lines.mode, [
      { label: 'Timer', note: 'counts down', value: 'timer' },
      { label: 'Stopwatch', note: 'counts up', value: 'stopwatch' },
    ], { back });
  }
  if (step === 'length') {
    return ask(lines.length, [
      ...TIMER_LENGTHS.map(m => ({ label: `${m} min`, value: m })),
      { label: 'Other…', input: { min: 1, max: 600 } },
    ], { back });
  }
  if (step === 'frequency') {
    return ask(lines.frequency, [
      ...FIXED_INTERVALS.map(m => ({ label: `Every ${m} min`, value: { type: 'fixed', minutes: m } })),
      { label: 'Random', note: 'surprise!', value: { type: 'random' } },
      { label: 'Other…', input: { min: 1, max: 240 } },
    ], { back });
  }
  if (step === 'tasks') {
    // Tasks you picked before going back come back ticked.
    const open = openTasks().map(t => ({ ...t, checked: answers.tasks.includes(t.id) }));
    const picked = await askChecklist(open.length ? lines.tasks : lines.noTasksYet, open, {
      allowAdd: true,
      confirmLabel: 'These ones',
      skipLabel: 'No tasks',
      back,
    });
    if (picked === BACK) return BACK;
    return [...picked.ids, ...picked.added.map(text => addTask(text).id)];
  }
  // confirm
  return ask(lines.confirm, [
    { label: "Yes, let's go", value: true },
    { label: 'Wait, no', value: false },
  ], { back });
}

async function study(character, settings) {
  studyCharacter = character;
  knockTimes = [];
  showSessionTasks(settings.taskIds);
  app.classList.add('is-studying');     // door slides left, the clock appears
  // The clock starts right away, so Break and End work from the first second.
  const session = await runSession(
    settings,
    s => useDoor(() => runCheckIn(door, character, s)),
    isOn => (isOn ? startBreak(character) : endBreak(character)),
  );
  if (onBreak) await endBreak(character, { sessionOver: true });   // ended mid-break
  while (doorAction) await doorAction;   // let a sly peek finish slamming

  app.classList.remove('is-studying');
  document.body.classList.remove('is-on-break');
  await wait(800);

  // She ended it herself (break too long): no task question, no finale.
  // The minutes you did study still count.
  if (slammedShut) {
    slammedShut = false;
    recordSession(session);
    showSessionTasks([]);
    return;
  }

  // Which tasks got done?
  let doneCount = 0;
  const tasks = session.taskIds.map(getTask).filter(Boolean);
  if (tasks.length) {
    playSound('creak');
    await door.open('ajar');
    await stepOut(door.characterEl);
    // Tasks you ticked off while studying come pre-ticked; untick to undo.
    const answer = await askChecklist(LINES[character.id].finished,
      tasks.map(t => ({ ...t, checked: t.done })), { confirmLabel: 'Done' });
    for (const task of tasks) setDone(task.id, answer.ids.includes(task.id));
    doneCount = answer.ids.length;
    await stepIn(door.characterEl);
  }

  await runFinale(door, character, session, doneCount);
  showSessionTasks([]);
}

// The session's tasks, listed under the clock. Tick one off the moment
// you finish it; it's saved as done straight away.
function showSessionTasks(ids) {
  sessionTasksEl.innerHTML = '';
  for (const task of ids.map(getTask).filter(Boolean)) {
    const li = document.createElement('li');
    li.className = task.done ? 'is-done' : '';
    li.innerHTML = '<label><input type="checkbox"><span></span></label>';
    const box = li.querySelector('input');
    box.checked = task.done;
    li.querySelector('span').textContent = task.text;
    box.addEventListener('change', () => {
      setDone(task.id, box.checked);
      li.className = box.checked ? 'is-done' : '';
    });
    sessionTasksEl.append(li);
  }
}

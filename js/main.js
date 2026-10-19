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
import { applyDecor, lightUp, isOn } from './decor.js';
import { throwPie, megaphoneBlast } from './effects.js';
import { initPlant } from './plant.js';
import { initCat, startCatVisits, stopCatVisits, hideCat } from './cat.js';
import { DOOR_LINES, LINES, pick } from './messages.js';
import { playSound } from './sound.js';
import { TIMER_LENGTHS, FIXED_INTERVALS, BREAK_UNIT_MS, ANGER_STAGES } from './config.js';

const app = document.querySelector('.app');
const sessionTasksEl = document.getElementById('session-tasks');
const stage = document.getElementById('stage');
const door = createDoor(stage);
initDialogue(stage, speakerPoint);
applyDecor();

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
// within 15 seconds and they come out and punish you (pie / megaphone).
const PIE_KNOCKS = 3;
const PIE_WINDOW_MS = 30000;   // long enough for 3 knocks with a peek after each
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
    // While the door is busy (a peek, a pie, a check-in), extra knocks are
    // ignored, so spam-clicking can't pile up a queue of door openings.
    if (onBreak || doorAction) return;
    playSound('knock');   // a knock, or a ding-dong if you have the doorbell
    const now = Date.now();
    knockTimes = knockTimes.filter(t => now - t < PIE_WINDOW_MS);
    knockTimes.push(now);
    if (knockTimes.length >= PIE_KNOCKS) {
      knockTimes = [];
      useDoor(() => punish(studyCharacter));
    } else {
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
  hideCat();   // the cat ducks back in before the door opens
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
// blasts an order at you through his megaphone.
async function punish(character) {
  const el = door.characterEl;
  const lines = LINES[character.id];
  el.style.visibility = '';
  setMood(el, 'furious');
  await wait(700);   // let the knock or ding-dong finish first
  playSound('creak');
  await door.open('ajar');
  await stepOut(el);
  say(pick(lines.knockWarn));
  await wait(1100);
  hideBubble();

  const move = character.punish === 'megaphone' ? 'anim-megaphone' : 'anim-throw';
  el.classList.add(move);
  const handPoint = () => {
    const hand = el.querySelector('.arm-r').getBoundingClientRect();
    return { x: hand.left + hand.width / 2, y: hand.top + hand.height / 2 };
  };
  if (character.punish === 'megaphone') {
    await wait(1670);                      // deep breath (the blast is at 38% of 4.4s)
    const bell = el.querySelector('.prop-megaphone-arm ellipse').getBoundingClientRect();
    await megaphoneBlast({ x: bell.left + bell.width / 2, y: bell.top + bell.height / 2 }, pick(lines.megaphone));
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
  await wait(800);   // let the knock or ding-dong finish first
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

  const start = await ask(isOn('doorbell') ? DOOR_LINES.startBell : DOOR_LINES.start, [
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
  sessionTaskIds = settings.taskIds;   // tasks added mid-session join this list
  lightUp(0);   // fairy lights go dark, then light up one by one as you study
  showSessionTasks(settings.taskIds);
  app.classList.add('is-studying');     // door slides left, the clock appears
  startCatVisits();                     // the cat (if you have one) pops out now and then
  // The clock starts right away, so Break and End work from the first second.
  const session = await runSession(
    settings,
    s => useDoor(() => runCheckIn(door, character, s)),
    isOn => (isOn ? startBreak(character) : endBreak(character)),
  );
  if (onBreak) await endBreak(character, { sessionOver: true });   // ended mid-break
  while (doorAction) await doorAction;   // let a sly peek finish slamming
  stopCatVisits();

  app.classList.remove('is-studying');
  document.body.classList.remove('is-on-break');
  lightUp(1);   // fairy lights all on again (twinkling) on the door screen
  await wait(800);

  // She ended it herself (break too long): no task question, no finale.
  // The minutes you did study still count.
  if (slammedShut) {
    slammedShut = false;
    recordSession(session);
    sessionTaskIds = null;
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
  sessionTaskIds = null;
  showSessionTasks([]);
}

// The session's tasks, listed under the clock. Tick one off the moment
// you finish it; it's saved as done straight away.
function showSessionTasks(ids) {
  refreshNotes();
  sessionTasksEl.innerHTML = '';
  for (const task of ids.map(getTask).filter(Boolean)) {
    const li = document.createElement('li');
    li.className = task.done ? 'is-done' : '';
    li.innerHTML = '<label><input type="checkbox"><span></span></label>';
    const box = li.querySelector('input');
    box.checked = task.done;
    li.querySelector('span').textContent = task.text;
    box.dataset.task = task.id;
    box.addEventListener('change', () => {
      setDone(task.id, box.checked);
      li.className = box.checked ? 'is-done' : '';
      refreshNotes();
    });
    sessionTasksEl.append(li);
  }
}

// Sticky-note tasks (bought in the Store): your unfinished tasks are notes on
// the door: the whole to-do list on the door screen, this session's tasks
// while studying. Drag one to move it around the door; a quick click tears it
// off, which ticks the task.
let sessionTaskIds = null;   // set while a session runs
const notePlaces = {};       // where you've dragged each note
const NOTE_COLORS = ['#fff4a3', '#ffd6e0', '#c9f2d4', '#cfe4ff'];

function refreshNotes() {
  const board = document.querySelector('.door-notes');
  // Notes being torn off finish falling; the rest are rebuilt.
  board.querySelectorAll('.sticky-note:not(.is-torn)').forEach(n => n.remove());
  if (!isOn('sticky-notes')) return;
  const ids = sessionTaskIds ?? openTasks().map(t => t.id);
  ids.map(getTask).filter(t => t && !t.done).slice(0, 4).forEach((task, i) => {
    const note = document.createElement('button');
    note.type = 'button';
    note.className = 'sticky-note';
    note.style.setProperty('--tilt', `${(i % 2 ? 1 : -1) * (2 + i)}deg`);
    note.style.setProperty('--note', NOTE_COLORS[i % NOTE_COLORS.length]);
    const place = notePlaces[task.id] ?? { left: i % 2 ? 49 : 3, top: 10 + i * 20 };
    note.style.left = `${place.left}%`;
    note.style.top = `${place.top}%`;
    note.textContent = task.text;
    note.title = 'Drag to move · click to tear off when done';
    makeDraggable(note, board, task, () => tearOff(note, task));
    board.append(note);
  });
}

document.addEventListener('taskschange', refreshNotes);
document.addEventListener('decorchange', refreshNotes);

// Adding a task in the middle of a session: it joins the session.
document.getElementById('session-add').addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const text = input.value.trim();
  if (!text || !sessionTaskIds) return;
  sessionTaskIds.push(addTask(text).id);
  input.value = '';
  showSessionTasks(sessionTaskIds);
});

function tearOff(note, task) {
  note.classList.add('is-torn');
  setDone(task.id, true);
  const box = sessionTasksEl.querySelector(`input[data-task="${task.id}"]`);
  if (box) { box.checked = true; box.closest('li').className = 'is-done'; }
  setTimeout(() => note.remove(), 900);
}

// Drag within the door; if the pointer barely moved, it was a click.
function makeDraggable(note, board, task, onClick) {
  note.addEventListener('click', e => e.stopPropagation());
  note.addEventListener('pointerdown', down => {
    down.stopPropagation();
    note.setPointerCapture(down.pointerId);
    const area = board.getBoundingClientRect();
    const start = { x: down.clientX, y: down.clientY, left: parseFloat(note.style.left), top: parseFloat(note.style.top) };
    let dragged = false;

    const move = e => {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!dragged && Math.hypot(dx, dy) < 6) return;
      dragged = true;
      note.classList.add('is-dragging');
      const maxLeft = 100 - (note.offsetWidth / board.offsetWidth) * 100;
      const maxTop = 100 - (note.offsetHeight / board.offsetHeight) * 100;
      const left = Math.min(Math.max(start.left + (dx / area.width) * 100, 0), maxLeft);
      const top = Math.min(Math.max(start.top + (dy / area.height) * 100, 0), maxTop);
      note.style.left = `${left}%`;
      note.style.top = `${top}%`;
      notePlaces[task.id] = { left, top };
    };
    const up = () => {
      note.removeEventListener('pointermove', move);
      note.classList.remove('is-dragging');
      if (!dragged) onClick();
    };
    note.addEventListener('pointermove', move);
    note.addEventListener('pointerup', up, { once: true });
  });
}

// The doorbell rings just like knocking on the door.
const bell = document.querySelector('.doorbell');
bell.addEventListener('click', e => {
  e.stopPropagation();
  door.scene.click();
});
bell.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.stopPropagation();
    door.scene.click();
  }
});

refreshNotes();   // your to-do list on the door as soon as the page opens
lightUp(1);       // fairy lights twinkle on the door screen
initPlant();      // the study plant shows how your streak is doing
// The cat only comes out when nothing else is using the door.
const studying = () => app.classList.contains('is-studying');
initCat(door, { canAppear: () => !doorAction && !door.isOpen() && (studying() || !busy) });

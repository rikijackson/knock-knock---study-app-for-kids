// Starts the app and runs the main journey:
// knock → start? → pick a character → setup questions → study → end.
import { createDoor } from './door.js';
import { CHARACTERS, getCharacter } from './characters/index.js';
import { stepOut, stepIn } from './animations.js';
import { initDialogue, ask, askChecklist, say, hideBubble } from './dialogue.js';
import { runSession } from './session.js';
import { runCheckIn } from './checkins.js';
import { runFinale } from './finale.js';
import { addTask, getTask, openTasks, setDone } from './tasks.js';
import { getSave } from './storage.js';
import { closePanels } from './ui.js';
import { DOOR_LINES, LINES, pick } from './messages.js';
import { playSound } from './sound.js';
import { TIMER_LENGTHS, FIXED_INTERVALS } from './config.js';

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
door.onKnock(async () => {
  if (busy) return;
  busy = true;
  try {
    await knock();
  } finally {
    busy = false;
  }
});

async function knock() {
  closePanels();
  playSound('knock');
  door.setCharacter(null);   // just darkness behind the door
  await door.open('ajar');

  const start = await ask(DOOR_LINES.start, [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ]);
  if (!start) {
    playSound('bang');
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

  const mode = await ask(lines.mode, [
    { label: 'Timer', note: 'counts down', value: 'timer' },
    { label: 'Stopwatch', note: 'counts up', value: 'stopwatch' },
  ]);

  let lengthMin = null;
  if (mode === 'timer') {
    lengthMin = await ask(lines.length, [
      ...TIMER_LENGTHS.map(m => ({ label: `${m} min`, value: m })),
      { label: 'Other…', input: { min: 1, max: 600 } },
    ]);
  }

  const frequency = await ask(lines.frequency, [
    ...FIXED_INTERVALS.map(m => ({ label: `Every ${m} min`, value: { type: 'fixed', minutes: m } })),
    { label: 'Random', note: 'surprise!', value: { type: 'random' } },
    { label: 'Other…', input: { min: 1, max: 240 } },
  ]);

  const open = openTasks();
  const picked = await askChecklist(open.length ? lines.tasks : lines.noTasksYet, open, {
    allowAdd: true,
    confirmLabel: 'These ones',
    skipLabel: 'No tasks',
  });
  const taskIds = [...picked.ids, ...picked.added.map(text => addTask(text).id)];

  const sure = await ask(lines.confirm, [
    { label: 'Yes, let\'s go', value: true },
    { label: 'Wait, no', value: false },
  ]);

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

async function study(character, settings) {
  showSessionTasks(settings.taskIds);
  app.classList.add('is-studying');     // door slides left, the clock appears
  // The clock starts right away, so Break and End work from the first second.
  const session = await runSession(settings, s => runCheckIn(door, character, s));

  app.classList.remove('is-studying');
  document.body.classList.remove('is-on-break');
  await wait(800);

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

// Starts the app and runs the main journey:
// knock → start? → pick a character → setup questions → study → end.
import { createDoor } from './door.js';
import { CHARACTERS, getCharacter } from './characters/index.js';
import { stepOut, stepIn } from './animations.js';
import { initDialogue, ask, say, hideBubble } from './dialogue.js';
import { runSession, minutesStudied } from './session.js';
import { runCheckIn } from './checkins.js';
import { DOOR_LINES, LINES, pick, fill, plural } from './messages.js';
import { playSound } from './sound.js';
import { TIMER_LENGTHS, FIXED_INTERVALS } from './config.js';

const app = document.querySelector('.app');
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

// Characters you own. (Buying more comes with the marketplace.)
const owned = ['mother'];

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
  };
}

async function study(character, settings) {
  app.classList.add('is-studying');     // door slides left, the clock appears
  await wait(800);

  const session = await runSession(settings, s => runCheckIn(door, character, s));

  // Wrap up. (Tasks, the finale and coins come in the next step.)
  app.classList.remove('is-studying');
  document.body.classList.remove('is-on-break');
  await wait(800);
  playSound('creak');
  await door.open('ajar');
  await stepOut(door.characterEl);
  const minutes = minutesStudied(session);
  await ask(fill(pick(LINES[character.id].done), {
    minutes: plural(minutes, 'minute'),
    checkIns: plural(session.checkInCount, 'time'),
  }), [{ label: 'Thanks!', value: true }]);
  await stepIn(door.characterEl);
  await door.close();
}

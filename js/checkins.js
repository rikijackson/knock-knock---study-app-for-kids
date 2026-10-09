// Decides when check-ins happen (measured in study time, so breaks never
// count) and plays one: creak, door opens, animation + a speech line.
import { RANDOM_GAP_MIN, RANDOM_GAP_MAX } from './config.js';
import { play, pickCheckIn } from './animations.js';
import { say, hideBubble } from './dialogue.js';
import { LINES, pick } from './messages.js';
import { playSound } from './sound.js';

const MINUTE = 60 * 1000;

// How long until the next check-in, in milliseconds of study time.
export function nextGapMs(frequency) {
  if (frequency.type === 'fixed') return frequency.minutes * MINUTE;
  const minutes = RANDOM_GAP_MIN + Math.random() * (RANDOM_GAP_MAX - RANDOM_GAP_MIN);
  return Math.round(minutes * MINUTE);
}

// When she speaks during each move, as fractions of its length:
// after the checking part, and gone again before she ducks back in.
const SPEAK = {
  'look-around': [0.64, 0.86],
  peek: [0.54, 0.8],
  stare: [0.44, 0.84],
  'mother-spoon': [0.38, 0.84],
};

export async function runCheckIn(door, character, session) {
  const animation = pickCheckIn(character.checkIns, session.lastAnimation);
  session.lastAnimation = animation;

  playSound('creak');
  await door.open('ajar');

  const moving = play(door.characterEl, animation);
  const seconds = parseFloat(getComputedStyle(door.characterEl).animationDuration) || 5;
  const [speakAt, quietAt] = SPEAK[animation] ?? [0.5, 0.85];
  const line = pick(LINES[character.id].checkIn[animation]);
  const talk = setTimeout(() => say(line), seconds * speakAt * 1000);
  const quiet = setTimeout(hideBubble, seconds * quietAt * 1000);

  await moving;
  clearTimeout(talk);
  clearTimeout(quiet);
  hideBubble();
  await door.close();
}

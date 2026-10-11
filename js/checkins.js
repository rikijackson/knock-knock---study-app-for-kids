// Decides when check-ins happen (measured in study time, so breaks never
// count) and plays one: creak, door opens, animation + a speech line.
import { RANDOM_GAP_MIN, RANDOM_GAP_MAX, MOOD_PLEASED_MIN, MOOD_DELIGHTED_MIN } from './config.js';
import { play, pickCheckIn, setMood } from './animations.js';
import { studiedNowMs } from './session.js';
import { say, hideBubble } from './dialogue.js';
import { LINES, pick } from './messages.js';
import { playSound, playWhistle } from './sound.js';

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
  'look-around': [0.6, 0.9],
  peek: [0.48, 0.86],
  stare: [0.42, 0.88],
  'mother-spoon': [0.36, 0.88],
  'soldier-whistle': [0.6, 0.88],
};

// Sounds partway through a move (fraction of its length).
const SOUNDS = {
  'soldier-whistle': { at: 0.38, play: playWhistle },
};

// The longer you've studied, the happier she is to see you.
function moodFor(session) {
  const minutes = studiedNowMs(session) / MINUTE;
  if (minutes >= MOOD_DELIGHTED_MIN) return 'delighted';
  if (minutes >= MOOD_PLEASED_MIN) return 'pleased';
  return 'suspicious';
}

export async function runCheckIn(door, character, session) {
  const animation = pickCheckIn(character.checkIns, session.lastAnimation);
  session.lastAnimation = animation;
  const mood = moodFor(session);
  setMood(door.characterEl, mood);

  playSound('creak');
  await door.open('ajar');

  const moving = play(door.characterEl, animation);
  const seconds = parseFloat(getComputedStyle(door.characterEl).animationDuration) || 5;
  const [speakAt, quietAt] = SPEAK[animation] ?? [0.5, 0.85];
  const lines = LINES[character.id];
  const line = pick(mood === 'suspicious' ? lines.checkIn[animation] : lines.checkInWarm[mood]);
  const talk = setTimeout(() => say(line), seconds * speakAt * 1000);
  const sound = SOUNDS[animation];
  const effect = sound && setTimeout(sound.play, seconds * sound.at * 1000);
  const quiet = setTimeout(hideBubble, seconds * quietAt * 1000);

  await moving;
  clearTimeout(talk);
  clearTimeout(quiet);
  clearTimeout(effect);
  hideBubble();
  await door.close();
}

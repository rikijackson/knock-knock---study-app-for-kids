// Plays the door sounds. If a sound has no file yet, or the file
// can't load, it stays silent instead of breaking anything.
import { SOUND_FILES } from './config.js';

const clips = {};

export function playSound(name) {
  const file = SOUND_FILES[name];
  if (!file) return;
  try {
    clips[name] ??= new Audio(`assets/sounds/${file}`);
    const clip = clips[name];
    clip.currentTime = 0;
    clip.play().catch(() => {});
  } catch {
    // Silent on purpose: sound is a nice extra, never a blocker.
  }
}

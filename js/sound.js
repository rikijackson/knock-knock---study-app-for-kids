// Plays the sounds. Door sounds are files; button clicks are a tiny "tick"
// made right here in the browser (no file needed). Everything stays silent
// when sound is switched off in Settings, or if a file can't load.
import { SOUND_FILES } from './config.js';
import { getSave } from './storage.js';

const clips = {};

const soundOn = () => getSave().soundOn !== false;

// volume: 0 to 1 (1 = the clip as recorded).
export function playSound(name, { volume = 1 } = {}) {
  const file = SOUND_FILES[name];
  if (!file || !soundOn()) return;
  try {
    clips[name] ??= new Audio(`assets/sounds/${file}`);
    const clip = clips[name];
    clip.volume = volume;
    clip.currentTime = 0;
    clip.play().catch(() => {});
  } catch {
    // Silent on purpose: sound is a nice extra, never a blocker.
  }
}

// A soft click for buttons: a short blip that drops in pitch.
let audio;
export function playClick() {
  if (!soundOn()) return;
  try {
    audio ??= new AudioContext();
    const now = audio.currentTime;
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(1100, now);
    tone.frequency.exponentialRampToValueAtTime(600, now + 0.06);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.08, now + 0.005);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    tone.connect(volume).connect(audio.destination);
    tone.start(now);
    tone.stop(now + 0.09);
  } catch {
    // No Web Audio: no click. That's fine.
  }
}

// Every button on the page clicks.
document.addEventListener('click', e => {
  if (e.target.closest('button')) playClick();
}, true);

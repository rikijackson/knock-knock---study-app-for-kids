// Plays the sounds. Door sounds are files; button clicks are a tiny "tick"
// made right here in the browser (no file needed). Everything stays silent
// when sound is switched off in Settings, or if a file can't load.
import { SOUND_FILES } from './config.js';
import { getSave } from './storage.js';

const bellOn = () => Boolean(getSave().decor?.active?.doorbell);

const clips = {};

const soundOn = () => getSave().soundOn !== false;

// volume: 0 to 1 (1 = the clip as recorded).
export function playSound(name, { volume = 1 } = {}) {
  if (name === 'knock' && bellOn()) return playDingDong();   // the doorbell replaces the knock
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

// The doorbell: ding... dong. Two bell tones, each with a soft overtone.
export function playDingDong() {
  if (!soundOn()) return;
  try {
    audio ??= new AudioContext();
    const now = audio.currentTime;
    [[659, 0], [523, 0.42]].forEach(([freq, at]) => {
      for (const [mult, level] of [[1, 0.12], [2.76, 0.03]]) {
        const tone = audio.createOscillator();
        const volume = audio.createGain();
        tone.type = 'sine';
        tone.frequency.value = freq * mult;
        volume.gain.setValueAtTime(0.0001, now + at);
        volume.gain.exponentialRampToValueAtTime(level, now + at + 0.01);
        volume.gain.exponentialRampToValueAtTime(0.0001, now + at + 1.3);
        tone.connect(volume).connect(audio.destination);
        tone.start(now + at);
        tone.stop(now + at + 1.35);
      }
    });
  } catch {
    // No Web Audio: no bell.
  }
}

// A megaphone shout: a harsh, buzzy blast that swells and drops.
export function playMegaphone() {
  if (!soundOn()) return;
  try {
    audio ??= new AudioContext();
    const now = audio.currentTime;
    const tone = audio.createOscillator();
    const grit = audio.createOscillator();
    const filter = audio.createBiquadFilter();
    const volume = audio.createGain();
    tone.type = 'sawtooth';
    grit.type = 'square';
    tone.frequency.setValueAtTime(190, now);
    tone.frequency.linearRampToValueAtTime(240, now + 0.15);
    tone.frequency.linearRampToValueAtTime(170, now + 0.42);
    grit.frequency.setValueAtTime(95, now);
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 0.9;
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    volume.gain.setValueAtTime(0.12, now + 0.32);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    tone.connect(filter);
    grit.connect(filter);
    filter.connect(volume).connect(audio.destination);
    tone.start(now); grit.start(now);
    tone.stop(now + 0.48); grit.stop(now + 0.48);
  } catch {
    // No Web Audio: a silent shout.
  }
}

// A referee-style whistle: a high tone with a fast trill.
export function playWhistle() {
  if (!soundOn()) return;
  try {
    audio ??= new AudioContext();
    const now = audio.currentTime;
    const tone = audio.createOscillator();
    const trill = audio.createOscillator();
    const trillDepth = audio.createGain();
    const volume = audio.createGain();
    tone.frequency.value = 2900;
    trill.frequency.value = 38;
    trillDepth.gain.value = 260;
    trill.connect(trillDepth).connect(tone.frequency);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
    volume.gain.setValueAtTime(0.06, now + 0.75);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    tone.connect(volume).connect(audio.destination);
    tone.start(now); trill.start(now);
    tone.stop(now + 0.95); trill.stop(now + 0.95);
  } catch {
    // No Web Audio: no whistle.
  }
}

// Every button on the page clicks.
document.addEventListener('click', e => {
  if (e.target.closest('button')) playClick();
}, true);

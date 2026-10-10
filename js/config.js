// Settings that are easy to tweak in one place.

// Turn on while recording the demo: random check-ins happen within seconds.
export const DEMO_MODE = false;

// You start with this many coins (enough to unlock the soldier in the demo).
export const STARTING_COINS = 150;

// Choices offered during setup (minutes).
export const TIMER_LENGTHS = [1, 25, 45, 60];
export const FIXED_INTERVALS = [1, 15, 30, 50];

// Random check-ins: a new gap is picked each time, between these (minutes).
// In demo mode the gap is 15–60 seconds instead.
export const RANDOM_GAP_MIN = DEMO_MODE ? 0.25 : 10;
export const RANDOM_GAP_MAX = DEMO_MODE ? 1 : 40;

// Sound files in assets/sounds/. Leave a value as null to stay silent.
// Example once you've picked a clip: knock: 'knock.mp3'
export const SOUND_FILES = {
  knock: null,
  creak: null,
  bang: null,
};

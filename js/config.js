// Settings that are easy to tweak in one place.

// Turn on while recording the demo: random check-ins happen within seconds,
// and the dish and stunt finales unlock after 30 seconds and 1 minute.
// You can also switch it on without editing this: add ?demo to the address.
export const DEMO_MODE = false || new URLSearchParams(location.search).has('demo');

// You start with this many coins (enough to unlock the soldier in the demo).
export const STARTING_COINS = 150;

// Choices offered during setup (minutes).
export const TIMER_LENGTHS = [1, 25, 45, 60];
export const FIXED_INTERVALS = [1, 15, 30, 50];

// Random check-ins: a new gap is picked each time, between these (minutes).
// In demo mode the gap is 15–60 seconds instead.
export const RANDOM_GAP_MIN = DEMO_MODE ? 0.25 : 10;
export const RANDOM_GAP_MAX = DEMO_MODE ? 1 : 40;

// Her mood at check-ins, by minutes studied so far: pleased from this many,
// delighted from this many. In demo mode: after 20 and 45 seconds.
export const MOOD_PLEASED_MIN = DEMO_MODE ? 0.33 : 20;
export const MOOD_DELIGHTED_MIN = DEMO_MODE ? 0.75 : 60;

// Breaks: the longest break (set in Settings, default 60 minutes) before she
// slams the door and ends the session. She gets annoyed, angry and furious
// at these fractions of it. In demo mode the limit counts in seconds.
export const DEFAULT_BREAK_LIMIT_MIN = 60;
export const BREAK_LIMIT_CHOICES = [15, 30, 45, 60, 90, 120];
export const BREAK_UNIT_MS = DEMO_MODE ? 1000 : 60000;
export const ANGER_STAGES = [
  { from: 0.8, mood: 'furious' },
  { from: 0.5, mood: 'angry' },
  { from: 0.25, mood: 'annoyed' },
];

// Finale size by minutes studied. Under FINALE_PROUD_MIN she's unimpressed;
// then a proud hop, a dish, a stunt. In demo mode: 15 seconds, 30 seconds, 1 minute.
export const FINALE_PROUD_MIN = DEMO_MODE ? 0.25 : 15;
export const FINALE_DISH_MIN = DEMO_MODE ? 0.5 : 40;
export const FINALE_STUNT_MIN = DEMO_MODE ? 1 : 120;

// Sound files in assets/sounds/. Leave a value as null to stay silent.
// Example once you've picked a clip: knock: 'knock.mp3'
export const SOUND_FILES = {
  knock: 'knock.mp3',
  creak: 'creak.mp3',
  bang: 'bang.mp3',
  meow: 'meow.mp3',
};

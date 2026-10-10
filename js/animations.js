// Plays a named animation on a character by adding a CSS class,
// then waits for it to finish and removes the class.
// With { keep: true } the class stays on, holding the final pose.

export function play(characterEl, name, { keep = false } = {}) {
  const className = `anim-${name}`;

  return new Promise(resolve => {
    const finish = () => {
      clearTimeout(timer);
      characterEl.removeEventListener('animationend', onEnd);
      if (!keep) characterEl.classList.remove(className);
      resolve();
    };

    // Body parts finish their own animations too; only the whole
    // character's animation ending means the move is over.
    const onEnd = e => {
      if (e.target === characterEl) finish();
    };

    // Safety net in case the animation never reports that it ended.
    const timer = setTimeout(finish, 12000);

    characterEl.addEventListener('animationend', onEnd);
    characterEl.classList.add(className);
  });
}

// Pick one of a character's check-in animations, never the one played last time.
export function pickCheckIn(names, last) {
  const options = names.length > 1 ? names.filter(n => n !== last) : names;
  return options[Math.floor(Math.random() * options.length)];
}

const MOODS = [
  'mood-pleased', 'mood-delighted', 'mood-ecstatic',
  'mood-annoyed', 'mood-angry', 'mood-furious',
];

// Set her face: 'suspicious' (default), 'pleased', 'delighted', 'ecstatic',
// or (during a long break) 'annoyed', 'angry', 'furious'.
export function setMood(characterEl, mood) {
  characterEl.classList.remove(...MOODS);
  if (mood !== 'suspicious') characterEl.classList.add(`mood-${mood}`);
}

const wait = ms => new Promise(r => setTimeout(r, ms));

// Lean out of the doorway and stay there (while asking questions).
export async function stepOut(characterEl) {
  characterEl.classList.add('is-out');
  await wait(900);
}

// Go back behind the door.
// If a looping animation was just removed, the browser must first settle on
// her plain "out" pose; otherwise it skips the glide and she just vanishes.
export async function stepIn(characterEl) {
  getComputedStyle(characterEl).transform;   // settle the current pose
  await wait(40);
  characterEl.classList.remove('is-out');
  await wait(850);   // the glide back takes 0.8s; let it finish before the door shuts
}

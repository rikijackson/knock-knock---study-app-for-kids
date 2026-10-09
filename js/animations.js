// Plays a named animation on a character by adding a CSS class,
// then waits for it to finish and removes the class.

export function play(characterEl, name) {
  const className = `anim-${name}`;

  return new Promise(resolve => {
    const finish = () => {
      clearTimeout(timer);
      characterEl.removeEventListener('animationend', onEnd);
      characterEl.classList.remove(className);
      resolve();
    };

    // Body parts finish their own animations too; only the whole
    // character's animation ending means the move is over.
    const onEnd = e => {
      if (e.target === characterEl) finish();
    };

    // Safety net in case the animation never reports that it ended.
    const timer = setTimeout(finish, 10000);

    characterEl.addEventListener('animationend', onEnd);
    characterEl.classList.add(className);
  });
}

// Pick one of a character's check-in animations, never the one played last time.
export function pickCheckIn(names, last) {
  const options = names.length > 1 ? names.filter(n => n !== last) : names;
  return options[Math.floor(Math.random() * options.length)];
}

const wait = ms => new Promise(r => setTimeout(r, ms));

// Lean out of the doorway and stay there (while asking questions).
export async function stepOut(characterEl) {
  characterEl.classList.add('is-out');
  await wait(900);
}

// Go back behind the door.
export async function stepIn(characterEl) {
  characterEl.classList.remove('is-out');
  await wait(600);
}

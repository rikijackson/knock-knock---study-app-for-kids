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

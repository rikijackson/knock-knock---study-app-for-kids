// Starts the app.
import { createDoor } from './door.js';
import { getCharacter } from './characters/index.js';
import { play } from './animations.js';

const door = createDoor(document.getElementById('stage'));
const mother = getCharacter('mother');
door.setCharacter(mother.svg());

// Look test (temporary): every knock makes the mother check on you.
let busy = false;
door.onKnock(async () => {
  if (busy) return;
  busy = true;
  await door.open('ajar');
  await play(door.characterEl, 'look-around');
  await door.close();
  busy = false;
});

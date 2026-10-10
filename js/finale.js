// The end of a session: the character comes fully out for their signature
// move (a bigger version for 3+ tasks), sums up the session, and you get
// your coins. Today's minutes go into your study history.
import { play } from './animations.js';
import { ask } from './dialogue.js';
import { LINES, pick, fill, plural } from './messages.js';
import { minutesStudied } from './session.js';
import { update, todayKey } from './storage.js';
import { renderCoins, showCoinGain } from './ui.js';
import { playSound } from './sound.js';

function summary(lines, minutes, checkIns, doneCount) {
  const values = {
    minutes: plural(minutes, 'minute'),
    checkIns: plural(checkIns, 'time'),
    taskCount: doneCount,
    tasks: doneCount > 0 ? `, and you finished ${plural(doneCount, 'task')}` : '',
    praise: pick(doneCount > 0 ? lines.praise : lines.focusPraise),
  };
  return fill(pick(doneCount >= 3 ? lines.summaryBig : lines.summary), values);
}

export async function runFinale(door, character, session, doneCount) {
  const lines = LINES[character.id];
  const big = doneCount >= 3;
  const move = big ? character.finaleBig : character.finale;
  const minutes = minutesStudied(session);

  // 1 coin per whole minute studied, and today's minutes into the history.
  update(s => {
    s.coins += minutes;
    if (minutes > 0) s.history[todayKey()] = (s.history[todayKey()] ?? 0) + minutes;
  });

  playSound('creak');
  await door.open('wide');
  door.bringToFront();   // out in the room, so no arm can vanish behind the door
  await play(door.characterEl, move, { keep: true });   // stays in the ta-da pose

  renderCoins();
  if (minutes > 0) showCoinGain(minutes);
  await ask(summary(lines, minutes, session.checkInCount, doneCount), [
    { label: lines.thanks, value: true },
  ]);

  door.characterEl.classList.remove(`anim-${move}`);
  await play(door.characterEl, 'finale-exit');
  door.sendBack();
  await door.close();
}

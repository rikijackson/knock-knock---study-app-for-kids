// The end of a session: the character comes all the way out (in front of
// the fully open door) for a finale that grows with how long you studied:
// a proud moment, a dish, or a stunt. Then a summary, and your coins.
// Today's minutes go into your study history.
import { play, setMood } from './animations.js';
import { ask } from './dialogue.js';
import { LINES, pick, fill, plural } from './messages.js';
import { minutesStudied } from './session.js';
import { update, todayKey } from './storage.js';
import { renderCoins, showCoinGain } from './ui.js';
import { playSound } from './sound.js';
import { FINALE_PROUD_MIN, FINALE_DISH_MIN, FINALE_STUNT_MIN } from './config.js';

function summary(lines, minutes, checkIns, doneCount, tier) {
  // A short session gets a nudge to go longer, not praise.
  const closing = tier === 'meh' ? lines.mehClosing
    : doneCount > 0 ? lines.praise : lines.focusPraise;
  const values = {
    minutes: plural(minutes, 'minute'),
    checkIns: plural(checkIns, 'time'),
    tasks: doneCount > 0 ? `, and you finished ${plural(doneCount, 'task')}` : '',
    praise: pick(closing),
  };
  return fill(pick(lines.summary), values);
}

// Which finale, from study time (fractions of a minute count, for demo mode).
function chooseFinale(character, studiedMin) {
  const f = character.finales;
  if (studiedMin >= FINALE_STUNT_MIN) return { tier: 'stunt', move: pick(f.stunts) };
  if (studiedMin >= FINALE_DISH_MIN) return { tier: 'dish', move: f.dish, food: pick(f.foods) };
  if (studiedMin >= FINALE_PROUD_MIN) return { tier: 'proud', move: f.proud };
  return { tier: 'meh', move: f.meh };
}

// 1 coin per whole minute studied, and today's minutes into the history.
export function recordSession(session) {
  const minutes = minutesStudied(session);
  update(s => {
    s.coins += minutes;
    if (minutes > 0) s.history[todayKey()] = (s.history[todayKey()] ?? 0) + minutes;
  });
  renderCoins();
  if (minutes > 0) showCoinGain(minutes);
  return minutes;
}

export async function runFinale(door, character, session, doneCount) {
  const lines = LINES[character.id];
  const minutes = minutesStudied(session);
  const finale = chooseFinale(character, session.studiedMs / 60000);
  recordSession(session);

  const el = door.characterEl;
  if (finale.food) el.dataset.food = finale.food;   // which dish is under the lid
  setMood(el, { meh: 'suspicious', proud: 'pleased', dish: 'delighted', stunt: 'ecstatic' }[finale.tier]);

  playSound('creak');
  await door.open('wide');
  door.bringToFront();   // out in the room, so no arm can vanish behind the door
  await play(el, finale.move, { keep: true });   // holds the final pose

  let text = summary(lines, minutes, session.checkInCount, doneCount, finale.tier);
  if (finale.tier === 'meh') text = `${pick(lines.mehIntro)} ${text}`;
  if (finale.tier === 'dish') text = `${lines.dishIntro[finale.food]} ${text}`;
  if (finale.tier === 'stunt') text = `${pick(lines.stuntIntro)} ${text}`;

  await ask(text, [{ label: finale.tier === 'meh' ? lines.mehThanks : lines.thanks, value: true }]);

  // Back inside, starting from the pose this finale ended in.
  el.classList.remove(`anim-${finale.move}`);
  const exit = { meh: 'finale-exit-meh', dish: 'finale-exit-hold' }[finale.tier] ?? 'finale-exit';
  await play(el, exit);
  delete el.dataset.food;
  setMood(el, 'suspicious');
  door.sendBack();
  await door.close();
}

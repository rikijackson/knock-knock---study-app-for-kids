// Everything the characters say. Lines are picked at random so they vary.

// The voice from the dark doorway, before you've picked anyone.
export const DOOR_LINES = {
  start: 'Do you want to start a study session?',
  pick: 'Who do you want to check up on you?',
};

export const LINES = {
  mother: {
    hello: ['Oh, it\'s you. Let\'s get you set up.', 'Finally! Let\'s get you studying.'],
    mode: 'Timer or stopwatch, sweetie?',
    length: 'How long are we studying?',
    frequency: 'How often do you want me to check up on you?',
    confirm: 'Are you sure you\'d like to start?',
    go: ['Good. I\'ll be watching.', 'Off you go. I\'ll be right here.'],
    cancel: ['Fine. Knock when you\'re ready.', 'Hmph. Come back when you mean it.'],
    // Check-in lines, matched to the move she's doing.
    checkIn: {
      'look-around': [
        'Hmm. Looks like studying.',
        'Just checking. Carry on.',
        'Is that your homework or your phone?',
      ],
      peek: [
        'I see you. Keep going.',
        'Good. Carry on.',
        'Just making sure.',
      ],
      stare: [
        "Are you sure you're studying?",
        "Don't make me come in there.",
        '...',
      ],
      'mother-spoon': [
        'Sit up straight!',
        'Drink some water. Then study.',
        'Back to work, young one!',
      ],
    },
    done: [
      'Time\'s up! You studied {minutes} and I checked on you {checkIns}.',
      'That\'s it for today: {minutes} of studying, and I checked on you {checkIns}.',
    ],
  },
};

const lastPicked = new Map();

// A random entry, never the same one twice in a row for the same list.
export function pick(list) {
  if (!Array.isArray(list)) return list;
  if (list.length === 1) return list[0];
  let choice;
  do {
    choice = list[Math.floor(Math.random() * list.length)];
  } while (choice === lastPicked.get(list));
  lastPicked.set(list, choice);
  return choice;
}

// Fill in {placeholders} in a line.
export function fill(line, values) {
  return line.replace(/\{(\w+)\}/g, (_, key) => values[key]);
}

export function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

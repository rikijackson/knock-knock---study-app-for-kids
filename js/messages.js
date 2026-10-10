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
    // Check-in lines once she's happy with how long you've studied.
    checkInWarm: {
      pleased: [
        'Still going? Good!',
        'Look at you, so focused!',
        "I'm proud of you. Keep going.",
        'Mm-hm. Good work.',
      ],
      delighted: [
        'An HOUR?! Look at you!',
        "You're on a roll, sweetie!",
        'Best kid ever. Keep it up!',
        'I might have to bake something for this.',
      ],
    },
    breakStart: ["Take your break. I'll wait right here.", "Go on, stretch your legs. I'll be here."],
    // She gets crosser the longer a break goes on.
    breakNag: {
      annoyed: [
        "It's been a while, hasn't it?",
        "That's a long break, sweetie.",
        'Mm-hm. Still on break, I see.',
      ],
      angry: [
        'I think you should get back to work NOW.',
        'This break is getting ridiculous.',
        'Your books are getting lonely!',
      ],
      furious: [
        "Don't make me count to three!",
        'I am THIS close!',
        'ONE... TWO...',
      ],
    },
    breakLimit: ["That's IT! Study time is OVER!", 'ENOUGH! This session is over!'],
    breakEnd: ['Good. Back to it!', 'There we go. Back to work.'],
    breakOver: ['Oh! Done already?', 'Finished? Let me come out, then.'],
    // Under 15 minutes: unimpressed.
    mehIntro: ["That's it? Hmm.", 'Done already? That was quick.', "Well... it's a start, I suppose."],
    mehClosing: [
      "Let's aim for longer next time.",
      'Next time, give me at least fifteen minutes.',
      "I'll be expecting more tomorrow.",
    ],
    tasks: 'Would you like to choose any tasks for this session?',
    noTasksYet: 'Your to-do list is empty. Add some here, or skip.',
    finished: 'Which tasks did you finish?',
    // The summary after the finale. {tasks} is empty when you finished none,
    // and then {praise} praises your focus instead.
    summary: [
      'I checked on you {checkIns}, you studied {minutes}{tasks}. {praise}',
      '{minutes} of studying, and I popped in {checkIns}{tasks}. {praise}',
      'Well! You studied {minutes} and I checked on you {checkIns}{tasks}. {praise}',
    ],
    // Said before the summary, depending on the finale.
    dishIntro: {
      pie: 'Finally done! I baked you a blueberry pie.',
      cake: "You're done! Here, a cake, just for you.",
      cookies: 'All done? Have some cookies, fresh from the oven.',
    },
    stuntIntro: [
      'Two whole hours?! That deserved a stunt!',
      'You earned a show. Ta-da!',
      "Did you see that? That's how proud I am!",
    ],
    praise: ['Not bad at all.', "I'm proud of you.", 'Keep it up, sweetie.'],
    focusPraise: ['No tasks done, but what focus!', 'Nothing ticked off, but you sat and focused. That counts.'],
    thanks: 'Thanks, Mom!',
    mehThanks: 'Okay, okay…',
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

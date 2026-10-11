// Everything the characters say. Lines are picked at random so they vary.

// The voice from the dark doorway, before you've picked anyone.
export const DOOR_LINES = {
  // The very first visit: someone's not happy about all that knocking.
  introYo: 'Yo, why are you knocking on my door?',
  introStudy: "Sorry! I just want to study.",
  introWho: 'Who are you?!',
  introAfterStudy: "Oh! A studier! Well then. Knock again when you're ready, and I'll get you set up.",
  introAfterWho: "I'm the one who makes sure you actually study. Knock again when you're ready!",
  introOk: 'Okay!',
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
    // Too much knocking while you're meant to be studying.
    knockWarn: ['WHAT?!', 'Knock ONE more time...', "THAT'S IT!"],
    knockAfter: ['Stop knocking and STUDY!', 'That door is for emergencies only!', 'Now get back to work!'],
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
  // A strict drill sergeant. Everything is an order.
  soldier: {
    hello: ['Recruit! Front and centre!', "At ease. Not for long. Let's get you set up."],
    mode: 'State your mission, recruit! Timer or stopwatch?',
    length: 'How long is this operation?',
    frequency: 'How often do I inspect you?',
    confirm: 'Ready to begin the operation?',
    go: ['MOVE OUT! I will be watching.', 'Dismissed! Eyes on your work, soldier!'],
    cancel: ['Hmph. Report back when you are ready, recruit.', 'Dismissed. That is NOT a compliment.'],
    checkIn: {
      'look-around': [
        'Perimeter check. You had better be studying.',
        'Area secure. Carry on.',
        'Is that your homework or your phone, recruit?',
      ],
      peek: ['Inspection! ...Acceptable. Carry on.', 'I see you. Keep moving.', 'Eyes front!'],
      stare: ['Did I say you could slack off?', 'I am watching you, recruit.', '...'],
      'soldier-whistle': ['EYES ON YOUR WORK!', 'FOCUS, RECRUIT!', 'Back to it! MOVE, MOVE, MOVE!'],
    },
    checkInWarm: {
      pleased: ['Good discipline, recruit.', 'Hm. Keep that up.', 'Still at it. Good.'],
      delighted: ['An HOUR! Now THAT is a soldier!', 'Outstanding work, recruit!', 'Keep this up and I might smile.'],
    },
    breakStart: ['Break granted. Do not get comfortable.', 'Five minutes, recruit. I am counting.'],
    breakNag: {
      annoyed: ['Your break is getting long, recruit.', 'Tick tock, soldier.', 'I said a SHORT break.'],
      angry: ['BACK TO YOUR POST, RECRUIT!', 'This is NOT a holiday!', 'Break time is OVER!'],
      furious: ['I will count to three, RECRUIT!', 'DO YOU WANT LAPS?!', 'ONE... TWO...'],
    },
    knockWarn: ['WHO IS KNOCKING?!', 'You knock ONE more time...', 'THAT DOES IT!'],
    knockAfter: ['That door is OFF LIMITS, recruit!', 'Stop knocking and STUDY!', 'Next time it is laps!'],
    breakLimit: ['DESERTION! This operation is OVER!', 'ENOUGH! Operation terminated!'],
    breakEnd: ['Back to your post. Good.', 'About time, recruit!'],
    breakOver: ['Done already?! Report!', 'Operation over? Let me come out.'],
    // Under 15 minutes: he's not having it.
    mehIntro: [
      'Under fifteen minutes?! DROP AND GIVE ME TWENTY!',
      'THAT was your operation?! Push-ups. NOW!',
      'Pathetic! Twenty push-ups, recruit!',
    ],
    mehClosing: ['Next time, you give me at least fifteen minutes!', 'I expect better tomorrow, recruit.'],
    mehThanks: 'Sir, yes sir…',
    proudIntro: ['Acceptable, recruit. You have earned a badge.', 'Not bad. Take this badge, and wear it with pride.'],
    tasks: 'Which objectives are we completing today?',
    noTasksYet: 'You have no objectives, recruit! Add some here, or skip.',
    finished: 'Report! Which objectives did you complete?',
    summary: [
      'Debrief: {minutes} of studying, I inspected you {checkIns}{tasks}. {praise}',
      'Operation report: you studied {minutes} and I checked on you {checkIns}{tasks}. {praise}',
    ],
    dishIntro: {
      medal: 'For outstanding service, I award you this medal!',
      trophy: 'Recruit! This trophy is yours. You earned it.',
    },
    stuntIntro: [
      'TWO HOURS! That deserves full military honours!',
      'Now THAT is how a soldier studies!',
      'Outstanding! Celebrate, recruit! That is an order!',
    ],
    praise: ['Carry on, soldier.', 'Good work, recruit.', 'Dismissed.'],
    focusPraise: ['No objectives completed, but you held your post.', 'Nothing ticked off. Next time, complete the mission.'],
    thanks: 'Sir, yes sir!',
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

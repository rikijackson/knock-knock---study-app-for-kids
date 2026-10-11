// The list of characters. Each one is drawn on the same shared rig,
// so the shared animations work for all of them.
import { motherSvg } from './mother.js';
import { fatherSvg } from './father.js';
import { soldierSvg } from './soldier.js';

export const CHARACTERS = [
  {
    id: 'mother',
    name: 'Mother',
    price: 0,
    free: true,
    svg: motherSvg,
    // look-around, peek and stare are shared; mother-spoon is hers alone.
    checkIns: ['look-around', 'peek', 'stare', 'mother-spoon'],
    // Finales by study time: a proud moment, a dish, or a stunt.
    finales: {
      meh: 'finale-meh',
      proud: 'finale-proud',
      dish: 'finale-dish',
      variants: ['pie', 'cake', 'cookies'],
      stunts: ['stunt-cartwheel', 'stunt-backflip', 'stunt-rocket'],
      // How she goes back inside after each one (default: finale-exit).
      exits: { 'finale-meh': 'finale-exit-meh', 'finale-dish': 'finale-exit-hold' },
    },
    // Knock 3 times while studying: a pie in the face.
    punish: 'pie',
  },
  {
    id: 'soldier',
    name: 'Soldier',
    price: 100,
    svg: soldierSvg,
    // look-around, peek and stare are shared; the drill whistle is his.
    checkIns: ['look-around', 'peek', 'stare', 'soldier-whistle'],
    finales: {
      meh: 'soldier-meh',            // "DROP AND GIVE ME TWENTY!"
      proud: 'soldier-badge',
      dish: 'soldier-award',
      variants: ['medal', 'trophy'],
      stunts: ['soldier-salute', 'soldier-cannon', 'soldier-bomb'],
      // He goes back in with soldier-exit, starting from his arm's last angle.
      exits: {
        'soldier-meh': 'soldier-exit', 'soldier-badge': 'soldier-exit',
        'soldier-award': 'soldier-exit', 'soldier-salute': 'soldier-exit',
        'soldier-cannon': 'soldier-exit', 'soldier-bomb': 'soldier-exit',
      },
      armEnd: {
        'soldier-meh': '-45deg', 'soldier-badge': '-70deg', 'soldier-award': '-70deg',
        'soldier-salute': '0deg', 'soldier-cannon': '-70deg', 'soldier-bomb': '-70deg',
      },
      // What he's still holding as he goes back in.
      holding: { 'soldier-badge': 'badge', 'soldier-cannon': 'cannon', 'soldier-salute': 'salute' },
      // Confetti and bombs, at a point in the move (seconds).
      effects: {
        'soldier-salute': { at: 1.5, run: 'confetti-rain' },
        'soldier-cannon': { at: 2.0, run: 'confetti-cannon' },
        'soldier-bomb': { at: 1.72, run: 'confetti-bomb' },
      },
      // He's strict: a short session makes him angry, not just unimpressed.
      moods: { meh: 'angry', proud: 'suspicious', dish: 'pleased' },
    },
    // Knock 3 times while studying: he shoots at the screen.
    punish: 'gun',
  },
  {
    id: 'father',
    name: 'Father',
    price: 200,
    // Never unlocked in this version (PRD decision).
    comingSoon: true,
    svg: fatherSvg,
  },
];

export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id);
}

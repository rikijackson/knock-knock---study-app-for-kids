// The list of characters. Each one is drawn on the same shared rig,
// so the shared animations work for all of them.
import { motherSvg } from './mother.js';

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
      foods: ['pie', 'cake', 'cookies'],
      stunts: ['stunt-cartwheel', 'stunt-backflip', 'stunt-rocket'],
    },
  },
];

export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id);
}

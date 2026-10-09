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
  },
];

export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id);
}

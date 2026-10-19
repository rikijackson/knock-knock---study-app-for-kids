// Door & Room decorations: the catalog, the color themes, and showing
// whatever you've switched on. Characters keep their own colors, so color
// themes never change them.
import { getSave, update } from './storage.js';
import { ROOMS } from './rooms.js';

// kind: 'background' and 'holiday' are one at a time; others are on/off.
export const DECOR = [
  { id: 'bg-kitchen',  name: 'Kitchen',   kind: 'background', price: 150 },
  { id: 'bg-barracks', name: 'Barracks',  kind: 'background', price: 150 },
  { id: 'bg-bedroom',  name: 'Bedroom',   kind: 'background', price: 150 },
  { id: 'christmas',   name: 'Christmas wreath', kind: 'holiday', price: 175 },
  { id: 'halloween',   name: 'Halloween', kind: 'holiday', price: 175 },
  { id: 'nameplate',   name: 'Nameplate', kind: 'item', price: 300 },
  { id: 'fairy-lights', name: 'Fairy lights', kind: 'item', price: 350 },
  { id: 'sticky-notes', name: 'Sticky-note tasks', kind: 'item', price: 350 },
  { id: 'doorbell',    name: 'Doorbell', kind: 'item', price: 500 },
  { id: 'plant',       name: 'Study plant', kind: 'item', price: 700 },
  { id: 'cat-flap',    name: 'Cat flap', kind: 'item', price: 1100 },
];

export const getDecor = id => DECOR.find(d => d.id === id);

// ---------- Color themes ----------
// Each palette sets the app's color variables for light and dark mode.
// Ocean is the original look (no overrides).
const VARS = ['bg', 'ink', 'blue', 'pale', 'teal', 'frame', 'frame-shade', 'door', 'door-shade',
  'door-inset', 'door-edge', 'knob', 'doorway', 'bubble-accent', 'heat-0', 'heat-1', 'heat-2', 'heat-3', 'heat-4'];

const row = values => Object.fromEntries(VARS.map((v, i) => [v, values[i]]));

export const PALETTES = {
  ocean: { name: 'Ocean', swatch: '#2f6fdd' },
  forest: {
    name: 'Forest', swatch: '#2f8f55',
    light: row(['#f3f8f3', '#16301f', '#2f8f55', '#dcefe1', '#2a8a7a', '#23472f', '#1a3824', '#4f9a68', '#3e8156',
      '#458c5e', '#2f6a45', '#e0f2e5', '#070d09', '#2f8f55', '#e2efe5', '#b5dcc0', '#7cc496', '#3f9e64', '#1f6b3e']),
    dark: row(['#0e1a13', '#e3f1e7', '#5fc287', '#183324', '#4fc2a8', '#1f3d2b', '#173022', '#3a7a52', '#2e6443',
      '#336d49', '#234f35', '#b8dcc4', '#030705', '#2f8f55', '#183324', '#235a3a', '#2f7f4f', '#4faa6f', '#8fd6a6']),
  },
  lavender: {
    name: 'Lavender', swatch: '#7a55d6',
    light: row(['#f7f4fc', '#2a1f45', '#7a55d6', '#e8dffa', '#8a6bd1', '#3d2f6b', '#2f2455', '#8f74d6', '#7a5ebf',
      '#8468cb', '#5d469c', '#efe8fb', '#0b0814', '#7a55d6', '#ece6f8', '#cfc0f1', '#a88fe6', '#7f5fd6', '#5a3aa8']),
    dark: row(['#15111f', '#ece6fa', '#a58cf0', '#251d3a', '#b9a2f5', '#2c2350', '#221b40', '#5f4aa0', '#4f3d88',
      '#574394', '#3e306d', '#d5c8f5', '#05030a', '#7a55d6', '#251d3a', '#3d2f6b', '#5a45a0', '#8569d8', '#bba8f5']),
  },
  rose: {
    name: 'Rose', swatch: '#d1527a',
    light: row(['#fcf4f6', '#45202c', '#d1527a', '#f8dde5', '#c2607e', '#6b2f42', '#552434', '#d97b98', '#c26583',
      '#cf6f8d', '#9c4660', '#fbe8ee', '#12070a', '#d1527a', '#f7e3e9', '#efbccb', '#e28aa5', '#cc5a7e', '#9c3556']),
    dark: row(['#1f1116', '#fae6ec', '#f08aa8', '#3a1d27', '#f5a2bb', '#50232f', '#401b26', '#a04a64', '#883c54',
      '#94435c', '#6d2d40', '#f5c8d6', '#0a0305', '#d1527a', '#3a1d27', '#6b2f42', '#a0455f', '#d8698a', '#f5a8bf']),
  },
  sunset: {
    name: 'Sunset', swatch: '#e07a2f',
    light: row(['#fdf6ef', '#3f2414', '#e07a2f', '#fbe3cf', '#d4602f', '#6b3a1f', '#552e18', '#e8955a', '#d17f45',
      '#dc8a4f', '#a35a2a', '#fcecdc', '#120904', '#e07a2f', '#fbeadb', '#f6c9a3', '#efa16a', '#e07a2f', '#a8521a']),
    dark: row(['#1f140c', '#fbeadb', '#f5a463', '#3a2617', '#f58a5a', '#50301a', '#402614', '#a85f2e', '#8f4f25',
      '#9c5729', '#6d3d1c', '#f5d2b4', '#0a0502', '#e07a2f', '#3a2617', '#6b4325', '#a0612f', '#d8823f', '#f5b47a']),
  },
  slate: {
    name: 'Slate', swatch: '#4a5568',
    light: row(['#f4f5f7', '#1e2329', '#4a5568', '#e2e5ea', '#5a6b7d', '#2d3440', '#232933', '#6b7686', '#586271',
      '#626d7c', '#444c58', '#e8ebef', '#08090b', '#4a5568', '#e4e7eb', '#c3c9d2', '#98a2b0', '#6b7686', '#3f4855']),
    dark: row(['#121418', '#e8ebef', '#9aa6b8', '#222730', '#a9b6c6', '#2a303a', '#20252d', '#4a5361', '#3d4551',
      '#444c59', '#303742', '#c5ccd6', '#040506', '#4a5568', '#222730', '#363e4a', '#4e5866', '#76828f', '#aab4c0']),
  },
};

// Set the palette's variables for the current light/dark mode.
export function applyPalette(mode) {
  const root = document.documentElement;
  for (const v of VARS) root.style.removeProperty(`--${v}`);
  const palette = PALETTES[getSave().decor.palette];
  const values = palette?.[mode];
  if (!values) return;   // Ocean: the stylesheet's own colors
  for (const [v, value] of Object.entries(values)) root.style.setProperty(`--${v}`, value);
}

// ---------- Owning and switching on ----------

export const owns = id => getSave().decor.owned.includes(id);

export function isOn(id) {
  const { active } = getSave().decor;
  const item = getDecor(id);
  if (item.kind === 'background') return active.background === id;
  if (item.kind === 'holiday') return active.holiday === id;
  return Boolean(active[id]);
}

// Switch an owned item on or off. One background and one holiday at a time.
export function toggle(id) {
  const item = getDecor(id);
  update(s => {
    const a = s.decor.active;
    if (item.kind === 'background') a.background = a.background === id ? null : id;
    else if (item.kind === 'holiday') a.holiday = a.holiday === id ? null : id;
    else a[id] = !a[id];
  });
  applyDecor();
}

export function buy(id) {
  const item = getDecor(id);
  const save = getSave();
  if (owns(id) || save.coins < item.price) return false;
  update(s => {
    s.coins -= item.price;
    s.decor.owned.push(id);
  });
  toggle(id);   // switch it on straight away
  return true;
}

export function setPalette(name) {
  update(s => { s.decor.palette = name; });
  document.dispatchEvent(new CustomEvent('palettechange'));
}

export function setName(name) {
  update(s => { s.decor.name = name.trim().slice(0, 18); });
  applyDecor();
}

// ---------- Showing what's switched on ----------

export function applyDecor() {
  document.dispatchEvent(new CustomEvent('decorchange'));
  const scene = document.querySelector('.door-scene');
  const room = document.querySelector('.room');
  const { active, name } = getSave().decor;
  for (const item of DECOR) scene.classList.toggle(`has-${item.id}`, isOn(item.id));
  if (room.dataset.background !== (active.background ?? '')) {
    room.dataset.background = active.background ?? '';
    room.innerHTML = ROOMS[active.background] ?? '';
  }
  document.body.classList.toggle('has-room', Boolean(active.background));
  setLights(litCount);
  const plate = scene.querySelector('.nameplate-text');
  plate.textContent = name || 'Your name';
}

// ---------- Fairy lights: bulb by bulb as the session goes on ----------
let litCount = 0;

// fraction: 0 (session start) to 1 (all lit, they twinkle). The first bulb
// lights straight away, so you can see the lights are counting your session.
export function lightUp(fraction) {
  const bulbs = document.querySelectorAll('.door-scene .bulb');
  const count = Math.min(bulbs.length, 1 + Math.floor(fraction * bulbs.length));
  if (count !== litCount) setLights(count);
}

function setLights(count) {
  litCount = count;
  const bulbs = document.querySelectorAll('.door-scene .bulb');
  bulbs.forEach((b, i) => b.classList.toggle('is-lit', i < count));
  document.querySelector('.door-scene').classList.toggle('lights-full', count > 0 && count >= bulbs.length);
}

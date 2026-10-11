// The Store. Characters: each with their price and state (owned / buy /
// not enough coins / coming soon); buying makes them choosable right away.
// Door & Room: free color themes and decorations to buy and switch on.
import { CHARACTERS } from './characters/index.js';
import { getSave, update } from './storage.js';
import { renderCoins } from './ui.js';
import { DECOR, PALETTES, owns, isOn, buy as buyDecor, toggle, setPalette, setName } from './decor.js';
import { ROOMS } from './rooms.js';

const listEl = document.getElementById('store-list');
const noteEl = document.getElementById('store-note');

function cardState(character, save) {
  if (save.owned.includes(character.id)) return { label: 'Owned', kind: 'owned' };
  if (character.comingSoon) return { label: 'Coming soon', kind: 'locked' };
  if (save.coins >= character.price) return { label: `Buy for ${character.price}`, kind: 'buy' };
  return { label: `Need ${character.price - save.coins} more`, kind: 'short' };
}

export function renderStore() {
  const save = getSave();
  listEl.innerHTML = '';
  for (const character of CHARACTERS) {
    const state = cardState(character, save);
    const li = document.createElement('li');
    li.className = `store-card is-${state.kind}`;
    li.innerHTML = `
      <svg class="store-portrait" viewBox="-95 -505 190 245" aria-hidden="true">${character.svg()}</svg>
      <div class="store-info">
        <strong></strong>
        <span class="store-price"></span>
      </div>
      <button type="button" class="btn store-btn"></button>`;
    li.querySelector('strong').textContent = character.name;
    li.querySelector('.store-price').textContent =
      character.price ? `${character.price} coins` : 'Free';
    const btn = li.querySelector('.store-btn');
    btn.textContent = state.label;
    btn.disabled = state.kind !== 'buy';
    btn.addEventListener('click', () => buy(character));
    listEl.append(li);
  }
}

function buy(character) {
  const save = getSave();
  if (save.owned.includes(character.id) || save.coins < character.price || character.comingSoon) return;
  update(s => {
    s.coins -= character.price;
    s.owned.push(character.id);
  });
  renderCoins();
  renderStore();
  noteEl.textContent = `${character.name} unlocked! Knock on the door to pick them.`;
}

// Refresh whenever the Store opens.
document.querySelector('[data-panel="store-panel"]').addEventListener('click', () => {
  noteEl.textContent = '';
  renderStore();
});

renderStore();

// ---------- Door & Room tab ----------

const paletteEl = document.getElementById('palette-list');
const decorEl = document.getElementById('decor-list');
const nameForm = document.getElementById('name-form');

const PREVIEWS = {
  christmas: `<svg viewBox="-80 -60 160 120"><circle r="40" fill="none" stroke="#2f6b3a" stroke-width="18"/>
    <circle r="40" fill="none" stroke="#3d8a4a" stroke-width="8" stroke-dasharray="8 10"/>
    <circle cx="40" cy="0" r="5" fill="#d63c3c"/><circle cx="-28" cy="-28" r="5" fill="#d63c3c"/><circle cx="-28" cy="28" r="5" fill="#d63c3c"/>
    <path d="M0 36 L-20 54 L-16 30 Z M0 36 L20 54 L16 30 Z" fill="#d63c3c"/></svg>`,
  halloween: `<svg viewBox="-80 -60 160 120"><ellipse cx="0" cy="14" rx="40" ry="32" fill="#e07a2f"/>
    <path d="M-4 -18 Q0 -32 10 -34" stroke="#4a6e3a" stroke-width="6" fill="none"/>
    <path d="M-20 6 L-10 -4 L-4 8 Z M6 8 L12 -4 L20 6 Z M-20 22 Q0 38 20 22 L12 26 L4 21 L-4 26 Z" fill="#ffd45a"/>
    <path d="M30 -40 Q40 -50 48 -40 Q54 -46 60 -40 Q52 -38 48 -32 Q42 -38 30 -40 Z" fill="#e6ecf5"/></svg>`,
  nameplate: `<svg viewBox="-80 -60 160 120"><rect x="-62" y="-20" width="124" height="40" rx="8" fill="#c9a85a"/>
    <rect x="-56" y="-14" width="112" height="28" rx="5" fill="none" stroke="#9c7d3c" stroke-width="2"/>
    <text y="7" text-anchor="middle" font-size="18" font-weight="700" font-family="Georgia, serif" fill="#3a2a10">Your name</text></svg>`,
};

function decorState(item, save) {
  if (owns(item.id)) return isOn(item.id) ? { label: 'On ✓', kind: 'on' } : { label: 'Switch on', kind: 'owned' };
  if (save.coins >= item.price) return { label: `Buy for ${item.price}`, kind: 'buy' };
  return { label: `Need ${item.price - save.coins} more`, kind: 'short' };
}

export function renderDecor() {
  const save = getSave();

  paletteEl.innerHTML = '';
  for (const [id, p] of Object.entries(PALETTES)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'palette' + (save.decor.palette === id ? ' is-active' : '');
    btn.innerHTML = `<i style="background:${p.swatch}"></i><span></span>`;
    btn.querySelector('span').textContent = p.name;
    btn.addEventListener('click', () => { setPalette(id); renderDecor(); });
    paletteEl.append(btn);
  }

  decorEl.innerHTML = '';
  for (const item of DECOR) {
    const state = decorState(item, save);
    const li = document.createElement('li');
    li.className = `store-card is-${state.kind}`;
    li.innerHTML = `
      <div class="decor-preview">${ROOMS[item.id] ?? PREVIEWS[item.id] ?? ''}</div>
      <div class="store-info"><strong></strong><span class="store-price"></span></div>
      <button type="button" class="btn store-btn"></button>`;
    li.querySelector('strong').textContent = item.name;
    li.querySelector('.store-price').textContent = `${item.price} coins`;
    const btn = li.querySelector('.store-btn');
    btn.textContent = state.label;
    btn.disabled = state.kind === 'short';
    btn.addEventListener('click', () => {
      if (owns(item.id)) toggle(item.id);
      else if (buyDecor(item.id)) noteEl.textContent = `${item.name} bought and switched on!`;
      renderCoins();
      renderDecor();
    });
    decorEl.append(li);
  }

  // The name box shows once you own the nameplate.
  nameForm.hidden = !owns('nameplate');
  const input = nameForm.querySelector('input');
  if (document.activeElement !== input) input.value = save.decor.name;
}

nameForm.addEventListener('submit', e => {
  e.preventDefault();
  setName(nameForm.querySelector('input').value);
  noteEl.textContent = 'Nameplate updated.';
});

// Tabs: Characters / Door & Room.
for (const tab of document.querySelectorAll('.store-tab')) {
  tab.addEventListener('click', () => {
    for (const t of document.querySelectorAll('.store-tab')) t.classList.toggle('is-active', t === tab);
    for (const page of document.querySelectorAll('.store-page')) page.hidden = page.dataset.page !== tab.dataset.tab;
    noteEl.textContent = '';
  });
}

document.querySelector('[data-panel="store-panel"]').addEventListener('click', renderDecor);
renderDecor();

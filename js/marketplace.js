// The Store: every character with their price and state (owned / buy /
// not enough coins / coming soon), plus your coin balance. Buying deducts
// the coins and makes the character choosable right away.
import { CHARACTERS } from './characters/index.js';
import { getSave, update } from './storage.js';
import { renderCoins } from './ui.js';

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

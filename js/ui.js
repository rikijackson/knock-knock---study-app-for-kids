// The side buttons, the pop-up panels, and the coin balance.
import { getSave } from './storage.js';

const panels = document.querySelectorAll('.panel');

export function openPanel(id) {
  const panel = document.getElementById(id);
  for (const p of panels) p.hidden = p !== panel;
  document.body.classList.add('has-panel');
  panel.querySelector('input, button:not(.panel-close)')?.focus();
}

export function closePanels() {
  for (const p of panels) p.hidden = true;
  document.body.classList.remove('has-panel');
}

// Side buttons: <button data-panel="tasks-panel">
for (const btn of document.querySelectorAll('[data-panel]')) {
  btn.addEventListener('click', () => openPanel(btn.dataset.panel));
}

for (const btn of document.querySelectorAll('.panel-close, .panel-backdrop')) {
  btn.addEventListener('click', closePanels);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePanels();
});

export function renderCoins() {
  const coins = getSave().coins;
  for (const el of document.querySelectorAll('[data-coins]')) el.textContent = coins;
}

// A little "+12" that floats up from the coin balance.
export function showCoinGain(amount) {
  const badge = document.querySelector('.coin-badge');
  const pop = document.createElement('span');
  pop.className = 'coin-pop';
  pop.textContent = `+${amount}`;
  badge.append(pop);
  setTimeout(() => pop.remove(), 1800);
}

renderCoins();

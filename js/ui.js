// The side buttons, the pop-up panels, and the coin balance.
import { getSave, update } from './storage.js';
import { playClick } from './sound.js';
import { BREAK_LIMIT_CHOICES, DEFAULT_BREAK_LIMIT_MIN } from './config.js';

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

// Light / dark mode: follows your computer until you pick one with the
// sun/moon button; your pick is remembered.
const themeBtn = document.querySelector('.theme-btn');

function effectiveTheme() {
  const t = getSave().theme;
  if (t === 'light' || t === 'dark') return t;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme() {
  const t = getSave().theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
  const dark = effectiveTheme() === 'dark';
  themeBtn.classList.toggle('is-dark', dark);
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

themeBtn.addEventListener('click', () => {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  update(s => { s.theme = next; });
  applyTheme();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
applyTheme();

// Settings: sound effects on/off, remembered in the save.
const soundToggle = document.getElementById('sound-toggle');
soundToggle.checked = getSave().soundOn !== false;
soundToggle.addEventListener('change', () => {
  update(s => { s.soundOn = soundToggle.checked; });
  playClick();   // only heard when switching sound back on
});

// Settings: the longest break before Mom ends the session.
const breakLimit = document.getElementById('break-limit');
for (const min of BREAK_LIMIT_CHOICES) {
  const label = min < 60 ? `${min} min` : min === 60 ? '1 hour' : `${min / 60} hours`;
  breakLimit.add(new Option(label, String(min)));
}
breakLimit.value = String(getSave().breakLimitMin ?? DEFAULT_BREAK_LIMIT_MIN);
breakLimit.addEventListener('change', () => {
  update(s => { s.breakLimitMin = Number(breakLimit.value); });
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

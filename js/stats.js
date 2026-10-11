// The Stats panel: a heat map of the last 12 weeks (one square per day,
// shaded by how long you studied), your most-studied day, your daily
// average, and the "Reset data" link.
import { getSave, resetSave, todayKey } from './storage.js';

const WEEKS = 12;
const mapEl = document.getElementById('heatmap');
const monthsEl = document.getElementById('heatmap-months');
const bestEl = document.getElementById('stat-best');
const averageEl = document.getElementById('stat-average');
const demoNoteEl = document.getElementById('stats-demo-note');
const resetBtn = document.getElementById('reset-data');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMinutes(min) {
  const m = Math.round(min);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h} h ${m % 60} min` : `${h} h`;
}

// 0–4: how dark the square is.
function level(min) {
  if (!min) return 0;
  if (min < 30) return 1;
  if (min < 60) return 2;
  if (min < 120) return 3;
  return 4;
}

export function renderStats() {
  const save = getSave();
  const minutesOn = key => (save.history[key] ?? 0) + (save.demoHistory[key] ?? 0);

  // Start on the Monday 11 weeks before this week's Monday.
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7) - (WEEKS - 1) * 7);

  mapEl.innerHTML = '';
  monthsEl.innerHTML = '';
  let total = 0;
  let best = { key: null, min: 0 };
  let lastMonth = -1;

  for (let week = 0; week < WEEKS; week++) {
    const label = document.createElement('span');
    for (let day = 0; day < 7; day++) {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7 + day);
      const key = todayKey(date);
      const cell = document.createElement('i');
      if (date > today) {
        cell.className = 'day is-future';
      } else {
        const min = minutesOn(key);
        total += min;
        if (min > best.min) best = { key, min, date };
        cell.className = `day level-${level(min)}`;
        cell.title = `${MONTHS[date.getMonth()]} ${date.getDate()}: ${min ? formatMinutes(min) : 'no studying'}`;
      }
      if (day === 0 && date.getMonth() !== lastMonth) {
        label.textContent = MONTHS[date.getMonth()];
        lastMonth = date.getMonth();
      }
      mapEl.append(cell);
    }
    monthsEl.append(label);
  }

  const daysSoFar = Math.round((today - start) / 86400000) + 1;
  bestEl.textContent = best.key
    ? `${MONTHS[best.date.getMonth()]} ${best.date.getDate()} · ${formatMinutes(best.min)}`
    : 'Nothing yet';
  averageEl.textContent = formatMinutes(total / daysSoFar);
  demoNoteEl.hidden = Object.keys(save.demoHistory).length === 0;
}

// Reset needs two clicks, so it can't happen by accident.
let armed = false;
resetBtn.addEventListener('click', () => {
  if (!armed) {
    armed = true;
    resetBtn.textContent = 'Click again to erase everything';
    setTimeout(() => {
      armed = false;
      resetBtn.textContent = 'Reset data';
    }, 4000);
    return;
  }
  resetSave();
  location.reload();
});

document.querySelector('[data-panel="stats-panel"]').addEventListener('click', renderStats);
renderStats();

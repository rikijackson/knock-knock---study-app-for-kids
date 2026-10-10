// Loads and saves everything you keep between visits, in the browser's
// localStorage under one key. A session in progress is never saved.
import { STARTING_COINS, DEFAULT_BREAK_LIMIT_MIN } from './config.js';

const KEY = 'studyCheckIn.save';

function defaultSave() {
  return {
    introSeen: false,
    theme: 'auto',
    soundOn: true,
    breakLimitMin: DEFAULT_BREAK_LIMIT_MIN,
    coins: STARTING_COINS,
    owned: ['mother'],
    tasks: [],
    history: {},
    demoHistory: {},
  };
}

let save = load();

// Read the save, or start fresh if it's missing or broken.
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSave();
    const data = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return defaultSave();
    const fresh = defaultSave();
    return {
      ...fresh,
      ...data,
      coins: Number.isFinite(data.coins) ? data.coins : fresh.coins,
      owned: Array.isArray(data.owned) ? data.owned : fresh.owned,
      tasks: Array.isArray(data.tasks) ? data.tasks : fresh.tasks,
      history: data.history && typeof data.history === 'object' ? data.history : {},
      demoHistory: data.demoHistory && typeof data.demoHistory === 'object' ? data.demoHistory : {},
    };
  } catch {
    return defaultSave();
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // Storage can be full or blocked; the app keeps working for this visit.
  }
}

// Change the save and write it straight away.
export function update(change) {
  change(save);
  persist();
  return save;
}

export function getSave() {
  return save;
}

// Wipe everything (the "Reset data" link).
export function resetSave() {
  try { localStorage.removeItem(KEY); } catch {}
  save = defaultSave();
  persist();
}

// Today's date as YYYY-MM-DD in your own time zone.
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

persist();

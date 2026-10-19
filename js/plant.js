// The study plant (bought in the Store): it sits beside the door and grows a
// little every day you study. Skip days and it droops and fades; study again
// and it perks right back up. It never dies. It only counts your real study
// days (your history), never the sample data on the heat map.
import { getSave, todayKey } from './storage.js';

const MAX_GROWTH = 10;
// Growth needed for each stage: seed, sprout, seedling, leafy, budding, blooming.
const STAGE_AT = [0, 1, 2, 4, 6, 8];
const STAGE_NAMES = ['a seed', 'a sprout', 'a seedling', 'leafy', 'budding', 'in full bloom'];

// Testing helper: ?streak=5&missed=2 shows the plant as if you had a 5-day
// streak and then missed 2 days. It only changes what you see, never your save.
const params = new URLSearchParams(location.search);
const FAKE = params.has('streak') || params.has('missed')
  ? { growth: Number(params.get('streak')) || 0, streak: Number(params.get('streak')) || 0, missed: Number(params.get('missed')) || 0 }
  : null;

// Walk day by day from your first study day to today: a study day grows the
// plant, a missed day shrinks it by half a step and makes it droop. Today
// only counts once you've studied (it isn't "missed" yet).
export function plantState(history = getSave().history, today = new Date()) {
  if (FAKE) return FAKE;
  const studied = key => (history[key] ?? 0) > 0;
  const days = Object.keys(history).filter(studied).sort();
  if (!days.length) return { growth: 0, missed: 0, streak: 0 };

  const todayStr = todayKey(today);
  const day = new Date(`${days[0]}T12:00:00`);
  let growth = 0;
  let missed = 0;
  for (let key = todayKey(day); key <= todayStr; day.setDate(day.getDate() + 1), key = todayKey(day)) {
    if (studied(key)) {
      growth = Math.min(growth + 1, MAX_GROWTH);
      missed = 0;
    } else if (key !== todayStr) {
      growth = Math.max(growth - 0.5, 1);
      missed++;
    }
  }

  // Your streak: study days in a row, ending today (or yesterday, if you
  // haven't studied yet today).
  const back = new Date(today);
  if (!studied(todayKey(back))) back.setDate(back.getDate() - 1);
  let streak = 0;
  while (studied(todayKey(back))) {
    streak++;
    back.setDate(back.getDate() - 1);
  }
  return { growth, missed, streak };
}

export function stageFor(growth) {
  let stage = 0;
  STAGE_AT.forEach((at, i) => { if (growth >= at) stage = i; });
  return stage;
}

// ---------- Drawing ----------
// A 100 x 180 picture: the pot at the bottom, the soil at y 134.
const LEAF = ['#4caf50', '#7fa843', '#a59a48', '#9c7a3e'];       // by wilt: fresh to brown
const LEAF_EDGE = ['#2e7d32', '#5f8030', '#7d7232', '#6e5428'];
const PETAL = ['#ff8fb1', '#e8a0b4', '#cfa6ad', '#b89a90'];

export function plantSvg(stage, wilt = 0) {
  const height = [6, 22, 44, 66, 86, 100][stage];
  const bend = wilt * 9;
  const droop = wilt * height * 0.14;
  const p0 = [50, 134];
  const p1 = [50, 134 - height * 0.6];
  const p2 = [50 + bend, 134 - height + droop];
  const at = t => [0, 1].map(i => (1 - t) ** 2 * p0[i] + 2 * (1 - t) * t * p1[i] + t ** 2 * p2[i]);

  // Leaves in pairs up the stem; the higher pairs are smaller.
  const pairs = [1, 1, 2, 3, 3, 3][stage];
  let leaves = '';
  for (let i = 0; i < pairs; i++) {
    const t = stage === 0 ? 1 : 0.3 + (i / Math.max(pairs, 2)) * 0.6;
    const [x, y] = at(t);
    const size = (stage === 0 ? 0.45 : 0.75 + (pairs - i) * 0.12) * (stage >= 2 ? 1.15 : 1);
    const angle = -28 + wilt * 26 + i * 4;
    for (const side of [1, -1]) {
      leaves += `<path d="M0 0 Q10 -9 24 -3 Q13 6 0 0 Z" fill="${LEAF[wilt]}" stroke="${LEAF_EDGE[wilt]}" stroke-width="1.2"
        transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${side * size} ${size}) rotate(${angle})"/>`;
    }
  }

  // Buds (stage 4) and flowers (stage 5), at the top and on two side shoots.
  const [tx, ty] = at(1);
  const [mx, my] = at(0.75);
  const spots = [[tx, ty, 1], [mx - 17, my - 8 + wilt * 4, 0.8], [mx + 17, my - 12 + wilt * 4, 0.8]];
  let blooms = '';
  if (stage >= 4) {
    spots.forEach(([x, y, s], i) => {
      if (i > 0) blooms += `<path d="M${mx.toFixed(1)} ${my.toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}" stroke="${LEAF_EDGE[wilt]}" stroke-width="2.4" stroke-linecap="round"/>`;
      if (stage === 4) {
        blooms += `<ellipse cx="${x.toFixed(1)}" cy="${(y - 3).toFixed(1)}" rx="${4 * s}" ry="${6 * s}" fill="${PETAL[wilt]}" stroke="${LEAF_EDGE[wilt]}" stroke-width="1.5"/>`;
        return;
      }
      const petals = wilt >= 2 ? 3 : 5;   // badly wilted flowers lose petals
      let flower = '';
      for (let k = 0; k < petals; k++) {
        const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
        flower += `<circle cx="${(Math.cos(a) * 6.5 * s).toFixed(1)}" cy="${(Math.sin(a) * 6.5 * s).toFixed(1)}" r="${5 * s}" fill="${PETAL[wilt]}"/>`;
      }
      flower += `<circle r="${4 * s}" fill="#ffd45a"/>`;
      blooms += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${wilt * 30})">${flower}</g>`;
    });
  }
  // A dropped petal on the floor when it's thirsty and was flowering.
  const fallen = stage === 5 && wilt >= 2 ? `<ellipse cx="78" cy="176" rx="4" ry="2.4" fill="${PETAL[wilt]}"/>` : '';

  return `<svg viewBox="0 0 100 180" aria-hidden="true">
    <g class="plant-top${wilt === 0 && stage > 0 ? ' is-swaying' : ''}">
      <path d="M50 134 Q${p1[0]} ${p1[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" fill="none"
        stroke="${LEAF_EDGE[wilt]}" stroke-width="${stage >= 3 ? 3.4 : 2.6}" stroke-linecap="round"/>
      ${leaves}${blooms}
    </g>
    <path d="M22 142 L78 142 L71 178 L29 178 Z" fill="#c8693f"/>
    <path d="M60 142 L78 142 L71 178 L62 178 Z" fill="#a9532f"/>
    <rect x="17" y="131" width="66" height="13" rx="3" fill="#d97c4f"/>
    <ellipse cx="50" cy="133" rx="29" ry="3.6" fill="#4a3020"/>
    ${fallen}
  </svg>`;
}

// What the little tag says when you click the plant.
export function plantMessage({ growth, missed, streak }) {
  if (growth === 0) return 'Just a seed. Study today and it sprouts!';
  const stage = STAGE_NAMES[stageFor(growth)];
  if (missed) return `Thirsty! You missed ${missed} day${missed === 1 ? '' : 's'}. Study to perk it up.`;
  return `${streak}-day streak! It's ${stage}.`;
}

// ---------- On the page ----------
export function renderPlant() {
  const el = document.querySelector('.plant');
  if (!el) return;
  const state = plantState();
  const stage = stageFor(state.growth);
  const wilt = Math.min(state.missed, 3);
  el.querySelector('.plant-art').innerHTML = plantSvg(stage, wilt);
  el.dataset.stage = stage;
  el.dataset.wilt = wilt;
  el.setAttribute('aria-label', `Study plant: ${plantMessage(state)}`);
}

let tagTimer;
function showTag() {
  const el = document.querySelector('.plant');
  const tag = el.querySelector('.plant-tag');
  tag.textContent = plantMessage(plantState());
  tag.classList.add('is-shown');
  el.classList.remove('is-wiggling');
  void el.offsetWidth;   // restart the wiggle
  el.classList.add('is-wiggling');
  clearTimeout(tagTimer);
  tagTimer = setTimeout(() => tag.classList.remove('is-shown'), 3200);
}

export function initPlant() {
  document.querySelector('.plant').addEventListener('click', e => {
    e.stopPropagation();   // not a knock
    showTag();
  });
  document.addEventListener('historychange', renderPlant);
  renderPlant();
}

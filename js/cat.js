// The cat flap (bought in the Store): a cat lives behind the door. During a
// study session it pokes its head out now and then to keep you company.
// Click it to boop its nose (it meows); rub it with the mouse to pet it (it
// purrs, closes its eyes and hearts float up). Tap the flap to call it out.
import { DEMO_MODE } from './config.js';
import { isOn } from './decor.js';
import { playMeow, playPurr } from './sound.js';

// How often it visits during a session, and how long it stays (ms).
const GAP_MIN = DEMO_MODE ? 12000 : 3 * 60000;
const GAP_MAX = DEMO_MODE ? 25000 : 8 * 60000;
const STAY = 8000;
const PET_EXTRA = 5000;   // petting it makes it stay a bit longer
const MAX_STAY = 30000;
const RUB_DISTANCE = 140; // px of rubbing that counts as one pet

const wait = ms => new Promise(r => setTimeout(r, ms));
const between = (a, b) => a + Math.random() * (b - a);

export const CAT_SVG = `
  <svg class="cat-art" viewBox="-60 -56 120 104" aria-hidden="true">
    <g class="cat-ear cat-ear-l"><path d="M-42 -16 L-38 -54 L-10 -34 Z" fill="#e8913a"/><path d="M-36 -24 L-34 -45 L-18 -34 Z" fill="#f6b7b0"/></g>
    <g class="cat-ear cat-ear-r"><path d="M42 -16 L38 -54 L10 -34 Z" fill="#e8913a"/><path d="M36 -24 L34 -45 L18 -34 Z" fill="#f6b7b0"/></g>
    <ellipse cx="0" cy="0" rx="48" ry="39" fill="#f0a04b"/>
    <path d="M-9 -38 L-7 -25 M0 -39 L0 -23 M9 -38 L7 -25" stroke="#c9712a" stroke-width="4" stroke-linecap="round"/>
    <path d="M-48 -2 L-36 0 M-47 7 L-37 7 M48 -2 L36 0 M47 7 L37 7" stroke="#c9712a" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="-9" cy="15" rx="12" ry="9" fill="#fbe3c4"/>
    <ellipse cx="9" cy="15" rx="12" ry="9" fill="#fbe3c4"/>
    <g class="cat-eyes">
      <ellipse cx="-18" cy="-4" rx="9.5" ry="10.5" fill="#c8e86a"/>
      <ellipse cx="18" cy="-4" rx="9.5" ry="10.5" fill="#c8e86a"/>
      <g class="cat-pupils">
        <ellipse cx="-18" cy="-4" rx="3.6" ry="8.4" fill="#1d1d1d"/>
        <ellipse cx="18" cy="-4" rx="3.6" ry="8.4" fill="#1d1d1d"/>
        <circle cx="-15.5" cy="-8" r="2.2" fill="#fff"/>
        <circle cx="20.5" cy="-8" r="2.2" fill="#fff"/>
      </g>
    </g>
    <g class="cat-happy" fill="none" stroke="#3a2412" stroke-width="3.6" stroke-linecap="round">
      <path d="M-27 -2 Q-18 -12 -9 -2"/><path d="M9 -2 Q18 -12 27 -2"/>
    </g>
    <g class="cat-blush" fill="#ff8f9f" opacity="0.6"><ellipse cx="-30" cy="10" rx="7" ry="4"/><ellipse cx="30" cy="10" rx="7" ry="4"/></g>
    <path d="M-5 7 L5 7 L0 12.5 Z" fill="#e57a8a"/>
    <path class="cat-mouth" d="M0 12.5 Q-5 20 -10 16 M0 12.5 Q5 20 10 16" stroke="#3a2412" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse class="cat-meow" cx="0" cy="20" rx="6" ry="7" fill="#7a2c3a"/>
    <g stroke="#fff6e8" stroke-width="1.4" stroke-linecap="round" opacity="0.9">
      <path d="M-16 14 L-44 9 M-16 18 L-44 20 M16 14 L44 9 M16 18 L44 20"/>
    </g>
    <g class="cat-paws">
      <ellipse cx="-22" cy="40" rx="12" ry="7.5" fill="#f0a04b"/>
      <ellipse cx="22" cy="40" rx="12" ry="7.5" fill="#f0a04b"/>
      <path d="M-26 38 L-26 44 M-19 38 L-19 44 M19 38 L19 44 M26 38 L26 44" stroke="#c9712a" stroke-width="1.6" stroke-linecap="round"/>
    </g>
  </svg>`;

let flap;          // the .cat-flap element on the door
let canAppear = () => true;
let out = false;
let leaveAt = 0;
let visitTimer = null;
let sessionOn = false;

export function initCat(door, { canAppear: check }) {
  canAppear = check;
  flap = door.scene.querySelector('.cat-flap');
  flap.querySelector('.cat').innerHTML = CAT_SVG;
  const cat = flap.querySelector('.cat');

  // Tapping the flap calls the cat out (it's not a knock on the door).
  flap.addEventListener('click', e => {
    e.stopPropagation();
    if (!out) visit();
  });

  // Boop vs pet: a click without much movement is a boop; moving the pointer
  // across the cat (button pressed or not) is petting.
  let rubbed = 0;
  let pressMoved = 0;
  let lastPoint = null;
  cat.addEventListener('pointerdown', () => { pressMoved = 0; });
  cat.addEventListener('pointermove', e => {
    if (!out) return;
    if (lastPoint) {
      const d = Math.hypot(e.clientX - lastPoint.x, e.clientY - lastPoint.y);
      rubbed += d;
      pressMoved += d;
    }
    lastPoint = { x: e.clientX, y: e.clientY };
    if (rubbed >= RUB_DISTANCE) {
      rubbed = 0;
      pet();
    }
  });
  cat.addEventListener('pointerleave', () => { lastPoint = null; });
  cat.addEventListener('click', e => {
    e.stopPropagation();
    if (out && pressMoved < 10) boop();
  });
}

// ---------- Visits during a session ----------

export function startCatVisits() {
  sessionOn = true;
  scheduleVisit();
}

export function stopCatVisits() {
  sessionOn = false;
  clearTimeout(visitTimer);
  hideCat();
}

function scheduleVisit() {
  clearTimeout(visitTimer);
  if (sessionOn) visitTimer = setTimeout(visit, between(GAP_MIN, GAP_MAX));
}

async function visit() {
  if (out || !isOn('cat-flap')) return scheduleVisit();
  if (!canAppear()) {   // the door is busy: try again shortly
    clearTimeout(visitTimer);
    visitTimer = setTimeout(visit, 3000);
    return;
  }
  out = true;
  leaveAt = Date.now() + STAY;
  flap.classList.add('is-out');
  if (Math.random() < 0.5) {   // sometimes it says hello
    await wait(700);
    meow();
  }
  while (out && Date.now() < leaveAt) await wait(250);
  hideCat();
  scheduleVisit();
}

// Back through the flap (also used when the door is about to open).
export function hideCat() {
  if (!flap || !out) return;
  out = false;
  flap.classList.remove('is-out', 'is-happy', 'is-meowing');
}

// ---------- Reactions ----------

let moodTimer;
function setMood(mood, ms) {
  flap.classList.remove('is-happy', 'is-meowing');
  flap.classList.add(mood);
  clearTimeout(moodTimer);
  moodTimer = setTimeout(() => flap.classList.remove(mood), ms);
}

function meow(kind = 'meow') {
  if (!out) return;
  setMood('is-meowing', kind === 'chirp' ? 400 : 800);
  playMeow(kind);
}

// A boop on the nose: a surprised little "mrrp!".
function boop() {
  meow('chirp');
  leaveAt = Math.min(leaveAt + PET_EXTRA / 2, Date.now() + MAX_STAY);
}

// Petting: happy closed eyes, a purr, and hearts.
let lastPurr = 0;
function pet() {
  setMood('is-happy', 1800);
  if (Date.now() - lastPurr > 1600) {
    lastPurr = Date.now();
    playPurr();
  }
  heart();
  leaveAt = Math.min(Math.max(leaveAt, Date.now()) + PET_EXTRA, Date.now() + MAX_STAY);
}

function heart() {
  const h = document.createElement('span');
  h.className = 'cat-heart';
  h.textContent = '♥';
  h.style.left = `${between(20, 80)}%`;
  flap.append(h);
  setTimeout(() => h.remove(), 1300);
}

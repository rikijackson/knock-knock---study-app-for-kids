// Screen effects that break out of the scene: things flying at the screen
// in 3D, messes left on the screen (pie), the megaphone blast, and confetti.
import { playSound, playMegaphone } from './sound.js';

const wait = ms => new Promise(r => setTimeout(r, ms));

function shakeScreen() {
  document.body.classList.add('screen-shake');
  setTimeout(() => document.body.classList.remove('screen-shake'), 600);
}

// ---------- Flying at the screen ----------

// Something flies from a point on screen (her hand) straight at you,
// spinning and growing. size: how big it is when it reaches the glass
// (1 = fills the screen). Resolves when it hits.
export async function flyAtScreen(markup, from, { to = null, size = 1, ms = 700 } = {}) {
  const flight = document.createElement('div');
  flight.className = 'flight';
  flight.innerHTML = `<div class="flying-thing">${markup}</div>`;
  const thing = flight.firstElementChild;
  const target = to ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  thing.style.setProperty('--from-x', `${from.x - target.x}px`);
  thing.style.setProperty('--from-y', `${from.y - target.y}px`);
  thing.style.left = `${target.x}px`;
  thing.style.top = `${target.y}px`;
  thing.style.setProperty('--end-z', `${Math.round(620 * size)}px`);
  thing.style.animationDuration = `${ms}ms`;
  document.body.append(flight);
  await wait(ms);
  flight.remove();
}

// ---------- Messes left on the screen ----------

// A mess stuck to the screen. It drips, then slides away after a while;
// a click wipes it off sooner. at/size place a small mess at one spot;
// without them it covers the whole screen (pie).
export function addMess(markup, { at = null, size = null, lastMs = 6500 } = {}) {
  const mess = document.createElement('div');
  mess.className = 'mess' + (at ? ' mess-spot' : '');
  mess.innerHTML = markup;
  if (at) {
    mess.style.left = `${at.x}px`;
    mess.style.top = `${at.y}px`;
    mess.style.width = mess.style.height = `${size}px`;
  }
  document.body.append(mess);

  const wipe = () => {
    mess.classList.add('is-wiped');
    setTimeout(() => mess.remove(), 700);
  };
  mess.addEventListener('click', wipe, { once: true });
  setTimeout(() => { if (mess.isConnected) wipe(); }, lastMs);
  return mess;
}

// ---------- The mother's pie in the face ----------

const PIE_SVG = `
<svg viewBox="-60 -40 120 80" aria-hidden="true">
  <path d="M-52 -2 L52 -2 L44 26 Q0 34 -44 26 Z" fill="#b47b3b"/>
  <path d="M-30 0 L-28 27 M-14 0 L-13 30 M2 0 L2 31 M18 0 L17 30 M33 0 L31 27" stroke="#8e5d2a" stroke-width="3"/>
  <ellipse cx="0" cy="-2" rx="54" ry="13" fill="#d9a45e"/>
  <path d="M-46 -4 Q-48 -22 -30 -24 Q-26 -38 -8 -34 Q2 -46 16 -36 Q34 -40 36 -24 Q50 -20 46 -4 Q0 6 -46 -4 Z" fill="#fbf7ef"/>
  <path d="M10 -36 Q30 -38 36 -24 Q48 -20 46 -4 Q30 0 18 -2 Q30 -18 10 -36 Z" fill="#e7dfd0"/>
  <circle cx="-14" cy="-20" r="5" fill="#4b4a9c"/>
  <circle cx="6" cy="-26" r="5" fill="#4b4a9c"/>
  <circle cx="22" cy="-16" r="5" fill="#4b4a9c"/>
  <circle cx="-4" cy="-30" r="2" fill="#ffffff" opacity="0.7"/>
</svg>`;

const PIE_MESS_SVG = `
<svg viewBox="-500 -340 1000 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <g class="mess-drips" fill="#fbf7ef">
    <path d="M-170 100 L-146 100 L-149 300 Q-158 324 -167 300 Z"/>
    <path d="M40 120 L68 120 L64 330 Q54 356 44 330 Z"/>
    <path d="M210 80 L230 80 L228 270 Q220 290 212 270 Z"/>
    <path d="M-40 150 L-22 150 L-24 300 Q-31 316 -38 300 Z"/>
  </g>
  <path fill="#fbf7ef" d="M-300 -60 Q-330 -180 -200 -200 Q-150 -300 -30 -250 Q60 -320 150 -240
    Q280 -270 300 -150 Q400 -110 330 -10 Q380 90 260 120 Q220 220 100 170 Q0 250 -90 180
    Q-200 230 -250 130 Q-380 120 -330 20 Q-400 -40 -300 -60 Z"/>
  <path fill="#e7dfd0" d="M120 -230 Q280 -260 300 -150 Q400 -110 330 -10 Q380 90 260 120
    Q220 220 100 170 Q200 120 250 20 Q290 -100 120 -230 Z"/>
  <circle cx="-400" cy="-210" r="34" fill="#fbf7ef"/>
  <circle cx="420" cy="-240" r="26" fill="#fbf7ef"/>
  <circle cx="380" cy="230" r="30" fill="#fbf7ef"/>
  <circle cx="-420" cy="200" r="22" fill="#fbf7ef"/>
  <circle cx="-300" cy="-270" r="14" fill="#fbf7ef"/>
  <path fill="#4b4a9c" d="M-120 -40 Q-80 -110 -10 -70 Q40 -100 70 -40 Q120 0 60 40 Q10 90 -50 50 Q-140 40 -120 -40 Z"/>
  <path fill="#353474" d="M10 -70 Q40 -100 70 -40 Q120 0 60 40 Q80 -10 10 -70 Z"/>
  <circle cx="-180" cy="-110" r="16" fill="#4b4a9c"/>
  <circle cx="170" cy="-120" r="14" fill="#4b4a9c"/>
  <circle cx="190" cy="70" r="18" fill="#4b4a9c"/>
  <circle cx="-210" cy="80" r="12" fill="#4b4a9c"/>
  <g fill="#d9a45e">
    <path d="M-260 -150 l22 -6 l6 16 l-20 8 Z"/>
    <path d="M240 -60 l24 4 l-4 18 l-22 -6 Z"/>
    <path d="M-60 120 l18 -8 l10 14 l-18 10 Z"/>
    <path d="M300 160 l16 2 l-2 14 l-16 -4 Z"/>
    <path d="M-350 -40 l14 -4 l4 12 l-14 4 Z"/>
  </g>
  <path d="M-220 -150 Q-170 -200 -100 -190" stroke="#ffffff" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.8"/>
</svg>`;

export async function throwPie(from) {
  await flyAtScreen(PIE_SVG, from);
  playSound('bang');
  shakeScreen();
  addMess(PIE_MESS_SVG);
}

// ---------- The soldier's megaphone: his order blasts across the screen ----------

// Sound-wave rings burst out of the megaphone, the screen shakes, and the
// words slam in one at a time, then fade.
export async function megaphoneBlast(from, order) {
  const words = order.split(' ');
  const layer = document.createElement('div');
  layer.className = 'blast';
  layer.innerHTML = `<div class="blast-words"></div>`;
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('i');
    ring.className = 'blast-ring';
    ring.style.left = `${from.x}px`;
    ring.style.top = `${from.y}px`;
    ring.style.animationDelay = `${i * 160}ms`;
    layer.append(ring);
  }
  document.body.append(layer);
  const box = layer.querySelector('.blast-words');

  for (const word of words) {
    playMegaphone();
    shakeScreen();
    const w = document.createElement('span');
    w.textContent = word;
    box.append(w);
    await wait(520);
  }
  await wait(1300);
  layer.classList.add('is-fading');
  await wait(600);
  layer.remove();
}

// ---------- Confetti ----------

const CONFETTI_COLORS = ['#e0b44c', '#6a9df5', '#4fc2d0', '#f4f8fc', '#e56b8a', '#9fd77a', '#b48cf0'];

// mode 'rain': falls from the top across the whole screen.
// mode 'burst': explodes out from a point, then falls.
export function confetti({ mode = 'rain', at = null, count = 140 } = {}) {
  const layer = document.createElement('div');
  layer.className = 'confetti';
  const origin = at ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('i');
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.setProperty('--spin', `${(Math.random() * 2 - 1) * 900}deg`);
    piece.style.animationDelay = `${Math.random() * (mode === 'rain' ? 1200 : 120)}ms`;
    if (i % 3 === 0) piece.style.borderRadius = '50%';
    if (mode === 'rain') {
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = '-20px';
      piece.style.setProperty('--dx', `${(Math.random() * 2 - 1) * 80}px`);
      piece.style.setProperty('--dy', '0px');
      piece.classList.add('rain');
    } else {
      const a = Math.random() * Math.PI * 2;
      const d = 120 + Math.random() * Math.min(window.innerWidth, window.innerHeight) * 0.55;
      piece.style.left = `${origin.x}px`;
      piece.style.top = `${origin.y}px`;
      piece.style.setProperty('--dx', `${Math.cos(a) * d}px`);
      piece.style.setProperty('--dy', `${Math.sin(a) * d - 80}px`);
      piece.classList.add('burst');
    }
    layer.append(piece);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 4500);
}

// The soldier's confetti bomb: it flies at you and BOOM.
const BOMB_SVG = `
<svg viewBox="-30 -36 60 66" aria-hidden="true">
  <circle cx="0" cy="4" r="24" fill="#22361e"/>
  <path d="M6 -18 Q14 -30 24 -28" stroke="#8b96a1" stroke-width="4" fill="none"/>
  <circle cx="24" cy="-28" r="5" fill="#e0b44c"/>
  <path d="M-10 -6 Q-4 -14 6 -12" stroke="#4a6e43" stroke-width="5" stroke-linecap="round" fill="none"/>
</svg>`;

export async function throwConfettiBomb(from) {
  await flyAtScreen(BOMB_SVG, from, { size: 0.45, ms: 650 });
  playSound('bang');
  shakeScreen();
  confetti({ mode: 'burst', count: 180 });
}

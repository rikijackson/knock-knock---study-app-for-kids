// The door: draws the door scene and opens/closes it.

import { playSound } from './sound.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// The scene is a 500 x 720 box. The doorway is x 110–390, y 80–680.
// Back layer (one SVG): floor shadow, frame, dark doorway, character slot.
// Middle: the door itself, a separate element so it can swing in 3D.
// Front layer: a second character slot, in front of the door.
const DOOR_HTML = `
<div class="door-scene" role="button" tabindex="0" aria-label="The door. Click to knock.">
  <svg class="door-back" viewBox="0 0 500 720" xmlns="${SVG_NS}">
    <ellipse class="floor-shadow" cx="250" cy="690" rx="230" ry="18"/>
    <rect class="door-frame" x="88" y="58" width="324" height="632"/>
    <polygon class="door-frame-shade" points="390,80 412,58 412,690 390,690"/>
    <rect class="doorway" x="110" y="80" width="280" height="600"/>
    <!-- Fairy lights (bought in the Store): they light up bulb by bulb during a session -->
    <g class="decor decor-fairy-lights">
      <path d="M80 420 Q72 385 80 350 Q72 315 80 280 Q72 245 80 210 Q72 175 80 140 Q72 94 80 48 Q108 58 136 48 Q165 58 194 48 Q222 58 250 48 Q278 58 306 48 Q335 58 364 48 Q392 58 420 48 Q428 94 420 140 Q428 175 420 210 Q428 245 420 280 Q428 315 420 350 Q428 385 420 420" fill="none" stroke="#2c323d" stroke-width="2.5"/>
      <g class="bulb bulb-a"><rect x="77" y="418" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="80" cy="430" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-b"><rect x="77" y="348" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="80" cy="360" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-c"><rect x="77" y="278" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="80" cy="290" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-d"><rect x="77" y="208" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="80" cy="220" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-a"><rect x="77" y="138" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="80" cy="150" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-b"><rect x="77" y="46" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="80" cy="58" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-c"><rect x="133" y="46" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="136" cy="58" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-d"><rect x="191" y="46" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="194" cy="58" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-a"><rect x="247" y="46" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="250" cy="58" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-b"><rect x="303" y="46" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="306" cy="58" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-c"><rect x="361" y="46" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="364" cy="58" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-d"><rect x="417" y="46" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="420" cy="58" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-a"><rect x="417" y="138" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="420" cy="150" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-b"><rect x="417" y="208" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="420" cy="220" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-c"><rect x="417" y="278" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="420" cy="290" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-d"><rect x="417" y="348" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="420" cy="360" rx="6" ry="8.5"/></g>
      <g class="bulb bulb-a"><rect x="417" y="418" width="6" height="6" rx="1" fill="#3a4250"/><ellipse class="glass" cx="420" cy="430" rx="6" ry="8.5"/></g>
    </g>

    <!-- Halloween (bought in the Store): a cobweb in the corner, bats, a pumpkin -->
    <g class="decor decor-halloween">
      <g stroke="rgba(230, 236, 245, 0.75)" stroke-width="2" fill="none">
        <path d="M88 58 L190 58 M88 58 L88 160 M88 58 L168 138 M88 58 L140 150 M88 58 L180 100"/>
        <path d="M118 58 Q112 76 88 84 M150 58 Q140 92 88 112 M180 58 Q168 110 88 140"/>
      </g>
      <g class="bat" fill="#1a1420"><path d="M440 70 Q452 58 462 70 Q470 62 478 70 Q468 72 462 80 Q456 72 440 70 Z"/></g>
      <g class="bat bat-2" fill="#1a1420"><path d="M20 120 Q30 110 38 120 Q45 113 52 120 Q44 122 38 128 Q32 122 20 120 Z"/></g>
      <!-- a jack-o'-lantern: ribbed segments, a curly stem, a glowing carved face -->
      <ellipse cx="458" cy="688" rx="40" ry="8" fill="rgba(0,0,0,0.3)"/>
      <ellipse cx="434" cy="662" rx="18" ry="25" fill="#c4581a"/>
      <ellipse cx="482" cy="662" rx="18" ry="25" fill="#b3501a"/>
      <ellipse cx="446" cy="662" rx="17" ry="27" fill="#e0702a"/>
      <ellipse cx="471" cy="662" rx="17" ry="27" fill="#d0661f"/>
      <ellipse cx="458" cy="662" rx="15" ry="28" fill="#f08a36"/>
      <path d="M444 640 Q440 654 443 676" stroke="#f6a35c" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
      <path d="M456 636 Q454 626 460 618 Q466 614 470 618" stroke="#4f7a36" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M470 618 Q476 612 474 606" stroke="#4f7a36" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g class="pumpkin-face" fill="#ffd45a">
        <path d="M441 656 L448 645 L454 656 Z"/>
        <path d="M462 656 L468 645 L475 656 Z"/>
        <path d="M455 662 L458 657 L461 662 Z"/>
        <path d="M440 668 Q458 684 476 668 Q472 676 468 672 L465 678 L461 672 L458 678 L455 672 L451 678 L448 672 Q444 676 440 668 Z"/>
      </g>
    </g>

    <!-- The character stands here, between the feet at (210, 680). -->
    <g class="char-slot" transform="translate(210 680)"></g>
  </svg>

  <div class="door-panel">
    <svg viewBox="0 0 280 600" preserveAspectRatio="none" xmlns="${SVG_NS}">
      <rect class="door-body" x="0" y="0" width="280" height="600"/>
      <polygon class="door-shade" points="190,0 280,0 280,600 230,600"/>
      <rect class="door-inset" x="36" y="40" width="208" height="230" rx="4"/>
      <rect class="door-inset" x="36" y="310" width="208" height="250" rx="4"/>
      <polygon class="door-shade" points="190,40 244,40 244,270 220,270"/>
      <polygon class="door-shade" points="190,310 244,310 244,560 220,560"/>
      <circle class="door-knob" cx="246" cy="300" r="11"/>
      <circle class="door-shade" cx="249" cy="303" r="5"/>

      <!-- decorations on the door itself (bought in the Store) -->
      <g class="decor decor-nameplate">
        <rect x="62" y="276" width="156" height="40" rx="8" fill="#c9a85a"/>
        <rect x="68" y="282" width="144" height="28" rx="5" fill="none" stroke="#9c7d3c" stroke-width="2"/>
        <text class="nameplate-text" x="140" y="303" text-anchor="middle" font-size="19" font-weight="700"
              font-family="Georgia, 'Times New Roman', serif" fill="#3a2a10">Your name</text>
      </g>
      <g class="decor decor-christmas">
        <circle cx="140" cy="155" r="58" fill="none" stroke="#2f6b3a" stroke-width="26"/>
        <circle cx="140" cy="155" r="58" fill="none" stroke="#3d8a4a" stroke-width="12" stroke-dasharray="10 14"/>
        ${[0, 50, 100, 150, 200, 250, 300].map(a => `<circle cx="${140 + Math.cos(a * Math.PI / 180) * 58}" cy="${155 + Math.sin(a * Math.PI / 180) * 58}" r="5.5" fill="#d63c3c"/>`).join('')}
        <path d="M140 205 L112 228 L118 196 Z M140 205 L168 228 L162 196 Z" fill="#d63c3c"/>
        <circle cx="140" cy="203" r="10" fill="#b52e2e"/>
      </g>
    </svg>
    <div class="door-edge"></div>
    <div class="door-notes"></div>
  </div>

  <!-- The doorbell (bought in the Store), on the wall beside the frame -->
  <button type="button" class="doorbell decor" aria-label="Ring the doorbell">
    <svg viewBox="0 0 40 60" aria-hidden="true">
      <rect x="4" y="2" width="32" height="56" rx="8" fill="#c9a85a"/>
      <rect x="8" y="6" width="24" height="48" rx="6" fill="none" stroke="#9c7d3c" stroke-width="2"/>
      <circle cx="20" cy="30" r="10" fill="#f4e7c3"/><circle cx="20" cy="30" r="6" fill="#e9d29a"/>
    </svg>
  </button>

  <!-- Sticky-note tasks (bought in the Store) go on the door during a session -->

  <!-- In front of the door: where a character stands once fully out (finale). -->
  <svg class="door-front" viewBox="0 0 500 720" xmlns="${SVG_NS}">
    <g class="char-slot-front" transform="translate(210 680)"></g>
  </svg>
</div>`;

// How far the door can open (see door.css): a crack, a gap (the intro's
// knocks), ajar (peeking out), intro (the first hello), or wide (finales).
const OPEN_CLASSES = ['door--crack', 'door--gap', 'door--ajar', 'door--intro', 'door--wide'];

// Wait for the door's swing to finish (with a safety timeout).
function waitForSwing(panel) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, 2400);
    const onEnd = e => {
      if (e.target !== panel || e.propertyName !== 'transform') return;
      clearTimeout(timer);
      panel.removeEventListener('transitionend', onEnd);
      resolve();
    };
    panel.addEventListener('transitionend', onEnd);
  });
}

export function createDoor(container) {
  container.innerHTML = DOOR_HTML;
  const scene = container.querySelector('.door-scene');
  const panel = scene.querySelector('.door-panel');
  const slot = scene.querySelector('.char-slot');
  const frontSlot = scene.querySelector('.char-slot-front');

  const door = {
    scene,
    characterEl: null,

    // Put a character (SVG markup) behind the door, or nobody (null).
    setCharacter(markup) {
      frontSlot.innerHTML = '';
      slot.innerHTML = markup ?? '';
      door.characterEl = slot.firstElementChild;
    },

    // Step in front of the door (out into the room), or back behind it.
    bringToFront() {
      if (door.characterEl) frontSlot.append(door.characterEl);
    },
    sendBack() {
      if (door.characterEl) slot.append(door.characterEl);
    },

    // amount: 'crack', 'gap', 'ajar', 'intro' or 'wide' (see OPEN_CLASSES)
    async open(amount = 'ajar') {
      scene.classList.remove(...OPEN_CLASSES);
      scene.classList.add(`door--${amount}`);
      await waitForSwing(panel);
    },

    // A normal close: the bang plays softly the moment it meets the frame.
    async close() {
      const wasOpen = door.isOpen();
      scene.classList.remove(...OPEN_CLASSES);
      await waitForSwing(panel);
      if (wasOpen) playSound('bang', { volume: 0.45 });
    },

    isOpen() {
      return OPEN_CLASSES.some(c => scene.classList.contains(c));
    },

    // Shut it hard: a fast swing and a full-volume BANG.
    // { angry: true } also shakes the whole screen.
    async slam({ angry = false } = {}) {
      scene.classList.add('door--slam');
      scene.classList.remove(...OPEN_CLASSES);
      await waitForSwing(panel);
      playSound('bang');
      if (angry) {
        document.body.classList.add('screen-shake');
        await new Promise(r => setTimeout(r, 600));
        document.body.classList.remove('screen-shake');
      }
      scene.classList.remove('door--slam');
    },

    // Clicking or pressing Enter/Space on the door (or ringing the doorbell)
    // counts as a knock. Sticky notes on the door don't.
    onKnock(handler) {
      scene.addEventListener('click', e => {
        if (e.target.closest('.sticky-note')) return;
        handler();
      });
      scene.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    },
  };

  return door;
}

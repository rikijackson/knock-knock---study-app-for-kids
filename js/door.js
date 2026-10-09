// The door: draws the door scene and opens/closes it.

const SVG_NS = 'http://www.w3.org/2000/svg';

// The scene is a 500 x 720 box. The doorway is x 110–390, y 80–680.
// Back layer (one SVG): floor shadow, frame, dark doorway, character slot.
// Front layer: the door itself, a separate element so it can swing in 3D.
const DOOR_HTML = `
<div class="door-scene" role="button" tabindex="0" aria-label="The door. Click to knock.">
  <svg class="door-back" viewBox="0 0 500 720" xmlns="${SVG_NS}">
    <ellipse class="floor-shadow" cx="250" cy="690" rx="230" ry="18"/>
    <rect class="door-frame" x="88" y="58" width="324" height="632"/>
    <polygon class="door-frame-shade" points="390,80 412,58 412,690 390,690"/>
    <rect class="doorway" x="110" y="80" width="280" height="600"/>
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
    </svg>
    <div class="door-edge"></div>
  </div>
</div>`;

// Wait for the door's swing to finish (with a safety timeout).
function waitForSwing(panel) {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, 1400);
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

  const door = {
    scene,
    characterEl: null,

    // Put a character (SVG markup) behind the door.
    setCharacter(markup) {
      slot.innerHTML = markup;
      door.characterEl = slot.firstElementChild;
    },

    // amount: 'crack' (just a little) or 'ajar' (wide enough to peek out)
    async open(amount = 'ajar') {
      scene.classList.remove('door--crack', 'door--ajar');
      scene.classList.add(`door--${amount}`);
      await waitForSwing(panel);
    },

    async close() {
      scene.classList.remove('door--crack', 'door--ajar');
      await waitForSwing(panel);
    },

    // Clicking or pressing Enter/Space on the door counts as a knock.
    onKnock(handler) {
      scene.addEventListener('click', handler);
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

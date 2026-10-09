// Speech bubbles: show a line, optionally with answer buttons,
// and hand back whichever answer was picked. The bubble's tail stays
// pinned to whoever is talking, following them as they move.

let bubble;
let stage;
let getAnchor;   // returns the screen point the tail should touch
let following = false;

// anchorFn() → { x, y } in screen pixels.
export function initDialogue(stageEl, anchorFn) {
  stage = stageEl;
  getAnchor = anchorFn;
  bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.setAttribute('role', 'dialog');
  bubble.setAttribute('aria-live', 'polite');
  stage.append(bubble);
}

const TAIL = `<svg class="bubble-tail" viewBox="0 0 30 22" aria-hidden="true">
  <path class="bubble-tail-fill" d="M9 0 L28 0 L2 21 Z"/>
  <path class="bubble-tail-line" d="M28 1 L2 21 L9 1"/>
</svg>`;

// Put the bubble so its tail tip lands on the anchor point.
function position() {
  const tip = getAnchor();
  if (!tip) return;
  const box = stage.getBoundingClientRect();
  const scale = box.width / stage.offsetWidth;   // the stage shrinks while studying
  const x = (tip.x - box.left) / scale;
  const y = (tip.y - box.top) / scale;
  bubble.style.left = `${x + 2}px`;
  bubble.style.top = `${y - bubble.offsetHeight - 18}px`;
}

function follow() {
  if (!following) return;
  position();
  requestAnimationFrame(follow);
}

function show(text) {
  bubble.innerHTML = TAIL;
  const p = document.createElement('p');
  p.className = 'bubble-text';
  p.textContent = text;
  bubble.append(p);
  position();
  bubble.classList.add('is-open');
  if (!following) {
    following = true;
    requestAnimationFrame(follow);
  }
}

// Just a line, no buttons (check-ins).
export function say(text) {
  show(text);
}

export function hideBubble() {
  bubble.classList.remove('is-open');
  following = false;
}

// Ask a question. Each choice is { label, value, disabled?, note?, input? }.
// A choice with `input: { min, max, unit }` asks for a number instead,
// and resolves with that number.
export function ask(text, choices) {
  show(text);
  return new Promise(resolve => {
    const row = document.createElement('div');
    row.className = 'bubble-choices';

    const finish = value => {
      hideBubble();
      resolve(value);
    };

    for (const choice of choices) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice';
      btn.textContent = choice.label;
      if (choice.note) {
        const note = document.createElement('span');
        note.className = 'choice-note';
        note.textContent = choice.note;
        btn.append(note);
      }
      if (choice.disabled) {
        btn.disabled = true;
        btn.classList.add('is-locked');
      }
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (choice.input) askNumber(row, choice.input, finish);
        else finish(choice.value);
      });
      row.append(btn);
    }

    bubble.append(row);
    position();
    row.querySelector('button:not(:disabled)')?.focus();
  });
}

// Swap the buttons for a number box + OK.
function askNumber(row, { min = 1, max = 600, unit = 'min' }, finish) {
  row.innerHTML = '';
  const form = document.createElement('form');
  form.className = 'bubble-number';
  form.innerHTML = `
    <input type="number" min="${min}" max="${max}" step="1" required aria-label="Number of minutes">
    <span>${unit}</span>
    <button type="submit" class="choice">OK</button>`;
  form.addEventListener('click', e => e.stopPropagation());
  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = Math.round(Number(form.querySelector('input').value));
    if (value >= min && value <= max) finish(value);
  });
  row.append(form);
  position();
  form.querySelector('input').focus();
}

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

// Put the bubble so its tail tip lands on the anchor point, but always
// inside the window: if there's no room above, it flips below the speaker,
// and if it would run off an edge it slides back in (the tail slides too,
// so it still points at the speaker).
const MARGIN = 10;
function position() {
  const tip = getAnchor();
  if (!tip) return;
  const box = stage.getBoundingClientRect();
  const scale = box.width / stage.offsetWidth;   // the stage shrinks while studying
  const w = bubble.offsetWidth * scale;
  const h = bubble.offsetHeight * scale;

  // Work in window pixels first.
  let left = tip.x + 2 * scale;
  let top = tip.y - h - 18 * scale;
  const below = top < MARGIN;
  if (below) top = tip.y + 18 * scale;
  left = Math.min(left, window.innerWidth - w - MARGIN);
  left = Math.max(left, MARGIN);
  top = Math.min(top, window.innerHeight - h - MARGIN);

  // The tail's tip sits 2px left of the tail box; keep it on the bubble's edge.
  const tailX = (tip.x - left) / scale - 2;
  const maxTail = bubble.offsetWidth - 34;
  bubble.style.setProperty('--tail-x', `${Math.min(Math.max(tailX, -4), maxTail)}px`);
  bubble.classList.toggle('is-below', below);

  // Then into the stage's own (possibly shrunk) coordinates.
  bubble.style.left = `${(left - box.left) / scale}px`;
  bubble.style.top = `${(top - box.top) / scale}px`;
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

// What a question resolves with when "← Back" is pressed.
export const BACK = Symbol('back');

function backButton(onBack) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'choice choice-back';
  btn.textContent = '← Back';
  btn.addEventListener('click', e => { e.stopPropagation(); onBack(); });
  return btn;
}

// Ask a question. Each choice is { label, value, disabled?, note?, input? }.
// A choice with `input: { min, max, unit }` asks for a number instead,
// and resolves with that number. With { back: true } there's a "← Back"
// button, which resolves with BACK.
export function ask(text, choices, { back = false } = {}) {
  show(text);
  return new Promise(resolve => {
    const row = document.createElement('div');
    row.className = 'bubble-choices';

    const finish = value => {
      hideBubble();
      resolve(value);
    };

    // Draw the answer buttons (again, when coming back from a number box).
    const showChoices = () => {
      row.innerHTML = '';
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
          if (choice.input) askNumber(row, choice.input, finish, showChoices);
          else finish(choice.value);
        });
        row.append(btn);
      }
      if (back) row.append(backButton(() => finish(BACK)));
      position();
      row.querySelector('button:not(:disabled)')?.focus();
    };

    bubble.append(row);
    showChoices();
  });
}

// Swap the buttons for a number box + OK; "← Back" returns to the buttons.
function askNumber(row, { min = 1, max = 600, unit = 'min' }, finish, showChoices) {
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
  row.append(backButton(showChoices));
  position();
  form.querySelector('input').focus();
}

// Ask with a checklist: tick any of `items` ({ id, text, checked? }).
// options: { allowAdd, confirmLabel, skipLabel, emptyText, back }
// Resolves with { ids: [...ticked ids], added: [...new texts] }, or BACK.
export function askChecklist(text, items, options = {}) {
  const {
    allowAdd = false,
    confirmLabel = 'OK',
    skipLabel = null,
    emptyText = '',
    back = false,
  } = options;
  show(text);

  return new Promise(resolve => {
    const box = document.createElement('div');
    box.className = 'bubble-checklist';
    box.addEventListener('click', e => e.stopPropagation());

    const list = document.createElement('ul');
    const added = [];

    const addRow = (id, label, checked) => {
      const li = document.createElement('li');
      li.innerHTML = '<label><input type="checkbox"><span></span></label>';
      const input = li.querySelector('input');
      input.value = id;
      input.checked = checked;
      li.querySelector('span').textContent = label;
      list.append(li);
    };

    for (const item of items) addRow(item.id, item.text, Boolean(item.checked));
    if (!items.length && emptyText) {
      const p = document.createElement('p');
      p.className = 'bubble-empty';
      p.textContent = emptyText;
      box.append(p);
    }
    box.append(list);

    if (allowAdd) {
      const form = document.createElement('form');
      form.className = 'bubble-add';
      form.innerHTML = `
        <input type="text" maxlength="80" placeholder="Add a task…" aria-label="New task">
        <button type="submit" class="choice">Add</button>`;
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input');
        const value = input.value.trim();
        if (!value) return;
        added.push(value);
        addRow(`new:${added.length - 1}`, value, true);
        input.value = '';
        input.focus();
        position();
      });
      box.append(form);
    }

    const row = document.createElement('div');
    row.className = 'bubble-choices';
    const finish = skip => {
      hideBubble();
      if (skip) return resolve({ ids: [], added: [] });
      const ticked = [...list.querySelectorAll('input:checked')].map(i => i.value);
      resolve({
        ids: ticked.filter(v => !v.startsWith('new:')),
        added: ticked.filter(v => v.startsWith('new:')).map(v => added[Number(v.slice(4))]),
      });
    };
    const ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'choice';
    ok.textContent = confirmLabel;
    ok.addEventListener('click', e => { e.stopPropagation(); finish(false); });
    row.append(ok);
    if (skipLabel) {
      const skip = document.createElement('button');
      skip.type = 'button';
      skip.className = 'choice';
      skip.textContent = skipLabel;
      skip.addEventListener('click', e => { e.stopPropagation(); finish(true); });
      row.append(skip);
    }
    if (back) row.append(backButton(() => { hideBubble(); resolve(BACK); }));
    box.append(row);

    bubble.append(box);
    position();
    (box.querySelector('input') ?? ok).focus();
  });
}

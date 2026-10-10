// Your to-do list: the Tasks panel, plus the helpers the session uses
// to pick tasks and tick them off.
import { getSave, update } from './storage.js';

const listEl = document.getElementById('task-list');
const formEl = document.getElementById('task-form');
const emptyEl = document.getElementById('task-empty');

const newId = () => 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function addTask(text) {
  const task = { id: newId(), text: text.trim(), done: false };
  update(s => s.tasks.push(task));
  renderTasks();
  return task;
}

export function getTask(id) {
  return getSave().tasks.find(t => t.id === id);
}

export function openTasks() {
  return getSave().tasks.filter(t => !t.done);
}

export function setDone(id, done) {
  update(s => {
    const task = s.tasks.find(t => t.id === id);
    if (task) task.done = done;
  });
  renderTasks();
}

function removeTask(id) {
  update(s => { s.tasks = s.tasks.filter(t => t.id !== id); });
  renderTasks();
}

export function renderTasks() {
  const tasks = getSave().tasks;
  listEl.innerHTML = '';
  emptyEl.hidden = tasks.length > 0;
  // Unfinished first, newest at the bottom.
  for (const task of [...tasks].sort((a, b) => a.done - b.done)) {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' is-done' : '');

    const label = document.createElement('label');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = task.done;
    box.addEventListener('change', () => setDone(task.id, box.checked));
    const text = document.createElement('span');
    text.textContent = task.text;
    label.append(box, text);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'task-delete';
    del.setAttribute('aria-label', `Delete "${task.text}"`);
    del.textContent = '×';
    del.addEventListener('click', () => removeTask(task.id));

    li.append(label, del);
    listEl.append(li);
  }
}

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const input = formEl.querySelector('input');
  if (input.value.trim()) addTask(input.value);
  input.value = '';
  input.focus();
});

renderTasks();

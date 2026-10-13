// A study session: the in-memory session object, the big clock,
// Break/Resume and End. Nothing here is saved, so closing the page
// mid-session loses it (on purpose).
import { nextGapMs } from './checkins.js';
import { getSave } from './storage.js';
import { BREAK_UNIT_MS, DEMO_MODE } from './config.js';
import { lightUp } from './decor.js';

const MINUTE = 60 * 1000;

const clockEl = document.getElementById('clock');
const breakClockEl = document.getElementById('break-clock');
const statusEl = document.getElementById('study-status');
const breakBtn = document.getElementById('break-btn');
const endBtn = document.getElementById('end-btn');

function format(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

// settings: { characterId, mode, lengthMin, frequency }
// onCheckIn(session) is awaited; onBreak(true/false) is called when a break
// starts or ends. Returns a promise that resolves with the finished session
// when the timer runs out or End is pressed.
export function runSession(settings, onCheckIn, onBreak = () => {}) {
  const session = {
    ...settings,
    studiedMs: 0,              // study time banked before the current stretch
    runningSince: Date.now(),  // null while on a break
    nextCheckInAtMs: nextGapMs(settings.frequency),
    checkInCount: 0,
    lastAnimation: null,
  };

  // Study time so far, never counting breaks. Uses real timestamps, so it
  // stays right even if the browser slows timers in a background tab.
  const studied = () =>
    session.studiedMs + (session.runningSince ? Date.now() - session.runningSince : 0);

  let checkIn = null;   // the check-in playing right now, if any
  let ended = false;

  return new Promise(resolve => {
    let breakStartedAt = null;

    const render = () => {
      const ms = session.mode === 'timer' ? session.lengthMin * MINUTE - studied() : studied();
      clockEl.textContent = format(ms);
      // The small break timer above the big clock, with your break limit.
      breakClockEl.textContent = breakStartedAt
        ? `Break ${format(Date.now() - breakStartedAt)} / ${format(getSave().breakLimitMin * BREAK_UNIT_MS)}`
        : '';
      // Fairy lights: timer fills them as it runs down; stopwatch lights one
      // bulb every 5 minutes (5 seconds in demo mode).
      const bulbMs = (DEMO_MODE ? 5 / 60 : 5) * MINUTE;
      lightUp(session.mode === 'timer'
        ? studied() / (session.lengthMin * MINUTE)
        : studied() / (bulbMs * document.querySelectorAll('.door-scene .bulb').length));
    };

    const finish = () => {
      if (ended) return;
      ended = true;
      clearInterval(ticker);
      breakBtn.removeEventListener('click', onBreakClick);
      endBtn.removeEventListener('click', onEnd);
      session.studiedMs = studied();
      session.runningSince = null;
      breakStartedAt = null;
      if (session.mode === 'timer') {
        session.studiedMs = Math.min(session.studiedMs, session.lengthMin * MINUTE);
      }
      render();
      // Let a check-in that's mid-animation finish before wrapping up.
      Promise.resolve(checkIn).then(() => resolve(session));
    };

    const tick = async () => {
      render();
      const now = studied();
      if (session.mode === 'timer' && now >= session.lengthMin * MINUTE) {
        finish();
        return;
      }
      if (!checkIn && session.runningSince && now >= session.nextCheckInAtMs) {
        session.checkInCount += 1;
        checkIn = onCheckIn(session);
        await checkIn;
        // Schedule from when this one was due, so "every 1 min" lands on
        // 1:00, 2:00, 3:00... (never sooner than a few seconds from now,
        // so check-ins can't pile up back to back).
        session.nextCheckInAtMs = Math.max(
          session.nextCheckInAtMs + nextGapMs(session.frequency),
          studied() + 5000,
        );
        checkIn = null;
      }
    };

    const onBreakClick = () => {
      if (session.runningSince) {
        session.studiedMs = studied();
        session.runningSince = null;
        breakStartedAt = Date.now();
        breakBtn.textContent = 'Resume';
        statusEl.textContent = 'On a break. No check-ins.';
        document.body.classList.add('is-on-break');
        onBreak(true);
      } else {
        session.runningSince = Date.now();
        breakStartedAt = null;
        breakBtn.textContent = 'Break';
        statusEl.textContent = '';
        document.body.classList.remove('is-on-break');
        onBreak(false);
      }
      render();
    };

    const onEnd = () => finish();

    breakBtn.textContent = 'Break';
    statusEl.textContent = '';
    document.body.classList.remove('is-on-break');
    breakBtn.addEventListener('click', onBreakClick);
    endBtn.addEventListener('click', onEnd);
    const ticker = setInterval(tick, 250);
    render();
  });
}

export const minutesStudied = session => Math.floor(session.studiedMs / MINUTE);

// Study time so far, including the stretch that's running right now.
export const studiedNowMs = session =>
  session.studiedMs + (session.runningSince ? Date.now() - session.runningSince : 0);

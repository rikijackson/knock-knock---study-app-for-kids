// A study session: the in-memory session object, the big clock,
// Break/Resume and End. Nothing here is saved, so closing the page
// mid-session loses it (on purpose).
import { nextGapMs } from './checkins.js';

const MINUTE = 60 * 1000;

const clockEl = document.getElementById('clock');
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
// onCheckIn(session) is awaited; returns a promise that resolves with the
// finished session when the timer runs out or End is pressed.
export function runSession(settings, onCheckIn) {
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
    const render = () => {
      const ms = session.mode === 'timer' ? session.lengthMin * MINUTE - studied() : studied();
      clockEl.textContent = format(ms);
    };

    const finish = () => {
      if (ended) return;
      ended = true;
      clearInterval(ticker);
      breakBtn.removeEventListener('click', onBreak);
      endBtn.removeEventListener('click', onEnd);
      session.studiedMs = studied();
      session.runningSince = null;
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
        // Schedule from when this one finished, so they never pile up.
        session.nextCheckInAtMs = studied() + nextGapMs(session.frequency);
        checkIn = null;
      }
    };

    const onBreak = () => {
      if (session.runningSince) {
        session.studiedMs = studied();
        session.runningSince = null;
        breakBtn.textContent = 'Resume';
        statusEl.textContent = 'On a break. No check-ins.';
        document.body.classList.add('is-on-break');
      } else {
        session.runningSince = Date.now();
        breakBtn.textContent = 'Break';
        statusEl.textContent = '';
        document.body.classList.remove('is-on-break');
      }
      render();
    };

    const onEnd = () => finish();

    breakBtn.textContent = 'Break';
    statusEl.textContent = '';
    document.body.classList.remove('is-on-break');
    breakBtn.addEventListener('click', onBreak);
    endBtn.addEventListener('click', onEnd);
    const ticker = setInterval(tick, 250);
    render();
  });
}

export const minutesStudied = session => Math.floor(session.studiedMs / MINUTE);

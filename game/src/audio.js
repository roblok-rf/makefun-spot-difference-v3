// audio.js — tiny WebAudio bleeps, no sound files needed.
// Correct: a bright two-note chime. Wrong: a low buzz. Scene clear:
// a short rising arpeggio. Everything is a plain oscillator, so the
// game ships no audio assets and loads nothing over the network.

let audioCtx = null;
let enabled = true;

export function setSoundEnabled(on) {
  enabled = on;
}

export function isSoundEnabled() {
  return enabled;
}

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.12) {
  if (!enabled) return;
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ac.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + start);
    osc.stop(ac.currentTime + start + dur);
  } catch (_) {
    // Audio is decoration: a blocked context never breaks the game.
  }
}

export function playCorrect() {
  tone(660, 0, 0.12);
  tone(880, 0.1, 0.18);
}

export function playWrong() {
  tone(160, 0, 0.22, 'sawtooth', 0.08);
}

export function playClear() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.16));
}

export function playClick() {
  tone(440, 0, 0.06, 'triangle', 0.06);
}

export function playHint() {
  tone(988, 0, 0.1, 'sine', 0.08);
  tone(1319, 0.09, 0.14, 'sine', 0.08);
}

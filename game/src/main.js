// main.js — HARBOUR HUNT game flow.
// One screen at a time: start, levels, how-to, game, pause, clear,
// game over, final, restart-confirm. The run is 5 scenes; each scene
// has 8 differences, 3 hearts, 3 hints and a par time. Stars come
// from time vs par, hearts left and hints used. The most recent
// submission is the final entry, so this file keeps no state outside
// the run: everything resets on Play Again.

import { COMBO_MAX, COMBO_WINDOW_MS, FIND_POINTS, formatTime, HEART_BONUS, HINTS_PER_RUN, MAX_HEARTS, PAR_BONUS, starsForScene, UNUSED_HINT_BONUS } from './config.js';
import { SCENES, diffAtPoint, totalDifferences } from './scenes.js';
import { drawHintRing, drawWrongX, paintLens, paintPanels, paintPreview, setupCanvas } from './render.js';
import { attachPanelClicks, attachPanelHover, createKeyboardCursor, moveKeyboardCursor } from './input.js';
import { isSoundEnabled, playClear, playClick, playCorrect, playHint, playWrong, setSoundEnabled } from './audio.js';
import { readShotQuery } from './shots.js';
import { cloudPuff, lighthouseTower, harbourHouse, sea, skyBands } from './shapes.js';

const $ = (id) => document.getElementById(id);

const state = {
  screen: 'start',
  sceneIndex: 0,
  found: new Set(),
  hearts: MAX_HEARTS,
  hintsLeft: HINTS_PER_RUN,
  hintsUsed: 0,
  score: 0,
  scoreAtSceneStart: 0,
  combo: 0,
  lastFindAt: 0,
  sceneStartAt: 0,
  elapsedMs: 0,
  totalSeconds: 0,
  stars: [0, 0, 0, 0, 0],
  unlocked: 1,
  paused: false,
  magnifier: false,
  hintIndex: -1,
  hintUntil: 0,
  hover: null,
  over: false,
};

let leftCtx;
let rightCtx;
let timerId = null;
let pulseId = null;
const kbd = createKeyboardCursor();

function currentScene() {
  return SCENES[state.sceneIndex];
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  const el = $(`screen-${name}`);
  if (el) el.classList.add('active');
  state.screen = name;
}

function updateHud() {
  const scene = currentScene();
  $('hud-scene-name').textContent = scene.name;
  $('hud-scene-meta').textContent = `Scene ${state.sceneIndex + 1} of ${SCENES.length} · Par ${formatTime(scene.par)}`;
  const remaining = scene.diffs.length - state.found.size;
  $('hud-tofind').textContent = `${remaining} to find`;
  $('hud-timer').textContent = formatTime(state.elapsedMs / 1000);
  $('hud-hearts').textContent = '♥'.repeat(state.hearts) + '♡'.repeat(MAX_HEARTS - state.hearts);
  $('hud-score').textContent = `Score ${state.score.toLocaleString()} · ×${Math.min(Math.max(state.combo, 1), COMBO_MAX)}`;
  $('hud-streak').textContent = `Streak ×${Math.max(state.combo, 1)}`;
  $('btn-hint-count').textContent = String(state.hintsLeft);
  $('btn-magnifier').classList.toggle('on', state.magnifier);
  $('btn-sound').textContent = isSoundEnabled() ? '🔊 Sound' : '🔇 Muted';
  $('btn-sound-start').textContent = isSoundEnabled() ? '🔊' : '🔇';
  const dots = $('found-dots');
  dots.innerHTML = '';
  scene.diffs.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = `dot${state.found.has(i) ? ' found' : ''}`;
    dot.textContent = state.found.has(i) ? '✓' : '';
    dots.appendChild(dot);
  });
}

function repaint() {
  const scene = currentScene();
  paintPanels(leftCtx, rightCtx, scene, state.found);
  if (state.hintIndex >= 0 && Date.now() < state.hintUntil) {
    const pulse = Date.now() / 280;
    drawHintRing(leftCtx, scene, state.hintIndex, pulse);
    drawHintRing(rightCtx, scene, state.hintIndex, pulse);
  }
  positionKbdCursor();
}

function positionKbdCursor() {
  const el = $('kbd-cursor');
  if (!kbd.visible || state.screen !== 'game') {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'block';
  const wrap = $('panel-right').parentElement;
  const rect = $('panel-right').getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();
  el.style.left = `${rect.left - wrapRect.left + kbd.fx * rect.width - 18}px`;
  el.style.top = `${rect.top - wrapRect.top + kbd.fy * rect.height - 18}px`;
}

function startTimer() {
  stopTimer();
  state.sceneStartAt = Date.now() - state.elapsedMs;
  timerId = window.setInterval(() => {
    if (state.paused || state.screen !== 'game') return;
    state.elapsedMs = Date.now() - state.sceneStartAt;
    $('hud-timer').textContent = formatTime(state.elapsedMs / 1000);
  }, 200);
}

function stopTimer() {
  if (timerId) window.clearInterval(timerId);
  timerId = null;
}

function startPulse() {
  stopPulse();
  pulseId = window.setInterval(() => {
    if (state.hintIndex < 0 || Date.now() >= state.hintUntil) {
      state.hintIndex = -1;
      stopPulse();
      repaint();
      return;
    }
    repaint();
  }, 90);
}

function stopPulse() {
  if (pulseId) window.clearInterval(pulseId);
  pulseId = null;
}

function startScene(index, keepScore = true) {
  state.sceneIndex = index;
  state.found = new Set();
  state.hearts = MAX_HEARTS;
  state.hintsLeft = HINTS_PER_RUN;
  state.hintsUsed = 0;
  state.combo = 0;
  state.elapsedMs = 0;
  state.hintIndex = -1;
  state.over = false;
  state.paused = false;
  if (!keepScore) {
    state.score = 0;
    state.totalSeconds = 0;
  } else {
    state.scoreAtSceneStart = state.score;
  }
  kbd.visible = false;
  showScreen('game');
  repaint();
  updateHud();
  startTimer();
}

function startRun(fromScene = 0) {
  // A level jump continues the run: stars and unlocks stay, the score
  // restarts from zero and play continues from that scene to the end.
  state.score = 0;
  state.totalSeconds = 0;
  startScene(fromScene, false);
}

// A fresh run (START HUNT, PLAY AGAIN, Restart Run) resets progress.
function resetRunProgress() {
  state.score = 0;
  state.totalSeconds = 0;
  state.stars = [0, 0, 0, 0, 0];
  state.unlocked = 1;
}

function handlePanelClick(pos) {
  if (state.screen !== 'game' || state.paused || state.over) return;
  const scene = currentScene();
  const hit = diffAtPoint(scene, pos.fx, pos.fy, state.found);
  if (hit >= 0) {
    state.found.add(hit);
    const now = Date.now();
    state.combo = now - state.lastFindAt <= COMBO_WINDOW_MS ? state.combo + 1 : 1;
    state.lastFindAt = now;
    const mult = Math.min(state.combo, COMBO_MAX);
    state.score += FIND_POINTS * mult;
    playCorrect();
    repaint();
    updateHud();
    if (state.found.size === scene.diffs.length) clearScene();
  } else {
    state.hearts -= 1;
    state.combo = 0;
    playWrong();
    const game = $('screen-game');
    game.classList.add('shake');
    window.setTimeout(() => game.classList.remove('shake'), 350);
    drawWrongX(leftCtx, pos.fx, pos.fy);
    drawWrongX(rightCtx, pos.fx, pos.fy);
    window.setTimeout(() => repaint(), 450);
    updateHud();
    if (state.hearts <= 0) gameOver();
  }
}

function useHint() {
  if (state.screen !== 'game' || state.paused || state.over) return;
  if (state.hintsLeft <= 0) return;
  const scene = currentScene();
  const remaining = scene.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  state.hintsLeft -= 1;
  state.hintsUsed += 1;
  state.hintIndex = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintUntil = Date.now() + 2600;
  playHint();
  updateHud();
  startPulse();
}

function clearScene() {
  stopTimer();
  const scene = currentScene();
  const seconds = state.elapsedMs / 1000;
  state.totalSeconds += seconds;
  const stars = starsForScene(seconds, scene.par, state.hearts, state.hintsUsed);
  state.stars[state.sceneIndex] = Math.max(state.stars[state.sceneIndex], stars);
  state.unlocked = Math.max(state.unlocked, Math.min(SCENES.length, state.sceneIndex + 2));
  let bonus = 0;
  if (seconds <= scene.par) bonus += PAR_BONUS;
  bonus += state.hearts * HEART_BONUS;
  bonus += (HINTS_PER_RUN - state.hintsUsed) * UNUSED_HINT_BONUS;
  state.score += bonus;
  playClear();
  const isLast = state.sceneIndex === SCENES.length - 1;
  $('clear-title').textContent = 'HARBOUR CLEARED!';
  $('clear-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  $('clear-stats').innerHTML = [
    ['Time', formatTime(seconds)],
    ['Par', formatTime(scene.par)],
    ['Hearts left', `${state.hearts} / ${MAX_HEARTS}`],
    ['Hints used', String(state.hintsUsed)],
    ['Clear bonus', `+${bonus}`],
    ['Scene score', `${(state.score - state.scoreAtSceneStart).toLocaleString()}`],
  ].map(([k, v]) => `<div class="stat-row"><span>${k}</span><b>${v}</b></div>`).join('');
  $('btn-next').textContent = isLast ? 'SEE THE FINAL →' : `NEXT: ${SCENES[state.sceneIndex + 1].name.toUpperCase()} →`;
  $('btn-next').dataset.last = isLast ? '1' : '0';
  showScreen('clear');
  updateHud();
}

function gameOver() {
  state.over = true;
  stopTimer();
  const scene = currentScene();
  $('gameover-meta').textContent = `${scene.name} · ${scene.diffs.length - state.found.size} differences left`;
  showScreen('gameover');
}

function showFinal() {
  stopTimer();
  const totalStars = state.stars.reduce((a, b) => a + b, 0);
  $('final-score').textContent = state.score.toLocaleString();
  $('final-time').textContent = `Total time ${formatTime(state.totalSeconds)}`;
  $('final-stars').textContent = `${totalStars} / ${SCENES.length * 3} ★`;
  const cards = $('final-cards');
  cards.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const card = document.createElement('div');
    card.className = 'mini-card';
    const cv = document.createElement('canvas');
    cv.width = 200;
    cv.height = 140;
    card.appendChild(cv);
    const name = document.createElement('div');
    name.className = 'mini-name';
    name.textContent = scene.name;
    card.appendChild(name);
    const stars = document.createElement('div');
    stars.className = 'mini-stars';
    stars.textContent = '★'.repeat(state.stars[i]) + '☆'.repeat(3 - state.stars[i]);
    card.appendChild(stars);
    cards.appendChild(card);
    paintPreview(cv, scene, false);
  });
  showScreen('final');
}

function buildLevels() {
  const grid = $('levels-grid');
  grid.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const locked = i >= state.unlocked;
    const card = document.createElement('button');
    card.className = `level-card${locked ? ' locked' : ''}`;
    const cv = document.createElement('canvas');
    cv.width = 200;
    cv.height = 140;
    card.appendChild(cv);
    const name = document.createElement('div');
    name.className = 'mini-name';
    name.textContent = locked ? `🔒 ${scene.name}` : scene.name;
    card.appendChild(name);
    const meta = document.createElement('div');
    meta.className = 'mini-meta';
    meta.textContent = `Par ${formatTime(scene.par)} · ${'★'.repeat(state.stars[i])}${'☆'.repeat(3 - state.stars[i])}`;
    card.appendChild(meta);
    if (!locked) card.addEventListener('click', () => { playClick(); startRun(i); });
    grid.appendChild(card);
    paintPreview(cv, scene, false);
  });
}

function pauseGame() {
  if (state.screen !== 'game') return;
  state.paused = true;
  stopTimer();
  $('pause-meta').textContent = `Scene ${state.sceneIndex + 1} of ${SCENES.length} · ${formatTime(state.elapsedMs / 1000)} · ${'♥'.repeat(state.hearts)}${'♡'.repeat(MAX_HEARTS - state.hearts)} · Hints ${state.hintsLeft}`;
  showScreen('pause');
}

function resumeGame() {
  state.paused = false;
  showScreen('game');
  startTimer();
  repaint();
}

function toggleMagnifier() {
  state.magnifier = !state.magnifier;
  if (!state.magnifier) {
    $('lens-left').style.display = 'none';
    $('lens-right').style.display = 'none';
  }
  playClick();
  updateHud();
}

function toggleSound() {
  setSoundEnabled(!isSoundEnabled());
  playClick();
  updateHud();
}

function onHover(pos) {
  state.hover = pos;
  if (!state.magnifier || !pos || state.screen !== 'game') {
    $('lens-left').style.display = 'none';
    $('lens-right').style.display = 'none';
    return;
  }
  ['left', 'right'].forEach((side) => {
    const lens = $(`lens-${side}`);
    const panel = $(`panel-${side}`);
    const rect = panel.getBoundingClientRect();
    const wrapRect = panel.parentElement.getBoundingClientRect();
    lens.style.display = 'block';
    lens.style.left = `${rect.left - wrapRect.left + pos.fx * rect.width - 75}px`;
    lens.style.top = `${rect.top - wrapRect.top + pos.fy * rect.height - 75}px`;
    paintLens(lens.querySelector('canvas'), panel, pos.fx, pos.fy);
  });
}

function drawStartBackdrop() {
  const cv = $('start-bg');
  const ctx = cv.getContext('2d');
  const W = cv.width;
  const H = cv.height;
  ctx.fillStyle = '#0B1D3A';
  ctx.fillRect(0, 0, W, H);
  // No moon here: every clear-sky spot sits behind the title, the
  // previews, or the sound button, so the backdrop stays starlit only.
  ctx.fillStyle = '#FFFFFF';
  [[0.1, 0.1], [0.3, 0.07], [0.55, 0.1], [0.68, 0.06], [0.92, 0.3]].forEach(([fx, fy]) => {
    ctx.beginPath();
    ctx.arc(W * fx, H * fy, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  cloudPuff(ctx, W * 0.2, H * 0.16, 1.4, 'rgba(255,255,255,0.12)');
  cloudPuff(ctx, W * 0.6, H * 0.1, 1.1, 'rgba(255,255,255,0.1)');
  sea(ctx, W, H, H * 0.66, ['#12294D', '#1B3A5F']);
  harbourHouse(ctx, W * 0.12, H * 0.66, 90, 56, '#1B3A5F', '#E74C3C', { windowLit: true });
  harbourHouse(ctx, W * 0.24, H * 0.66, 90, 56, '#1B3A5F', '#F5A524', { windowLit: true });
  lighthouseTower(ctx, W * 0.88, H * 0.66, 190, 52, '#E74C3C', '#FFFFFF', { beam: true });
  // The harbour cat mascot, sitting on the pier.
  ctx.fillStyle = '#8A5A2B';
  ctx.fillRect(0, H * 0.8, W, 16);
}

function applyShot(shot) {
  if (!shot) return;
  if (shot.shot === 'start') return;
  if (shot.shot === 'levels') {
    buildLevels();
    showScreen('levels');
    return;
  }
  if (shot.shot === 'final') {
    state.score = shot.score || 12480;
    state.totalSeconds = 640;
    state.stars = shot.stars && shot.stars.length === 5 ? shot.stars : [3, 3, 2, 3, 2];
    showFinal();
    return;
  }
  // play / night: a mid-game frame with found markers.
  const sceneIndex = shot.shot === 'night' ? 3 : shot.scene;
  startScene(sceneIndex, false);
  state.found = new Set(shot.found || []);
  state.score = shot.score || 0;
  state.elapsedMs = (shot.elapsed || 0) * 1000;
  state.hearts = Math.max(1, Math.min(3, shot.hearts || 3));
  state.hintsLeft = Math.max(0, Math.min(3, shot.hints ?? 3));
  state.sceneStartAt = Date.now() - state.elapsedMs;
  repaint();
  updateHud();
}

function bind() {
  $('btn-start').addEventListener('click', () => { playClick(); resetRunProgress(); startRun(0); });
  $('btn-levels-start').addEventListener('click', () => { playClick(); buildLevels(); showScreen('levels'); });
  $('btn-howto').addEventListener('click', () => { playClick(); showScreen('howto'); });
  $('btn-howto-back').addEventListener('click', () => { playClick(); showScreen('start'); });
  $('btn-levels-back').addEventListener('click', () => { playClick(); showScreen('start'); });
  $('btn-hint').addEventListener('click', useHint);
  $('btn-magnifier').addEventListener('click', toggleMagnifier);
  $('btn-pause').addEventListener('click', () => { playClick(); pauseGame(); });
  $('btn-sound').addEventListener('click', toggleSound);
  $('btn-sound-start').addEventListener('click', toggleSound);
  $('btn-sound-pause').addEventListener('click', toggleSound);
  $('btn-resume').addEventListener('click', () => { playClick(); resumeGame(); });
  $('btn-restart-scene').addEventListener('click', () => {
    playClick();
    state.score = state.scoreAtSceneStart;
    startScene(state.sceneIndex, true);
  });
  $('btn-levels-pause').addEventListener('click', () => { playClick(); buildLevels(); showScreen('levels'); });
  $('btn-next').addEventListener('click', () => {
    playClick();
    if ($('btn-next').dataset.last === '1') showFinal();
    else startScene(state.sceneIndex + 1, true);
  });
  $('btn-replay').addEventListener('click', () => {
    playClick();
    state.score = state.scoreAtSceneStart;
    startScene(state.sceneIndex, true);
  });
  $('btn-tryagain').addEventListener('click', () => {
    playClick();
    state.score = state.scoreAtSceneStart;
    startScene(state.sceneIndex, true);
  });
  $('btn-levels-over').addEventListener('click', () => { playClick(); buildLevels(); showScreen('levels'); });
  $('btn-again').addEventListener('click', () => { playClick(); resetRunProgress(); startRun(0); });
  $('btn-levels-final').addEventListener('click', () => { playClick(); buildLevels(); showScreen('levels'); });
  $('btn-restart-yes').addEventListener('click', () => {
    playClick();
    resetRunProgress();
    showScreen('start');
  });
  $('btn-restart-no').addEventListener('click', () => { playClick(); resumeGame(); });
  $('btn-restart-open').addEventListener('click', () => { playClick(); showScreen('restart'); });

  attachPanelClicks($('panel-left'), $('panel-right'), handlePanelClick);
  attachPanelHover($('panel-left'), $('panel-right'), onHover);

  document.addEventListener('keydown', (event) => {
    if (state.screen === 'game' && !state.paused) {
      if (event.key.startsWith('Arrow')) {
        event.preventDefault();
        moveKeyboardCursor(kbd, event.key);
        positionKbdCursor();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        kbd.visible = true;
        handlePanelClick({ fx: kbd.fx, fy: kbd.fy, side: 'right' });
      } else if (event.key === 'h' || event.key === 'H') useHint();
      else if (event.key === 'p' || event.key === 'P') pauseGame();
      else if (event.key === 'm' || event.key === 'M') toggleMagnifier();
    } else if (state.screen === 'pause' && (event.key === 'p' || event.key === 'P' || event.key === 'Escape')) {
      resumeGame();
    }
  });
  window.addEventListener('resize', positionKbdCursor);
}

function init() {
  leftCtx = setupCanvas($('panel-left'));
  rightCtx = setupCanvas($('panel-right'));
  drawStartBackdrop();
  paintPreview($('preview-left'), SCENES[0], false);
  paintPreview($('preview-right'), SCENES[0], true);
  $('total-changes').textContent = String(totalDifferences());
  bind();
  showScreen('start');
  const shot = readShotQuery();
  if (shot) applyShot(shot);
}

init();

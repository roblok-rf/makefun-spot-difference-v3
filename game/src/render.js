// render.js — paints the two panels and every mark on them.
// Left panel: the scene as it is. Right panel: the same scene with
// all 8 differences applied. Found differences get a big green ring
// on BOTH panels; a hint gets a pulsing gold ring; a wrong click
// flashes a red X. The magnifier lenses zoom both panels in sync.

import { LENS_SIZE, LENS_ZOOM, PANEL_H, PANEL_W } from './config.js';

const BACKING = 2; // canvas backing scale for crisp screenshots

export function setupCanvas(canvas) {
  canvas.width = PANEL_W * BACKING;
  canvas.height = PANEL_H * BACKING;
  const ctx = canvas.getContext('2d');
  ctx.scale(BACKING, BACKING);
  return ctx;
}

export function paintPanels(leftCtx, rightCtx, scene, found) {
  leftCtx.save();
  leftCtx.clearRect(0, 0, PANEL_W, PANEL_H);
  scene.draw(leftCtx, PANEL_W, PANEL_H, new Set());
  leftCtx.restore();
  rightCtx.save();
  rightCtx.clearRect(0, 0, PANEL_W, PANEL_H);
  scene.draw(rightCtx, PANEL_W, PANEL_H, new Set(scene.diffs.map((_, i) => i)));
  rightCtx.restore();
  drawFoundRings(leftCtx, scene, found);
  drawFoundRings(rightCtx, scene, found);
}

export function drawFoundRings(ctx, scene, found) {
  ctx.save();
  ctx.strokeStyle = '#2ECC71';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  found.forEach((i) => {
    const p = scene.diffs[i].points[0];
    ctx.beginPath();
    ctx.arc(p.x * PANEL_W, p.y * PANEL_H, 26, 0, Math.PI * 2);
    ctx.stroke();
    // Check mark inside the ring.
    ctx.beginPath();
    ctx.moveTo(p.x * PANEL_W - 11, p.y * PANEL_H);
    ctx.lineTo(p.x * PANEL_W - 3, p.y * PANEL_H + 8);
    ctx.lineTo(p.x * PANEL_W + 12, p.y * PANEL_H - 8);
    ctx.stroke();
  });
  ctx.restore();
}

export function drawHintRing(ctx, scene, index, pulse) {
  const p = scene.diffs[index].points[0];
  ctx.save();
  ctx.strokeStyle = '#FFC83D';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(p.x * PANEL_W, p.y * PANEL_H, 24 + Math.sin(pulse) * 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawWrongX(ctx, fx, fy) {
  const x = fx * PANEL_W;
  const y = fy * PANEL_H;
  ctx.save();
  ctx.strokeStyle = '#E74C3C';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 14);
  ctx.lineTo(x + 14, y + 14);
  ctx.moveTo(x + 14, y - 14);
  ctx.lineTo(x - 14, y + 14);
  ctx.stroke();
  ctx.restore();
}

// Magnifier: each lens canvas shows a zoomed view of the same relative
// spot of its panel, so both lenses move in sync.
export function paintLens(lensCanvas, panelCanvas, fx, fy) {
  const L = LENS_SIZE; // lens canvas size in px
  const Z = LENS_ZOOM; // zoom
  lensCanvas.width = L;
  lensCanvas.height = L;
  const ctx = lensCanvas.getContext('2d');
  const sx = fx * panelCanvas.width - (L / Z / 2) * (panelCanvas.width / PANEL_W);
  const sy = fy * panelCanvas.height - (L / Z / 2) * (panelCanvas.height / PANEL_H);
  const sw = (L / Z) * (panelCanvas.width / PANEL_W);
  const sh = (L / Z) * (panelCanvas.height / PANEL_H);
  ctx.save();
  ctx.beginPath();
  ctx.arc(L / 2, L / 2, L / 2 - 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(panelCanvas, sx, sy, sw, sh, 0, 0, L, L);
  ctx.restore();
  ctx.strokeStyle = '#FFC83D';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(L / 2, L / 2, L / 2 - 3, 0, Math.PI * 2);
  ctx.stroke();
  // Crosshair.
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(L / 2 - 12, L / 2);
  ctx.lineTo(L / 2 + 12, L / 2);
  ctx.moveTo(L / 2, L / 2 - 12);
  ctx.lineTo(L / 2, L / 2 + 12);
  ctx.stroke();
}

// Mini scene preview for the Levels cards and the start screen.
export function paintPreview(canvas, scene, changed) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(w / PANEL_W, h / PANEL_H);
  scene.draw(ctx, PANEL_W, PANEL_H, changed ? new Set(scene.diffs.map((_, i) => i)) : new Set());
  ctx.restore();
}

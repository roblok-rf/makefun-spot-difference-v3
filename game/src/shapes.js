// shapes.js — flat-vector harbour shapes, one helper per object.
// Every shape is drawn from solid colour blocks with simple geometry
// (rects, circles, triangles, arcs). No gradients, no thin outlines,
// so every scene stays readable when the screenshot is shrunk.

export function skyBands(ctx, w, h, colors) {
  // Flat horizontal sky bands, top to bottom.
  const n = colors.length;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(0, (h * 0.52 * i) / n, w, (h * 0.52) / n + 1);
  });
}

export function sea(ctx, w, h, top, colors) {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, top, w, h - top);
  ctx.fillStyle = colors[1];
  for (let i = 0; i < 5; i++) {
    const y = top + 14 + i * 16;
    ctx.fillRect(0, y, w, 3);
  }
}

export function sunDisc(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
  ctx.fill();
}

export function moonCrescent(ctx, x, y, r, flip) {
  ctx.fillStyle = '#F4F1DE';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0B1D3A';
  ctx.beginPath();
  ctx.arc(x + (flip ? -r * 0.45 : r * 0.45), y - r * 0.12, r * 0.86, 0, Math.PI * 2);
  ctx.fill();
}

export function starField(ctx, stars) {
  // stars: [{x, y, r}] in logical px. Four-point sparkle for the big ones.
  stars.forEach((s) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    if (s.r >= 5) {
      ctx.fillRect(s.x - s.r * 2.1, s.y - 1, s.r * 4.2, 2);
      ctx.fillRect(s.x - 1, s.y - s.r * 2.1, 2, s.r * 4.2);
    }
  });
}

export function cloudPuff(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y + 4 * s, 13 * s, 0, Math.PI * 2);
  ctx.arc(x - 18 * s, y + 5 * s, 12 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 30 * s, y, 60 * s, 12 * s);
}

export function gullBird(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 11 * s, y);
  ctx.stroke();
}

export function lighthouseTower(ctx, x, baseY, h, w, stripeA, stripeB, opts = {}) {
  // Striped tower with gallery + lamp room. x = centre, baseY = ground line.
  const topY = baseY - h;
  ctx.fillStyle = stripeA;
  ctx.fillRect(x - w / 2, topY + 26, w, h - 26);
  ctx.fillStyle = stripeB;
  ctx.fillRect(x - w / 2, topY + 26 + (h - 26) * 0.33, w, (h - 26) * 0.22);
  ctx.fillRect(x - w / 2, topY + 26 + (h - 26) * 0.7, w, (h - 26) * 0.18);
  ctx.fillStyle = '#22303F';
  ctx.fillRect(x - w / 2 - 6, topY + 18, w + 12, 10); // gallery
  ctx.fillStyle = opts.lampOn === false ? '#5B6B7A' : '#FFD94D';
  ctx.fillRect(x - w * 0.32, topY + 2, w * 0.64, 18); // lamp room
  ctx.fillStyle = '#22303F';
  ctx.beginPath();
  ctx.moveTo(x - w * 0.42, topY + 2);
  ctx.lineTo(x, topY - 14);
  ctx.lineTo(x + w * 0.42, topY + 2);
  ctx.closePath();
  ctx.fill();
  if (opts.beam) {
    ctx.fillStyle = 'rgba(255,217,77,0.28)';
    ctx.beginPath();
    ctx.moveTo(x - w * 0.3, topY + 10);
    ctx.lineTo(x - 150, topY - 26);
    ctx.lineTo(x - 150, topY + 34);
    ctx.closePath();
    ctx.fill();
  }
  if (opts.flag) {
    ctx.strokeStyle = '#22303F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, topY - 14);
    ctx.lineTo(x, topY - 34);
    ctx.stroke();
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.moveTo(x, topY - 34);
    ctx.lineTo(x + 26, topY - 28);
    ctx.lineTo(x, topY - 22);
    ctx.closePath();
    ctx.fill();
  }
  return { topY, w };
}

export function harbourHouse(ctx, x, baseY, w, h, wall, roof, opts = {}) {
  ctx.fillStyle = wall;
  ctx.fillRect(x - w / 2, baseY - h, w, h);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(x - w / 2 - 8, baseY - h);
  ctx.lineTo(x, baseY - h - 26);
  ctx.lineTo(x + w / 2 + 8, baseY - h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3A2A1A';
  ctx.fillRect(x - 9, baseY - 26, 18, 26); // door
  const lit = opts.windowLit ? '#FFD94D' : '#FFE9A8';
  ctx.fillStyle = lit;
  ctx.fillRect(x - w / 2 + 8, baseY - h + 10, 14, 14);
  ctx.fillRect(x + w / 2 - 22, baseY - h + 10, 14, 14);
}

export function sailboat(ctx, x, waterY, s, sailColor, hullColor = '#7A4A21') {
  ctx.fillStyle = hullColor;
  ctx.beginPath();
  ctx.moveTo(x - 34 * s, waterY);
  ctx.lineTo(x + 34 * s, waterY);
  ctx.lineTo(x + 24 * s, waterY + 13 * s);
  ctx.lineTo(x - 24 * s, waterY + 13 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3A2A1A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, waterY);
  ctx.lineTo(x, waterY - 52 * s);
  ctx.stroke();
  ctx.fillStyle = sailColor;
  ctx.beginPath();
  ctx.moveTo(x + 3, waterY - 50 * s);
  ctx.lineTo(x + 3, waterY - 6 * s);
  ctx.lineTo(x + 30 * s, waterY - 6 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x - 3, waterY - 44 * s);
  ctx.lineTo(x - 3, waterY - 6 * s);
  ctx.lineTo(x - 22 * s, waterY - 6 * s);
  ctx.closePath();
  ctx.fill();
}

export function woodenPier(ctx, w, y, h) {
  ctx.fillStyle = '#8A5A2B';
  ctx.fillRect(0, y, w, 14);
  ctx.fillStyle = '#6E451F';
  for (let x = 0; x < w; x += 46) ctx.fillRect(x, y, 3, 14);
  ctx.fillStyle = '#5C3A1A';
  for (let x = 24; x < w; x += 92) ctx.fillRect(x, y + 14, 10, h - 14);
}

export function woodenBarrel(ctx, x, y, s = 1) {
  ctx.fillStyle = '#A9713A';
  ctx.beginPath();
  ctx.ellipse(x, y, 13 * s, 17 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7A4A21';
  ctx.fillRect(x - 13 * s, y - 6 * s, 26 * s, 3);
  ctx.fillRect(x - 13 * s, y + 5 * s, 26 * s, 3);
}

export function signBoard(ctx, x, y, text, bg = '#22303F', fg = '#FFFFFF') {
  ctx.font = `bold 17px ${"'Poppins', system-ui, sans-serif"}`;
  const w = ctx.measureText(text).width + 22;
  ctx.fillStyle = bg;
  ctx.fillRect(x - w / 2, y - 14, w, 28);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 1);
}

export function marketKiosk(ctx, x, baseY, w, canopy, signText) {
  // Striped canopy + stall body + sign board.
  ctx.fillStyle = '#7A4A21';
  ctx.fillRect(x - w / 2, baseY - 58, w, 58);
  ctx.fillStyle = canopy;
  ctx.fillRect(x - w / 2 - 8, baseY - 78, w + 16, 22);
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 4; i++) ctx.fillRect(x - w / 2 - 8 + i * ((w + 16) / 4) + 4, baseY - 78, (w + 16) / 8, 22);
  ctx.fillStyle = '#22303F';
  ctx.font = `bold 15px ${"'Poppins', system-ui, sans-serif"}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(signText, x, baseY - 36);
}

export function sittingCat(ctx, x, y, s = 1, color = '#E8A33D') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 13 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y - 20 * s, 10 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y - 27 * s);
  ctx.lineTo(x - 6 * s, y - 36 * s);
  ctx.lineTo(x - 2 * s, y - 28 * s);
  ctx.moveTo(x + 9 * s, y - 27 * s);
  ctx.lineTo(x + 6 * s, y - 36 * s);
  ctx.lineTo(x + 2 * s, y - 28 * s);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 12 * s, y + 12 * s);
  ctx.quadraticCurveTo(x + 24 * s, y + 6 * s, x + 20 * s, y - 6 * s);
  ctx.stroke();
}

export function palmTree(ctx, x, baseY, h, color = '#1E7A46') {
  ctx.strokeStyle = '#7A4A21';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.quadraticCurveTo(x + 8, baseY - h * 0.6, x + 2, baseY - h);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const topX = x + 2;
  const topY = baseY - h;
  [[-34, -6], [-24, -18], [-8, -24], [12, -22], [26, -12], [34, 2]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX + dx * 0.6, topY + dy * 0.6, topX + dx, topY + dy + 12);
    ctx.stroke();
  });
}

export function kayakBoat(ctx, x, y, len, color = '#F5A524') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, len / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22303F';
  ctx.beginPath();
  ctx.arc(x - len * 0.18, y - 4, 6, 0, Math.PI * 2);
  ctx.fill();
}

export function lampPost(ctx, x, baseY, h, on = true) {
  ctx.strokeStyle = '#22303F';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x, baseY - h);
  ctx.stroke();
  ctx.fillStyle = on ? '#FFD94D' : '#3A4A5A';
  ctx.beginPath();
  ctx.arc(x, baseY - h - 4, 8, 0, Math.PI * 2);
  ctx.fill();
  if (on) {
    ctx.fillStyle = 'rgba(255,217,77,0.25)';
    ctx.beginPath();
    ctx.arc(x, baseY - h - 4, 18, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function ferryBoat(ctx, x, y, w, windowColor) {
  ctx.fillStyle = '#2E4A6B';
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x + w / 2 - 14, y + 18);
  ctx.lineTo(x - w / 2 + 14, y + 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x - w / 2 + 8, y - 26, w - 16, 26);
  ctx.fillStyle = windowColor;
  for (let i = 0; i < 5; i++) ctx.fillRect(x - w / 2 + 18 + i * ((w - 40) / 5), y - 20, 12, 12);
  ctx.fillStyle = '#E74C3C';
  ctx.fillRect(x - 8, y - 44, 16, 18);
}

export function jumpingFish(ctx, x, y, s = 1, color = '#9AD1FF') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 14 * s, 6 * s, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 12 * s, y - 2 * s);
  ctx.lineTo(x + 22 * s, y - 8 * s);
  ctx.lineTo(x + 22 * s, y + 4 * s);
  ctx.closePath();
  ctx.fill();
}

export function lightningBolt(ctx, x, y, forked) {
  // A soft glow under the bolt so it reads against the storm sky.
  ctx.strokeStyle = 'rgba(255,228,92,0.25)';
  ctx.lineWidth = 13;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 12, y + 34);
  ctx.lineTo(x + 2, y + 34);
  ctx.lineTo(x - 10, y + 70);
  ctx.stroke();
  ctx.strokeStyle = '#FFE45C';
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 12, y + 34);
  ctx.lineTo(x + 2, y + 34);
  ctx.lineTo(x - 10, y + 70);
  ctx.stroke();
  if (forked) {
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 30);
    ctx.lineTo(x + 18, y + 52);
    ctx.lineTo(x + 10, y + 56);
    ctx.stroke();
  }
}

export function stiltHouse(ctx, x, baseY, w, opts = {}) {
  ctx.strokeStyle = '#5C3A1A';
  ctx.lineWidth = 5;
  [[-w / 2 + 8, 0], [w / 2 - 8, 0]].forEach(([dx]) => {
    ctx.beginPath();
    ctx.moveTo(x + dx, baseY - 22);
    ctx.lineTo(x + dx, baseY + 26);
    ctx.stroke();
  });
  ctx.fillStyle = opts.wall || '#C97B2D';
  ctx.fillRect(x - w / 2, baseY - 62, w, 40);
  ctx.fillStyle = opts.roof || '#8A2F2F';
  ctx.beginPath();
  ctx.moveTo(x - w / 2 - 8, baseY - 62);
  ctx.lineTo(x, baseY - 84);
  ctx.lineTo(x + w / 2 + 8, baseY - 62);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = opts.windowLit ? '#FFD94D' : '#3A2A1A';
  ctx.fillRect(x - 8, baseY - 52, 16, 16);
}

export function roundBuoy(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x - 11, y - 3, 22, 5);
  ctx.fillStyle = '#22303F';
  ctx.fillRect(x - 2, y - 18, 4, 8);
}

export function batSilhouette(ctx, x, y, s = 1) {
  // Muted grey-blue, not black: a night silhouette that is still
  // findable against the dark sky.
  ctx.fillStyle = '#8A9AB5';
  ctx.beginPath();
  ctx.moveTo(x - 22 * s, y);
  ctx.quadraticCurveTo(x - 12 * s, y - 12 * s, x - 4 * s, y - 2 * s);
  ctx.quadraticCurveTo(x, y - 8 * s, x + 4 * s, y - 2 * s);
  ctx.quadraticCurveTo(x + 12 * s, y - 12 * s, x + 22 * s, y);
  ctx.quadraticCurveTo(x + 10 * s, y + 6 * s, x, y + 2 * s);
  ctx.quadraticCurveTo(x - 10 * s, y + 6 * s, x - 22 * s, y);
  ctx.fill();
}

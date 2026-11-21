// scenes.js — the five harbours of HARBOUR HUNT.
// One data object per scene: name, par time, the 8 differences
// (label, kind, click points as panel fractions), and a draw function.
// draw(ctx, W, H, changed) paints the scene; `changed` is a Set of
// difference indices applied to the RIGHT panel only. The LEFT panel
// always draws with an empty set, so both panels come from one source.

import { CLICK_RADIUS, PANEL_H, PANEL_W } from './config.js';
import {
  batSilhouette, cloudPuff, ferryBoat, gullBird, harbourHouse, jumpingFish,
  kayakBoat, lampPost, lighthouseTower, lightningBolt, marketKiosk, moonCrescent,
  palmTree, roundBuoy, sailboat, sea, signBoard, sittingCat, skyBands,
  stiltHouse, starField, sunDisc, woodenBarrel, woodenPier,
} from './shapes.js';

const F = (v) => v; // fractions are already panel fractions

function diffs(list) {
  return list.map(([label, kind, points]) => ({
    label,
    kind,
    points: points.map(([x, y]) => ({ x: F(x), y: F(y) })),
  }));
}

// Hit-test a click (fractions) against one scene's unfound differences.
// Returns the difference index, or -1. A moved difference accepts a
// click near either of its two positions.
export function diffAtPoint(scene, fx, fy, found) {
  const tol = CLICK_RADIUS * PANEL_W;
  for (let i = 0; i < scene.diffs.length; i++) {
    if (found.has(i)) continue;
    for (const p of scene.diffs[i].points) {
      const dx = (fx - p.x) * PANEL_W;
      const dy = (fy - p.y) * PANEL_H;
      if (Math.hypot(dx, dy) <= tol) return i;
    }
  }
  return -1;
}

export const SCENES = [
  {
    id: 'dawn',
    name: 'Dawn Harbour',
    sub: 'Fajar',
    par: 90,
    diffs: diffs([
      ['Sun higher and bigger', 'size', [[0.55, 0.3]]],
      ['Middle roof blue to green', 'colour', [[0.3, 0.55]]],
      ['One gull missing', 'missing', [[0.22, 0.09]]],
      ['Extra flag on the lighthouse', 'added', [[0.85, 0.3]]],
      ['Small sail white to red', 'colour', [[0.62, 0.8]]],
      ['Pier sign PIER 3 to PIER 8', 'text', [[0.76, 0.68]]],
      ['Barrel moved across the post', 'moved', [[0.4, 0.72], [0.52, 0.72]]],
      ['Lighthouse shadow flips side', 'shadow', [[0.85, 0.9]]],
    ]),
    draw(ctx, W, H, c) {
      skyBands(ctx, W, H, ['#6B4C8A', '#FF8C42', '#FFC98A']);
      sea(ctx, W, H, H * 0.58, ['#3A6EA5', '#7FB3D9']);
      sunDisc(ctx, W * 0.55, c.has(0) ? H * 0.26 : H * 0.34, c.has(0) ? 30 : 24, '#FFD94D');
      gullBird(ctx, W * 0.15, H * 0.12, 1, '#22303F');
      if (!c.has(2)) gullBird(ctx, W * 0.22, H * 0.09, 1, '#22303F');
      gullBird(ctx, W * 0.3, H * 0.14, 1, '#22303F');
      cloudPuff(ctx, W * 0.62, H * 0.1, 1, 'rgba(255,255,255,0.85)');
      cloudPuff(ctx, W * 0.08, H * 0.2, 0.7, 'rgba(255,255,255,0.7)');
      // Houses on the far shore.
      harbourHouse(ctx, W * 0.14, H * 0.6, 64, 44, '#FFE9A8', '#E74C3C');
      harbourHouse(ctx, W * 0.3, H * 0.6, 64, 44, '#FFF3C4', c.has(1) ? '#2ECC71' : '#3A6EA5');
      harbourHouse(ctx, W * 0.46, H * 0.6, 64, 44, '#FFD9A0', '#F5A524');
      lighthouseTower(ctx, W * 0.85, H * 0.6, 150, 40, '#E74C3C', '#FFFFFF', {
        beam: true, flag: c.has(3),
      });
      // Lighthouse shadow on the water: right side, or left when changed.
      ctx.fillStyle = 'rgba(11,29,58,0.35)';
      ctx.beginPath();
      ctx.ellipse(W * (c.has(7) ? 0.74 : 0.9), H * 0.88, 46, 12, c.has(7) ? -0.25 : 0.25, 0, Math.PI * 2);
      ctx.fill();
      // Boats.
      sailboat(ctx, W * 0.25, H * 0.8, 1, '#FFFFFF');
      sailboat(ctx, W * 0.62, H * 0.84, 0.7, c.has(4) ? '#E74C3C' : '#FFFFFF');
      // Wooden pier with sign and barrel.
      woodenPier(ctx, W, H * 0.68, 34);
      ctx.fillStyle = '#5C3A1A';
      ctx.fillRect(W * 0.48, H * 0.68, 10, 40);
      signBoard(ctx, W * 0.76, H * 0.68, c.has(5) ? 'PIER 8' : 'PIER 3');
      woodenBarrel(ctx, W * (c.has(6) ? 0.52 : 0.4), H * 0.72);
    },
  },
  {
    id: 'noon',
    name: 'Noon Market Quay',
    sub: 'Siang',
    par: 105,
    diffs: diffs([
      ['GIFTS canopy red to yellow', 'colour', [[0.5, 0.42]]],
      ['Fish price 5 to 9', 'number', [[0.34, 0.55]]],
      ['Cat missing from the crate', 'missing', [[0.68, 0.62]]],
      ['Extra orange basket at CAFE', 'added', [[0.18, 0.72]]],
      ['Fishing boat smaller and lower', 'size', [[0.45, 0.84]]],
      ['Biggest cloud moved left', 'moved', [[0.7, 0.1], [0.3, 0.1]]],
      ['Bunting flag stripes to dots', 'pattern', [[0.88, 0.18]]],
      ['BOATS shadow falls right', 'shadow', [[0.82, 0.66]]],
    ]),
    draw(ctx, W, H, c) {
      skyBands(ctx, W, H, ['#4FA8E8', '#8ED0F5']);
      sea(ctx, W, H, H * 0.72, ['#2E86C1', '#7FB3D9']);
      cloudPuff(ctx, W * (c.has(5) ? 0.3 : 0.7), H * 0.1, 1.2, '#FFFFFF');
      cloudPuff(ctx, W * 0.12, H * 0.16, 0.8, '#FFFFFF');
      // Bunting across the top.
      ctx.strokeStyle = '#22303F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W * 0.05, H * 0.16);
      ctx.quadraticCurveTo(W * 0.5, H * 0.24, W * 0.95, H * 0.16);
      ctx.stroke();
      for (let i = 0; i < 9; i++) {
        const fx = 0.08 + i * 0.1;
        const fy = 0.17 + Math.sin(i * 0.7) * 0.02;
        const col = ['#E74C3C', '#F5A524', '#2ECC71', '#3A6EA5'][i % 4];
        if (i === 8 && c.has(6)) {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(W * fx, H * fy + 8, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(W * fx - 3, H * fy + 6, 2, 0, Math.PI * 2);
          ctx.arc(W * fx + 3, H * fy + 10, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.moveTo(W * fx - 9, H * fy);
          ctx.lineTo(W * fx + 9, H * fy);
          ctx.lineTo(W * fx, H * fy + 18);
          ctx.closePath();
          ctx.fill();
        }
      }
      // Market kiosks.
      marketKiosk(ctx, W * 0.18, H * 0.62, 96, '#E74C3C', 'CAFE');
      marketKiosk(ctx, W * 0.5, H * 0.62, 96, c.has(0) ? '#F5D90A' : '#E74C3C', 'GIFTS');
      marketKiosk(ctx, W * 0.82, H * 0.62, 96, '#3A6EA5', 'BOATS');
      // BOATS kiosk shadow: left, or right when changed.
      ctx.fillStyle = 'rgba(11,29,58,0.25)';
      ctx.beginPath();
      ctx.moveTo(W * 0.76, H * 0.62);
      ctx.lineTo(W * (c.has(7) ? 0.98 : 0.66), H * 0.62);
      ctx.lineTo(W * (c.has(7) ? 0.92 : 0.72), H * 0.7);
      ctx.lineTo(W * 0.82, H * 0.7);
      ctx.closePath();
      ctx.fill();
      // Fish price board.
      signBoard(ctx, W * 0.34, H * 0.55, c.has(1) ? 'FISH 9' : 'FISH 5', '#FFC83D', '#0B1D3A');
      // Crate with the harbour cat.
      ctx.fillStyle = '#8A5A2B';
      ctx.fillRect(W * 0.68 - 22, H * 0.62, 44, 26);
      ctx.fillStyle = '#6E451F';
      ctx.fillRect(W * 0.68 - 22, H * 0.62 + 12, 44, 3);
      if (!c.has(2)) sittingCat(ctx, W * 0.68, H * 0.62 - 2, 1);
      // Orange basket in front of CAFE (added).
      if (c.has(3)) {
        ctx.fillStyle = '#D97B29';
        ctx.beginPath();
        ctx.ellipse(W * 0.18, H * 0.72, 20, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F5A524';
        ctx.beginPath();
        ctx.arc(W * 0.14, H * 0.72 - 8, 7, 0, Math.PI * 2);
        ctx.arc(W * 0.2, H * 0.72 - 10, 7, 0, Math.PI * 2);
        ctx.arc(W * 0.24, H * 0.72 - 6, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Fishing boat.
      sailboat(ctx, W * 0.45, c.has(4) ? H * 0.88 : H * 0.82, c.has(4) ? 0.7 : 1, '#FFFFFF', '#2E4A6B');
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Lighthouse',
    sub: 'Senja',
    par: 120,
    diffs: diffs([
      ['Lighthouse door brown to blue', 'colour', [[0.5, 0.6]]],
      ['Lighthouse windows 3 to 4', 'added', [[0.5, 0.45]]],
      ['One palm tree missing', 'missing', [[0.88, 0.55]]],
      ['Kite moved to the right', 'moved', [[0.18, 0.14], [0.82, 0.14]]],
      ['Kayak longer', 'size', [[0.3, 0.85]]],
      ['Boat SUNNY to SANDY', 'text', [[0.72, 0.8]]],
      ['Sun yellow to pink', 'colour', [[0.2, 0.55]]],
      ['Jumping fish in the right waves', 'added', [[0.85, 0.78]]],
    ]),
    draw(ctx, W, H, c) {
      skyBands(ctx, W, H, ['#C94B7C', '#FF7A3D', '#FF4D4D']);
      sea(ctx, W, H, H * 0.62, ['#7A2E4D', '#FF9A5A']);
      sunDisc(ctx, W * 0.2, H * 0.56, 30, c.has(6) ? '#FF9EBB' : '#FFD94D');
      // Kite: left, or right when changed.
      const kx = W * (c.has(3) ? 0.82 : 0.18);
      ctx.fillStyle = '#FFC83D';
      ctx.beginPath();
      ctx.moveTo(kx, H * 0.1);
      ctx.lineTo(kx + 16, H * 0.16);
      ctx.lineTo(kx, H * 0.22);
      ctx.lineTo(kx - 16, H * 0.16);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(kx, H * 0.22);
      ctx.quadraticCurveTo(kx + 8, H * 0.3, kx - 4, H * 0.36);
      ctx.stroke();
      palmTree(ctx, W * 0.12, H * 0.64, 74);
      if (!c.has(2)) palmTree(ctx, W * 0.88, H * 0.64, 66);
      // Big lighthouse in the middle.
      ctx.fillStyle = '#F5E6C8';
      ctx.fillRect(W * 0.5 - 26, H * 0.64 - 170, 52, 170);
      ctx.fillStyle = '#E74C3C';
      ctx.fillRect(W * 0.5 - 26, H * 0.64 - 170 + 46, 52, 26);
      ctx.fillRect(W * 0.5 - 26, H * 0.64 - 170 + 108, 52, 24);
      ctx.fillStyle = '#22303F';
      ctx.fillRect(W * 0.5 - 34, H * 0.64 - 178, 68, 10);
      ctx.fillStyle = '#FFD94D';
      ctx.fillRect(W * 0.5 - 16, H * 0.64 - 196, 32, 18);
      ctx.fillStyle = '#22303F';
      ctx.beginPath();
      ctx.moveTo(W * 0.5 - 22, H * 0.64 - 196);
      ctx.lineTo(W * 0.5, H * 0.64 - 212);
      ctx.lineTo(W * 0.5 + 22, H * 0.64 - 196);
      ctx.closePath();
      ctx.fill();
      // Windows: 3, or 4 when changed.
      ctx.fillStyle = '#22303F';
      ctx.fillRect(W * 0.5 - 7, H * 0.64 - 150, 14, 16);
      ctx.fillRect(W * 0.5 - 7, H * 0.64 - 96, 14, 16);
      ctx.fillRect(W * 0.5 - 7, H * 0.64 - 44, 14, 16);
      if (c.has(1)) ctx.fillRect(W * 0.5 - 7, H * 0.64 - 122, 14, 16);
      // Door: brown, or blue when changed.
      ctx.fillStyle = c.has(0) ? '#3A6EA5' : '#6E451F';
      ctx.fillRect(W * 0.5 - 11, H * 0.64 - 30, 22, 30);
      // Kayak and the named boat.
      kayakBoat(ctx, W * 0.3, H * 0.86, c.has(4) ? 92 : 58, '#F5A524');
      ctx.fillStyle = '#7A4A21';
      ctx.beginPath();
      ctx.moveTo(W * 0.72 - 40, H * 0.82);
      ctx.lineTo(W * 0.72 + 40, H * 0.82);
      ctx.lineTo(W * 0.72 + 28, H * 0.82 + 14);
      ctx.lineTo(W * 0.72 - 28, H * 0.82 + 14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 15px ${"'Poppins', system-ui, sans-serif"}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.has(5) ? 'SANDY' : 'SUNNY', W * 0.72, H * 0.82 - 12);
      if (c.has(7)) jumpingFish(ctx, W * 0.85, H * 0.78, 1.1);
    },
  },
  {
    id: 'night',
    name: 'Night Pier',
    sub: 'Malam',
    par: 135,
    diffs: diffs([
      ['Neon OPEN to OPEN 24', 'text', [[0.16, 0.45]]],
      ['Crescent moon flips direction', 'direction', [[0.78, 0.14]]],
      ['One street lamp goes out', 'missing', [[0.36, 0.54]]],
      ['Ferry windows yellow to blue', 'colour', [[0.44, 0.72]]],
      ['Extra bat near the moon', 'added', [[0.66, 0.24]]],
      ['One big star missing', 'missing', [[0.2, 0.1]]],
      ['Bin moved to the middle post', 'moved', [[0.08, 0.7], [0.56, 0.7]]],
      ['Lamp reflection grows longer', 'shadow', [[0.6, 0.85]]],
    ]),
    draw(ctx, W, H, c) {
      ctx.fillStyle = '#0B1D3A';
      ctx.fillRect(0, 0, W, H);
      const stars = [
        { x: 0.08, y: 0.08, r: 3 }, { x: 0.2, y: 0.1, r: 8 }, { x: 0.34, y: 0.06, r: 3 },
        { x: 0.48, y: 0.12, r: 4 }, { x: 0.6, y: 0.06, r: 3 }, { x: 0.9, y: 0.3, r: 3 },
        { x: 0.12, y: 0.26, r: 3 }, { x: 0.94, y: 0.12, r: 4 }, { x: 0.42, y: 0.22, r: 3 },
      ];
      starField(ctx, c.has(5) ? stars.filter((s) => !(s.x === 0.2 && s.y === 0.1)) : stars);
      moonCrescent(ctx, W * 0.78, H * 0.14, 26, c.has(1));
      if (c.has(4)) batSilhouette(ctx, W * 0.66, H * 0.24, 1.2);
      sea(ctx, W, H, H * 0.58, ['#12294D', '#1B3A5F']);
      // Pier cafe with neon sign.
      ctx.fillStyle = '#2E5378';
      ctx.fillRect(W * 0.06, H * 0.4, 120, 70);
      ctx.fillStyle = '#FF5C8A';
      ctx.font = `bold ${c.has(0) ? 15 : 18}px ${"'Poppins', system-ui, sans-serif"}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.has(0) ? 'OPEN 24' : 'OPEN', W * 0.16, H * 0.45);
      ctx.fillStyle = '#FFD94D';
      ctx.fillRect(W * 0.08, H * 0.52, 18, 14);
      ctx.fillRect(W * 0.2, H * 0.52, 18, 14);
      // Ferry with lit windows, riding low on the water below the pier
      // so its windows stay visible instead of hiding behind the planks.
      ferryBoat(ctx, W * 0.44, H * 0.76, 150, c.has(3) ? '#7FB3FF' : '#FFD94D');
      // Lamp reflection in the water under lamp 3: short, or long when changed.
      ctx.fillStyle = 'rgba(255,217,77,0.3)';
      ctx.fillRect(W * 0.6 - 8, H * 0.78, 16, c.has(7) ? H * 0.18 : H * 0.08);
      // Wooden pier and lamps.
      woodenPier(ctx, W, H * 0.66, 30);
      lampPost(ctx, W * 0.12, H * 0.66, 44, true);
      lampPost(ctx, W * 0.36, H * 0.66, 44, !c.has(2));
      lampPost(ctx, W * 0.6, H * 0.66, 44, true);
      lampPost(ctx, W * 0.84, H * 0.66, 44, true);
      // Trash bin: left end, or near the middle post when changed.
      ctx.fillStyle = '#3A4A5A';
      const bx = W * (c.has(6) ? 0.56 : 0.08);
      ctx.fillRect(bx - 10, H * 0.7 - 22, 20, 22);
      ctx.fillStyle = '#22303F';
      ctx.fillRect(bx - 12, H * 0.7 - 26, 24, 6);
    },
  },
  {
    id: 'storm',
    name: 'Storm Cove',
    sub: 'Badai',
    par: 150,
    diffs: diffs([
      ['Lightning forked to single', 'shape', [[0.25, 0.1]]],
      ['Warning sign DANGER to DANGER 2', 'text', [[0.8, 0.38]]],
      ['Leftmost boat missing', 'missing', [[0.1, 0.8]]],
      ['Buoy red to orange', 'colour', [[0.7, 0.88]]],
      ['Third stilt house sits higher', 'moved', [[0.57, 0.5]]],
      ['One house window lights up', 'added', [[0.36, 0.52]]],
      ['Lighthouse smaller', 'size', [[0.92, 0.45]]],
      ['Umbrella in the fisherman hand', 'added', [[0.5, 0.72]]],
    ]),
    draw(ctx, W, H, c) {
      skyBands(ctx, W, H, ['#5B4A6E', '#8A7A9A']);
      sea(ctx, W, H, H * 0.6, ['#3A4A6B', '#5B6B8A']);
      lightningBolt(ctx, W * 0.25, H * 0.04, !c.has(0));
      // Rain lines.
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 14; i++) {
        const rx = ((i * 47) % 100) / 100 * W;
        const ry = ((i * 29) % 40) / 100 * H + H * 0.05;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 6, ry + 18);
        ctx.stroke();
      }
      cloudPuff(ctx, W * 0.6, H * 0.08, 1.3, '#4A3A5E');
      cloudPuff(ctx, W * 0.15, H * 0.14, 0.9, '#4A3A5E');
      // Stilt houses on the far shore.
      stiltHouse(ctx, W * 0.15, H * 0.56, 62, { wall: '#C97B2D', roof: '#8A2F2F' });
      stiltHouse(ctx, W * 0.36, H * 0.56, 62, { wall: '#3A6EA5', roof: '#22303F', windowLit: c.has(5) });
      stiltHouse(ctx, W * 0.57, c.has(4) ? H * 0.52 : H * 0.56, 62, { wall: '#7A9A4D', roof: '#8A2F2F' });
      stiltHouse(ctx, W * 0.78, H * 0.56, 62, { wall: '#C97B2D', roof: '#22303F' });
      // Warning sign.
      ctx.fillStyle = '#5C3A1A';
      ctx.fillRect(W * 0.8 - 3, H * 0.38, 6, 34);
      signBoard(ctx, W * 0.8, H * 0.38, c.has(1) ? 'DANGER 2' : 'DANGER', '#E74C3C', '#FFFFFF');
      // Small lighthouse, smaller when changed.
      lighthouseTower(ctx, W * 0.92, H * 0.56, c.has(6) ? 62 : 92, 30, '#E74C3C', '#FFFFFF', { lampOn: true });
      // Cove boats.
      if (!c.has(2)) sailboat(ctx, W * 0.1, H * 0.8, 0.6, '#FFFFFF', '#2E4A6B');
      sailboat(ctx, W * 0.28, H * 0.84, 0.6, '#FFD94D', '#7A4A21');
      sailboat(ctx, W * 0.46, H * 0.82, 0.65, '#FFFFFF', '#2E4A6B');
      sailboat(ctx, W * 0.64, H * 0.86, 0.6, '#2ECC71', '#7A4A21');
      sailboat(ctx, W * 0.82, H * 0.82, 0.6, '#FFFFFF', '#2E4A6B');
      // Fisherman silhouette with an umbrella when changed.
      ctx.fillStyle = '#14142A';
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.66, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(W * 0.5 - 6, H * 0.66 + 6, 12, 26);
      if (c.has(7)) {
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.arc(W * 0.5 + 4, H * 0.6, 18, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#14142A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(W * 0.5 + 4, H * 0.6);
        ctx.lineTo(W * 0.5 + 4, H * 0.72);
        ctx.stroke();
      }
      roundBuoy(ctx, W * 0.7, H * 0.88, c.has(3) ? '#F5A524' : '#E74C3C');
    },
  },
];

export function totalDifferences() {
  return SCENES.reduce((n, s) => n + s.diffs.length, 0);
}

// Fairness check for one scene: every difference at least ~6% of panel
// width is a drawing rule, but spacing is checkable here — no two
// differences closer than MIN_DIFF_GAP of panel width, so a click can
// never be ambiguous between two answers.
export function spacingViolations(scene) {
  const bad = [];
  for (let i = 0; i < scene.diffs.length; i++) {
    for (let j = i + 1; j < scene.diffs.length; j++) {
      for (const a of scene.diffs[i].points) {
        for (const b of scene.diffs[j].points) {
          const dx = (a.x - b.x) * PANEL_W;
          const dy = (a.y - b.y) * PANEL_H;
          if (Math.hypot(dx, dy) < 0.1 * PANEL_W) bad.push([i, j]);
        }
      }
    }
  }
  return bad;
}

// shots.js — deterministic screenshot states, driven by ?shot=.
// The maker takes the entry's screenshots by opening the game with
// one of these queries, so every screenshot shows exactly the frame
// it is meant to show: start screen, mid-game with found markers,
// the final screen, or a second scene. Nothing here changes play.

export function readShotQuery() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return null;
  // parseInt with a fallback that respects 0 (hearts=0 is a real state).
  const num = (key, fallback) => {
    const v = parseInt(q.get(key) || '', 10);
    return Number.isInteger(v) ? v : fallback;
  };
  return {
    shot,
    scene: Math.max(0, Math.min(4, num('scene', 0))),
    found: (q.get('found') || '')
      .split(',')
      .filter((s) => s !== '')
      .map((s) => parseInt(s, 10))
      .filter((n) => Number.isInteger(n) && n >= 0 && n < 8),
    score: num('score', 0),
    elapsed: num('elapsed', 0),
    hearts: Math.max(0, Math.min(3, num('hearts', 3))),
    hints: Math.max(0, Math.min(3, num('hints', 3))),
    stars: (q.get('stars') || '3,3,3,3,3').split(',').map((s) => parseInt(s, 10) || 0),
  };
}

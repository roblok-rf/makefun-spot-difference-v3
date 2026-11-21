// config.js — HARBOUR HUNT: one place for every number the game uses.
// Colours follow the style guide: navy framing, gold/amber accents,
// green for found, red for hearts and wrong clicks, white for text.

export const PANEL_W = 560; // logical panel width in px (canvas backing is 2x)
export const PANEL_H = 400; // logical panel height in px
export const CLICK_RADIUS = 0.04; // hit-test tolerance, as a fraction of panel width
export const MIN_DIFF_GAP = 0.1; // minimum gap between two differences, panel-width fraction
export const DIFF_MIN_SIZE = 0.06; // every difference is at least ~6% of panel width

export const MAX_HEARTS = 3;
export const HINTS_PER_RUN = 3;
export const COMBO_WINDOW_MS = 5000; // finds inside this window raise the multiplier
export const COMBO_MAX = 4;
export const LENS_SIZE = 150; // magnifier lens diameter in px
export const LENS_ZOOM = 2.5; // magnifier zoom factor
export const FIND_POINTS = 100;
export const PAR_BONUS = 200;
export const HEART_BONUS = 100;
export const UNUSED_HINT_BONUS = 50;

export const COLORS = {
  navyDeep: '#0B1D3A',
  navy: '#13294B',
  navySoft: '#1B3A5F',
  gold: '#FFC83D',
  amber: '#F5A524',
  amberDark: '#D18A0B',
  green: '#2ECC71',
  greenDark: '#1E9E52',
  red: '#E74C3C',
  white: '#FFFFFF',
  ink: '#0B1D3A',
  muted: '#B9C7DB',
  panelBorder: '#FFFFFF',
};

export const FONTS = {
  family: "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif",
};

// Par times per scene, in seconds (difficulty rises scene by scene).
export const PAR_SECONDS = [90, 105, 120, 135, 150];

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Stars for a cleared scene: time vs par first, then hearts, then hints.
// A hint used caps the scene at 2 stars; losing a heart costs one star.
export function starsForScene(seconds, parSeconds, heartsLeft, hintsUsed) {
  let stars = seconds <= parSeconds ? 3 : seconds <= parSeconds + 30 ? 2 : 1;
  if (heartsLeft < MAX_HEARTS) stars -= 1;
  if (hintsUsed > 0) stars = Math.min(stars, 2);
  return Math.max(1, Math.min(3, stars));
}

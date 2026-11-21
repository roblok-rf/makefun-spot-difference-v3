// input.js — mouse, touch and keyboard play.
// Pointer: a click on either panel counts the same (left and right
// are the same picture, so a click on the left panel's gull is the
// same find as a click on the right panel's gull). Keyboard: arrows
// move a square cursor on the right panel, Enter/Space clicks it,
// H hints, P pauses, M toggles the magnifier.

export function panelFraction(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const fx = (event.clientX - rect.left) / rect.width;
  const fy = (event.clientY - rect.top) / rect.height;
  return { fx, fy, inside: fx >= 0 && fx <= 1 && fy >= 0 && fy <= 1 };
}

export function attachPanelClicks(leftCanvas, rightCanvas, onClick) {
  // A double-click on the same spot must not cost two hearts: ignore
  // a second pointerdown within 300 ms of the previous one.
  let lastAt = 0;
  const handler = (event) => {
    const now = Date.now();
    if (now - lastAt < 300) return;
    lastAt = now;
    const side = event.currentTarget === leftCanvas ? 'left' : 'right';
    const pos = panelFraction(event, event.currentTarget);
    if (!pos.inside) return;
    onClick({ ...pos, side });
  };
  leftCanvas.addEventListener('pointerdown', handler);
  rightCanvas.addEventListener('pointerdown', handler);
  return () => {
    leftCanvas.removeEventListener('pointerdown', handler);
    rightCanvas.removeEventListener('pointerdown', handler);
  };
}

export function attachPanelHover(leftCanvas, rightCanvas, onHover) {
  const handler = (event) => {
    const pos = panelFraction(event, event.currentTarget);
    if (!pos.inside) {
      onHover(null);
      return;
    }
    onHover(pos);
  };
  const leave = () => onHover(null);
  leftCanvas.addEventListener('pointermove', handler);
  rightCanvas.addEventListener('pointermove', handler);
  leftCanvas.addEventListener('pointerleave', leave);
  rightCanvas.addEventListener('pointerleave', leave);
}

// Keyboard cursor state: a square that roams the right panel.
export function createKeyboardCursor() {
  return { fx: 0.5, fy: 0.5, visible: false, step: 0.04 };
}

export function moveKeyboardCursor(cursor, key) {
  const s = cursor.step;
  if (key === 'ArrowLeft') cursor.fx = Math.max(0.02, cursor.fx - s);
  if (key === 'ArrowRight') cursor.fx = Math.min(0.98, cursor.fx + s);
  if (key === 'ArrowUp') cursor.fy = Math.max(0.03, cursor.fy - s);
  if (key === 'ArrowDown') cursor.fy = Math.min(0.97, cursor.fy + s);
  cursor.visible = true;
}

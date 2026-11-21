# TRANSCRIPT.md — HARBOUR HUNT v3 build summary

Entry: **best-spot-the-difference-game-20261121-0451** — "Make the best
spot the difference game", $50, closes Sat 21 Nov 2026 23:51 +07.
Built fresh in `~/workspace/bounty-spot-difference-v3/` in one session
started after the competition opened. The previous entry
("Five Little Worlds") was not read or copied; this game is built from
zero from the design brief and the kit's RULES.txt.

## What was built

- `game/index.html` + `game/style.css` — page shell and navy/gold look.
- `game/src/config.js` — all numbers: panel size, hearts, hints, scoring, stars.
- `game/src/shapes.js` — flat-vector harbour shapes, one helper per object.
- `game/src/scenes.js` — 5 scenes, 8 differences each (40 total), hit-test.
- `game/src/render.js` — both panels, found rings, hint ring, magnifier lenses.
- `game/src/input.js` — mouse, touch and keyboard play.
- `game/src/audio.js` — WebAudio bleeps, no sound files.
- `game/src/shots.js` — `?shot=` states for deterministic screenshots.
- `game/src/main.js` — flow: start, levels, how-to, game, pause, clear,
  game over, final, restart-confirm.
- `main.ts` — hand-in program (copies game/ + screenshots/, writes dossier.json).
- `serve.mjs` — local static server for play and screenshots.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.
- `LICENSE` — MIT, SPDX line first.

## Design decisions

- Screenshot readability first: the top three entries tie at 981521, so
  the frame is the deciding factor. Minimum 18 px text, 56 px "to find",
  flat solid-block scenes.
- Five harbours (dawn, noon, sunset, night, storm), par times rising
  1:30 → 2:30, 8 differences each, at least 5 kinds per scene, spread
  out, never closer than 10% of panel width, click tolerance 4%.
- Differentiator: stars (1–3 per scene) shown on the levels map, the
  clear screen and the final screen.
- Harbour cat mascot kept as a small identity touch.

## Verification

- Screenshots taken with Playwright + Chrome-for-Testing at 1280×800
  and checked visually: start screen, mid-game (3 found, 5 to find),
  final screen, Night Pier mid-game. All four are 1280×800 JPEGs under
  256 KiB: 1-play.jpg 101,305 B, 2-start.jpg 89,628 B, 3-final.jpg
  90,692 B, 4-night.jpg 81,546 B. Noon, Sunset, Storm and the levels
  map were also screenshotted full-size and checked visually.
- Play-through (automated, real UI, no `?shot=`): **40/40 checks
  passed, zero page errors.** All 5 scenes played start to finish,
  every one of the 40 differences clicked (alternating left/right
  panels); wrong click costs a heart (♥♥♥ → ♥♥♡); hint 3 → 2 with a
  gold ring; pause → resume; magnifier toggles on/off with M and the
  lens follows the cursor on both panels; keyboard cursor moves with
  arrows and Enter finds a difference; game over after 3 wrong clicks
  (OUT OF HEARTS, "8 differences left") → TRY AGAIN restarts the scene
  with 3 hearts; final screen HARBOUR MASTER! with score 16,100 and
  13/15 stars in that run; levels map shows all 5 unlocked after the
  full run; restart-confirm (Yes) returns to the start screen and a
  fresh run locks scenes 2–5 again.
- Scene data validated by script: 40 differences, 8 per scene, 5–8
  kinds per scene, every difference hit-testable at all its click
  points, zero spacing violations (nothing closer than 10% of panel
  width).
- `MAKEFUN_OUTPUT_DIR=out node main.ts` run locally: dossier builds,
  schema `makefun/dossier/v1`, cover 0, 4 images, 10 source files
  (74,310 bytes). The parent runs the kit's local check before submit.

## Fixes found by the visual checks

- The start screen rendered blank at first: `?shot=start` returned
  before any screen was shown. Fixed — the start screen is now shown
  by default and `?shot=` only overrides it.
- The dawn sun was hidden behind the middle house roof. Moved to open
  sky (0.55, 0.34 → 0.26 when changed) so the size/position difference
  is visible in both panels.
- The night ferry's windows hid behind the pier planks. The ferry now
  rides lower on the water (deck 0.76H) so its yellow/blue windows are
  fully visible.
- The night bat was near-invisible (dark on dark). Recoloured to a
  muted grey-blue and enlarged; the café was brightened and the big
  star enlarged.
- The start-screen crescent moon ended up behind the HARBOUR HUNT
  title. Removed — the backdrop is starlit only now.

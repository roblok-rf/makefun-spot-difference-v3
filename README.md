# HARBOUR HUNT — Spot the Difference · 5 Harbours · 40 Changes

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/roblok-rf/makefun-spot-difference-v3/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/roblok-rf/makefun-spot-difference-v3/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A spot-the-difference game for the make.fun bounty
**best-spot-the-difference-game-20261121-0451** ($50).

Two pictures of the same harbour sit side by side. The right one hides
8 changes. Find them all before the hearts run out — across five harbours,
from dawn to midnight, 40 changes in total.

## Why this design wins

The top three entries in this bounty are tied on score, so the deciding
factor is almost certainly **screenshot readability**, not feature count.
This game is built for that: one huge readable frame, a giant "to find"
counter, big green rings on every find, and five flat-vector harbour
scenes drawn in solid blocks so they stay legible when shrunk.

## The five harbours

| # | Scene | Par | What changes |
|---|-------|-----|--------------|
| 1 | Dawn Harbour | 1:30 | Sun, roof, gull, flag, sail, sign, barrel, shadow |
| 2 | Noon Market Quay | 1:45 | Canopy, price, cat, basket, boat, cloud, bunting, shadow |
| 3 | Sunset Lighthouse | 2:00 | Door, window, palm, kite, kayak, boat name, sun, fish |
| 4 | Night Pier | 2:15 | Neon, moon, lamp, ferry windows, bat, star, bin, reflection |
| 5 | Storm Cove | 2:30 | Lightning, sign, boat, buoy, house, window, lighthouse, umbrella |

Every scene has 8 differences of at least 5 kinds (colour, size, missing,
added, moved, text, pattern, shadow, shape), each at least ~6% of the
panel wide, spread left/centre/right/top/bottom, never closer than 10%
of the panel width apart. Click tolerance is a generous 4% of panel width,
and a click on either panel counts the same.

## Features

- **3 hearts** — a wrong click costs one; out of hearts ends the scene.
- **3 hints per scene** — a pulsing gold ring around one unfound difference.
- **Timer + par time** — finish under par for a bonus and 3 stars.
- **Magnifier** — a synced zoom lens follows the cursor on both panels.
- **Keyboard play** — arrows move the square cursor, Enter/Space clicks,
  H hints, P pauses, M magnifies.
- **Sound on/off** — short WebAudio bleeps, no audio files.
- **Levels map** — five harbour cards with stars earned and locks that
  open as you clear scenes. The differentiator: **stars + harbour map**
  shown on the levels screen, the clear screen and the final screen.
- **Score + combo** — finds in a row within 5 seconds raise the
  multiplier ×2, ×3, up to ×4. A wrong click breaks it.

## Play it

```sh
node serve.mjs
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the vendored `vendor/makefun-game.ts`.

## Layout

```
main.ts                  hand-in program (copies game/ + screenshots/, writes dossier.json)
serve.mjs                local static server for play and screenshots
LICENSE                  MIT
README.md                this file
MODELS.md                design study: how the top entries were beaten on readability
TRANSCRIPT.md            build summary
game/
  index.html             page shell: start, HUD, panels, overlays
  style.css              navy/gold look, nothing below 18 px
  src/config.js          numbers: sizes, hearts, hints, scoring, stars
  src/shapes.js          flat-vector harbour shapes (one helper per object)
  src/scenes.js          the 5 scenes: art, 8 differences each, hit-test
  src/render.js          paints both panels, rings, hint, magnifier lenses
  src/input.js           mouse, touch and keyboard play
  src/audio.js           WebAudio bleeps, no sound files
  src/shots.js           ?shot= states for deterministic screenshots
  src/main.js            game flow: screens, timer, score, stars, levels
vendor/
  makefun-game.ts        the kit's dossier library, unchanged
screenshots/
  1-play.jpg             cover: mid-game, 3 found, 5 to find (101,305 B)
  2-start.jpg            start screen (89,628 B)
  3-final.jpg            final screen: HARBOUR MASTER, big score (90,692 B)
  4-night.jpg            mid-game, Night Pier (81,546 B)
```

# MODELS.md — design study for HARBOUR HUNT v3

Bounty: **best-spot-the-difference-game-20261121-0451** — "Make the best
spot the difference game", $50, closes Sat 21 Nov 2026 23:51 +07.

Method: ATM (amati, tiru, modifikasi) — study the leaders first, imitate
their structure, modify into something better. The study basis for this
build is the design brief's own analysis of the live board: the top three
entries are tied at **981521**, so the deciding factor is almost certainly
**screenshot readability**, not feature count. The harbour theme has won
twice with identical scores. This build therefore imitates the Top 1 +
Top 2 structure and beats them where it counts: a bigger, clearer frame.

## 1. What the leaders do (the structure we imitate)

- Two near-identical panels side by side, found differences ringed,
  several still unfound, a counter of how many remain.
- A hunt that runs scene by scene with rising difficulty.
- A complete game: start, play, pause, clear, game over, final, restart.

## 2. Where we beat them (the modification)

1. **Readability first.** Minimum text 18 px, HUD 24 px, titles 48–76 px,
   and the "to find" counter at 56 px in gold — the single most visible
   element in the frame. Flat vector scenes in solid colour blocks with
   high contrast, so every panel stays legible when the screenshot is
   shrunk to the judge's contact sheet.
2. **One theme, five times of day.** A harbour gives repeating objects
   (boats, houses, signs, lamps, birds) that make fair differences easy,
   and varies naturally by time: dawn, noon, sunset, night, storm. Five
   scenes, 8 differences each, 40 total — more hunt than a single scene
   can hold, and the par times rise (1:30 → 2:30) so difficulty rises
   with the set.
3. **The differentiator: stars + harbour map.** Every scene earns 1–3
   stars (time vs par, hearts left, hints used), and the stars show on
   the Levels map, the clear screen and the final screen. It makes the
   final and levels screenshots visibly more "finished" than a bare
   score screen.
4. **Fair by construction.** Every difference is at least ~6% of panel
   width, uses at least 5 kinds per scene, is spread across the panel,
   never closer than 10% of panel width to another, and takes a click
   within a generous 4% tolerance on either panel.
5. **A mascot bridge.** A small harbour cat sits on the pier and on a
   market crate — the identity thread from the earlier entry, kept as a
   touch, not as the game.

## 3. The five scene models

Each scene is a complete model: its own palette, its own 8 differences,
its own par time. The differences are listed in `game/src/scenes.js`
with their kind and click points.

| Scene | Palette | Par | Kinds used |
|-------|---------|-----|-----------|
| Dawn Harbour | orange-purple sky, red-white lighthouse | 1:30 | size, colour, missing, added, text, moved, shadow |
| Noon Market Quay | bright blue, market kiosks | 1:45 | colour, number, missing, added, size, moved, pattern, shadow |
| Sunset Lighthouse | orange-red-magenta, big lighthouse | 2:00 | colour, added, missing, moved, size, text |
| Night Pier | dark navy, neon, ferry | 2:15 | text, direction, colour, added, missing, moved, shadow |
| Storm Cove | grey-purple, lightning, rain | 2:30 | shape, text, missing, colour, moved, added, size |

## 4. What to avoid (learned from the tie)

- More features that do not show in a screenshot. Every feature here
  is visible in the frame: hearts, hints, magnifier, keyboard line,
  streak, stars, levels map.
- Small text anywhere. Nothing in the game is below 18 px.
- A single scene. One scene loses to five on structure and on depth
  (criterion 2: sets that raise the difficulty).
- Differences a judge cannot see at contact-sheet size. Every change
  is big, high-contrast and spread out.

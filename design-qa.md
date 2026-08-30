# Design QA — One-column portfolio homepage

## Evidence

- Reference: `/var/folders/sq/_dvnjcc95t7_clhwnk7brb0c0000gn/T/TemporaryItems/NSIRD_screencaptureui_oCjB9z/Screenshot 2026-08-30 at 11.20.09 AM.png`
- Reference size: 1990 × 1132 px
- Implementation captures:
  - `/Users/heidi/Documents/Personal Portofolio/homepage-top.png`
  - `/Users/heidi/Documents/Personal Portofolio/homepage-interests-final.png`
  - `/Users/heidi/Documents/Personal Portofolio/homepage-interest-slideshow.png`
  - `/Users/heidi/Documents/Personal Portofolio/homepage-compact-screen-1.png`
  - `/Users/heidi/Documents/Personal Portofolio/homepage-compact-screen-2.png`
  - `/Users/heidi/Documents/Personal Portofolio/homepage-ten-photo-film.png`
  - `/Users/heidi/Documents/Personal Portofolio/homepage-ten-photo-film-scrolled.png`
  - `/Users/heidi/Documents/Personal Portofolio/homepage-filmstrip.png`
- Verification viewport: 1280 × 720 px
- Final desktop page height: 1352 CSS px, or 1.88 viewport heights. The maximum vertical scroll is 632 px, slightly less than one 720 px screen.
- State: homepage, editor mode off; editor-on state also checked separately

## Comparison

The reference is a conceptual wireframe for a single-column story: opening biography, four circular interest links, continued biography, and a movie-strip photo area. The implementation preserves that exact content order while applying the portfolio's existing warm drafting-paper palette, serif display typography, navy accents, and real project imagery.

Focused comparisons confirmed:

- Intro section reads as a single centered opening rather than the former left/right split.
- Four interest links are equal-size circles, visually distinct, and route to their existing category pages.
- Each circle restores the previously selected image list from the original `category-cover:<category>` browser storage entry. When more than one image was selected, the circle cross-fades through that exact list every second while hovered or keyboard-focused, then returns to the first image when the pointer leaves.
- The second biography section continues below the project interests and uses personal, lifestyle-oriented English copy.
- The final photo browser is framed as a horizontal film strip that can be browsed directly without leaving the homepage.

## Interaction checks

- Architecture category link opens the Architecture page.
- Existing category image selections remain non-destructively stored and are loaded without changing or replacing their saved values.
- Multi-image circles use a one-second timer and a 700 ms opacity transition while hovered.
- The Life in Frames section now contains ten real temporary images and no links to the separate gallery.
- A 431 px vertical wheel gesture over the film moved the film horizontally from 0 to 340 px while the page stayed at the same vertical position, confirming the film captures scrolling only while hovered.
- Wrench button toggles editor mode without leaving the page.
- Editor mode reveals the local multi-image chooser and existing editable text controls.
- No application errors were observed during the final browser check; only normal Vite development messages were present.

## Iteration history

- P2: The first Architecture circle initially used a text-heavy project board that cropped poorly inside a circle.
- Fixed: Replaced it with a cleaner architectural model image and re-captured the interests section.
- P2: The initial story layout measured 3470 px tall at a 720 px viewport, requiring almost four full screens of scrolling and making the homepage feel oversized.
- Fixed: Reduced the desktop title, headings, copy, circles, section spacing, and film frames. Post-fix evidence is split across the two 1280 × 720 compact screenshots; the full page now measures 1352 px and fits within two screen lengths.
- P2: The compact film still offered an “Open photo gallery” link and only four default frames, which no longer matched the requested browsing behavior.
- Fixed: Removed the heading link and every link around the frames, expanded the temporary film content to ten real images, added a clear scroll hint, and verified horizontal wheel scrolling in the post-fix capture.

## Final result

final result: passed

No remaining P0, P1, or P2 visual issues were found in the verified desktop state.

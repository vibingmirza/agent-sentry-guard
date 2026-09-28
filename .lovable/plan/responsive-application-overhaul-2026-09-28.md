# Responsive application overhaul

## Scope
Make the landing screen and every console view comfortable and stable on mobile, tablet, and desktop without changing existing workflows, labels, or data behavior.

## Implementation
- Replace the fixed desktop-only console shell with responsive navigation: keep the sticky sidebar on desktop and provide a compact mobile header with a slide-over navigation menu below 768px.
- Reflow dense header controls into clear mobile rows, keep fixed-size icons stable, and prevent identity, status, language, region, theme, and account controls from clipping.
- Apply mobile-first spacing and typography across the landing screen, playground, admin, compliance, analytics, war room, federation, developer, audit, maps, diagnostics, and terminal sections.
- Stack multi-column layouts at narrow widths and use two-column/tablet or full desktop grids where space permits.
- Make primary actions and form controls full-width on mobile, while retaining compact desktop sizing.
- Keep data tables inside horizontal scroll regions with explicit minimum widths; make section headers wrap cleanly and preserve readable columns.
- Adapt the war-room stage timeline and dense telemetry rows for narrow screens, and ensure long code, hashes, logs, and status text wrap or scroll without expanding the page.
- Remove viewport-height and fixed-footer assumptions that can cover content on short mobile screens.

## Verification
- Exercise the landing screen, mobile navigation, and every console tab at mobile, tablet, and desktop widths.
- Check for horizontal page overflow, clipped text, overlapping controls, inaccessible actions, and unstable chart/map sizing.
- Confirm the latest build and runtime logs are clean.

## Technical details
- Use the existing Tailwind v4 breakpoints and semantic design tokens.
- Reuse the existing design-system controls and add only a focused responsive navigation component/state where required.
- Keep all application logic and backend behavior unchanged.

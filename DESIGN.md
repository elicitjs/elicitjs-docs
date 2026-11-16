# Design system

How the docs site is styled, and where to change it. (For how to *write* the
docs, see `STYLE.md`.)

Stack: Tailwind CSS v4, shadcn/ui (Radix, `components/ui`), `next-themes` for
light/dark, Lucide icons. Fonts: Geist (UI), Geist Mono (code), Raleway
(headings, the lab logo's typeface).

## Three tiers

| Tier | File | What lives there |
| --- | --- | --- |
| 1. Palette | `styles/brand.css` | Seeds (`--brand-teal`, `--brand-blue`, `--brand-ink`) and the scales mixed from them: `--teal-50…950`, `--blue-50…950`, `--neutral-0…950`. |
| 2. Roles | `app/globals.css` | Semantic tokens for light (`:root`) and dark (`.dark`): shadcn's roles (`--background`, `--primary`, `--muted-foreground`, `--border`, `--ring`, `--sidebar-*`, `--chart-1…5`) and the docs' own (`--brand`, `--link`, `--surface-subtle`, `--code`, `--success`, `--syntax-*`, …). `@theme inline` exposes them as utilities (`bg-card`, `text-faint-foreground`, `border-border-strong`). |
| 3. Components | `components/ui/*`, `components/site/*`, `styles/docs.css`, `styles/playground.css` | shadcn primitives; the site shell (sidebar, mobile sheet, brand, theme toggle); and the component classes MDX pages emit (`.lead`, `.intro`, `code.inline`, `.card`, `.api-*`, `.hero-*`). |

Each tier reads only from the tier above. A component never names a hex value
or a scale step; it names a role.

## Changing colours

- **The whole palette:** edit the two seeds at the top of `styles/brand.css`.
  Every scale, role, light and dark, follows.
- **What a role maps to** (e.g. make links teal): edit that token in
  `app/globals.css`, in `:root` and `.dark`.
- **Chart colours in dark mode:** `lib/chartTheme.ts` (see below). The library
  paints to canvas as well as SVG, so these are hex, not CSS variables. Keep
  them in step with the seeds.

## Light and dark

`next-themes` puts `.dark` on `<html>`. The default is light, and the reader
can choose Light, Dark or System from the toggle in the sidebar or top bar.

Charts follow the mode. `ExampleLive` calls `setTheme()` before every eval:
`'dd'` in light mode and `DD_DARK` (which `extends: 'dd'`) in dark. Toggling
the mode re-runs each example. An example's own `theme` still layers on top,
and so do colours an example hardcodes.

## Layout and breakpoints

- **≥ 1024px (`lg`):** a sticky sidebar beside the content. Desktop has no
  sticky header on purpose: the library's browser gate drags charts at
  viewport coordinates, and a bar over the page could cover them.
- **< 1024px:** a sticky top bar. The page list opens in a `Sheet`.
- **≤ 940px:** example cards stack code above the chart.
- **≤ 720px:** API option tables collapse to one row per option.
- **Overflow:** the page never scrolls sideways. A fixed-width chart scrolls
  inside its `.chart` box, and wide tables scroll inside `.api-table-wrap`.

## Adding UI

- Use a shadcn primitive first: `npx shadcn@latest add <name>`. Components land
  in `components/ui`. After adding, check that `cn` imports from
  `@/lib/utils`. The CLI once rewrote it to a bare `"cn"` npm package.
- Style with role utilities (`bg-muted`, `text-muted-foreground`,
  `border-border`), not palette steps or arbitrary hex.
- MDX content uses the classes in `styles/docs.css`. Add a class there rather
  than inline styles.

## Load-bearing DOM (don't break)

`../elicitjs/scripts/verify-browser.mjs` selects on section ids and descendant
selectors: `#id .chart svg`, `.data-body`, `.live-error`, `.result`, `.grid`,
and the playground's `.canvas-device-frame`, `.catalog-tab`, `.catalog-item`,
`.add-layer-btn`, `.add-inline-select`, `.drawer-code`. It also takes a section's
**first `<svg>`**, so no icon may sit before a chart inside a `<section>` or an
example card. That is why the card buttons are text-only. Run
`npm run verify:browser` and `npm run check:warnings` in `../elicitjs` after
layout changes.

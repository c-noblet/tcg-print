# TCG Print

Print trading card images at exact physical sizes for sleeving/cutting (A4 pages).

Small web utility that lays out TCG images on an A4 sheet at the correct physical dimensions so you can print, cut, and sleeve them for play.

## Features
- Fixed 3×3 grid per A4 page (9 cards/page) optimized for cutting.
- Supports multiple card types with correct physical sizes:
  - Yu-Gi-Oh!: 59 × 86 mm (2.3" × 3.4")
  - Magic / Pokémon / Standard: 63 × 88 mm (2.48" × 3.46")
- Drag & drop or click to upload images into slots.
- Print-ready styles that enforce card sizes in print mode.

## Files
- `index.html` — main web UI. Open in a browser to use.

## Usage
1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. Select the card type from the dropdown.
3. Click a slot (or `Upload Images`) or drag & drop one or multiple images onto the grid.
4. When ready, press `Ctrl+P` (or use the browser Print command)
   - Set **Scale** to **100%** or choose **Actual Size**.
   - Use **A4** paper size.
   - Disable headers/footers (print background graphics if needed).
   - Choose correct printer and click Print.

## Printing Tips / Troubleshooting
- Make sure browser print preview shows A4 page with 10mm margins from the app.
- Disable any “Fit to page” or “Shrink to fit” options — they will change the physical size.
- In Chrome/Edge: uncheck **Headers and footers**, set **Scale** to **100%**, and enable **Background graphics** if you want background colors.
- If cards appear off-grid in the preview:
  - Confirm you selected the correct card type before printing.
  - Check that the preview scale is 100% and that page size is A4.
  - Some printers add unprintable margins; test printing on plain paper and measure the result. Adjust printer margins or use a different printer if necessary.

## Development
- Single-file app — open `index.html` in a browser for local testing.

## License
MIT License — see LICENSE (or consider this repository under MIT terms).

---

If you want, I can add a small export-to-PDF button, add crop/bleed guides, or generate multiple A4 pages automatically for large image sets. Which would you like next?

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow to publish the site to GitHub Pages on push to `main` or `master`:

- Workflow path: `.github/workflows/deploy-pages.yml`
- It uploads the repository contents and deploys them using the official Pages actions.

To enable Pages on the repository (if not already enabled):
1. Go to the repository on GitHub → Settings → Pages.
2. Under "Build and deployment", ensure the branch is set to `gh-pages` (auto-managed by the action) or follow the on-screen steps.
3. After the first push to `main`/`master`, check the Actions tab for the `Deploy to GitHub Pages` run and wait for deployment to complete.

Note: the workflow deploys the repo root; adjust the `path` in `.github/workflows/deploy-pages.yml` if you want to publish a subdirectory instead.
# elicitjs.github.io

The source of the Elicit.js documentation site, live at <https://elicitjs.github.io/>.

Every push to `main` builds the site and publishes it with GitHub Pages
(see `.github/workflows/deploy-pages.yml`). Nothing built is committed.
`/DEPLOY.json` on the live site names the commit it was built from.

## Working on it

The site imports the library from a sibling checkout, so clone both side by side:

```
elicitJS/
  elicitjs/        https://github.com/elicitjs/elicitjs
  elicitjs-docs/   this repo
```

The library's browser checks look for the docs at `../elicitjs-docs`, so keep that
folder name.

```bash
npm install
npm run dev                            # dev server
npm run build:site && npx serve out    # preview exactly what ships
```

A change to the library alone does not rebuild the site. Run the
"Deploy site to GitHub Pages" workflow by hand from the Actions tab to pick it up.

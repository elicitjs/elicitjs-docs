import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createMDX from '@next/mdx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Parent of docs + library siblings (elicitJS/). Needed so Next can follow
// imports into ../elicitjs/src.
const workspaceRoot = path.resolve(__dirname, '..');
const libRoot = path.join(workspaceRoot, 'elicitjs');
const elicitEntry = path.join(libRoot, 'src/index.js');
const rawLoader = path.join(__dirname, 'loaders/raw-string-loader.cjs');

// Static export is OPT-IN, via DOCS_EXPORT=1 (see scripts/deploy-pages.mjs).
// It must never be the default: `next dev` backs both regression gates in the
// library repo (verify:browser drives real gestures, check:warnings reads console
// output), and an exported build has no dev server to drive. Gating it here keeps
// one config honest for both jobs.
const isExport = process.env.DOCS_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves no directory-index rewrites, so every route is emitted as
  // its own `index.html` under a trailing-slash path.
  ...(isExport ? { output: 'export', trailingSlash: true, images: { unoptimized: true } } : {}),
  // Allow importing the library from the sibling ../elicitjs/src
  outputFileTracingRoot: workspaceRoot,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  turbopack: {
    root: workspaceRoot,
    resolveAlias: {
      // Relative to this app root — absolute paths break Turbopack
      // ("server relative imports").
      '@elicit': '../elicitjs/src/index.js',
    },
    rules: {
      '*.example.txt': {
        loaders: [rawLoader],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@elicit': elicitEntry,
    };
    // Plain text chart bodies — never parsed as JS (avoids dev HMR / import.meta in eval strings).
    config.module.rules.unshift({
      test: /\.example\.txt$/,
      type: 'asset/source',
    });
    return config;
  },
  transpilePackages: [],
};

// No remark/rehype plugins, deliberately. Turbopack needs plugins as serializable
// strings (the config crosses into Rust), so a local plugin cannot be passed. It is
// also load-bearing for the regression gate: scripts/verify-browser.mjs roots its
// assertions at section ids with DESCENDANT selectors (`#band .chart > div`), so an
// id must sit on an ancestor that CONTAINS the charts. rehype-slug would move ids
// onto the <h2>, silently breaking ~20 checks. Section ids come from <Section>.
const withMDX = createMDX({});

const config = withMDX(nextConfig);

// Re-assert the raw chart-body rules AFTER withMDX, so its merge can never drop them.
// These are load-bearing: every live example is a plain-text `mount(Elicit({…}))`
// body that must never be parsed as a JS module (which would inject dev HMR /
// import.meta into the eval string).
config.turbopack.rules['*.example.txt'] = { loaders: [rawLoader], as: '*.js' };

export default config;

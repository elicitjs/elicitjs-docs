// build-vendor.mjs — bundle the two vendor scripts as IIFEs, so the site loads
// with plain <script> tags and opens from file://.
//
//   cd tools && npm install && node build-vendor.mjs
//
// The ElicitJS bundle is built from ../../../elicitjs/src, so rebuild it after a
// library change. d3 is resolved from the library's own node_modules, so the
// library and the gallery's data prep share one copy.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../vendor');
const lib = path.resolve(here, '../../../elicitjs');

await build({
    entryPoints: [path.join(here, 'vendor-src/elicit.js')],
    bundle: true, format: 'iife', minify: true, legalComments: 'none',
    outfile: path.join(out, 'elicit-bundle.js'),
    alias: { d3: path.join(lib, 'node_modules/d3/src/index.js') },
    nodePaths: [path.join(here, 'node_modules')],
});
await build({
    entryPoints: [path.join(here, 'vendor-src/originals.js')],
    bundle: true, format: 'iife', minify: true, legalComments: 'eof',
    outfile: path.join(out, 'originals-bundle.js'),
    nodePaths: [path.join(here, 'node_modules')],
});
console.log('vendor bundles written to', path.relative(process.cwd(), out));

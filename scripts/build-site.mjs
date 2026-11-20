#!/usr/bin/env node
/**
 * build-site.mjs: build the static site into out/, ready for GitHub Pages.
 *
 *   npm run build:site        regenerate the API index, export, prune, stamp
 *
 * This repo is elicitjs/elicitjs.github.io: it holds the source AND is the Pages
 * site. Nothing built is ever committed. On every push to main,
 * .github/workflows/deploy-pages.yml runs this script and hands out/ to GitHub
 * Pages as an artifact. Locally, run it and serve the result to preview exactly
 * what would ship:
 *
 *   npm run build:site && npx --yes serve out
 *
 * Two things here are load-bearing and easy to lose:
 *
 *   - The API index is regenerated from the library on every build rather than
 *     trusted to be current in the tree. A stale index is the one kind of
 *     documentation error that looks authoritative.
 *   - EXCLUDE. `/test` is a local scratch page for driving the library during
 *     development; it is not documentation and must not ship.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const libRoot = path.resolve(docsRoot, "..", "elicitjs");
const outDir = path.join(docsRoot, "out");

// Routes the build emits that are not documentation.
const EXCLUDE = ["test"];

const sh = (cmd, cmdArgs, cwd) =>
  execFileSync(cmd, cmdArgs, { cwd, encoding: "utf8" }).trim();
const step = (msg) => console.log(`\n\x1b[1m→ ${msg}\x1b[0m`);
const die = (msg) => {
  console.error(`\n\x1b[31m✗ ${msg}\x1b[0m\n`);
  process.exit(1);
};

// ---- Preconditions ---------------------------------------------------------
step("Checking the workspace");

if (!fs.existsSync(path.join(libRoot, "package.json"))) {
  die(
    `The library is not beside the docs: expected ${libRoot}.\n` +
      `  The docs build imports it through the @elicit alias, so it must be checked out.`,
  );
}

const sourceSha = sh("git", ["rev-parse", "HEAD"], docsRoot);
const sourceDirty = Boolean(sh("git", ["status", "--porcelain"], docsRoot));
let libSha = null;
try {
  libSha = sh("git", ["rev-parse", "HEAD"], libRoot);
} catch {}
const libVersion = JSON.parse(
  fs.readFileSync(path.join(libRoot, "package.json"), "utf8"),
).version;

console.log(
  `  docs    ${sourceSha.slice(0, 8)}${sourceDirty ? " (dirty)" : ""}`,
);
console.log(
  `  library elicitjs@${libVersion}${libSha ? ` @ ${libSha.slice(0, 8)}` : ""}`,
);

// ---- Build -----------------------------------------------------------------
step("Regenerating the API index from the library");
execFileSync("node", [path.join(docsRoot, "scripts/gen-api-index.mjs")], {
  cwd: docsRoot,
  stdio: "inherit",
});
execFileSync("node", [path.join(docsRoot, "scripts/gen-json-api.mjs")], {
  cwd: docsRoot,
  stdio: "inherit",
});

step("Building the static export (DOCS_EXPORT=1 next build)");
fs.rmSync(outDir, { recursive: true, force: true });
execFileSync("npx", ["next", "build"], {
  cwd: docsRoot,
  stdio: "inherit",
  env: { ...process.env, DOCS_EXPORT: "1" },
});

if (!fs.existsSync(path.join(outDir, "index.html"))) {
  die("The build produced no out/index.html: nothing to deploy.");
}

for (const route of EXCLUDE) {
  fs.rmSync(path.join(outDir, route), { recursive: true, force: true });
  fs.rmSync(path.join(outDir, `${route}.html`), { force: true });
  fs.rmSync(path.join(outDir, `${route}.txt`), { force: true });
}

const pageCount = sh("find", [outDir, "-name", "index.html"])
  .split("\n")
  .filter(Boolean).length;

// Served at /DEPLOY.json, so the live site can always be traced to a commit.
fs.writeFileSync(
  path.join(outDir, "DEPLOY.json"),
  JSON.stringify(
    {
      builtAt: new Date().toISOString(),
      sourceRepo: "elicitjs/elicitjs.github.io",
      sourceCommit: sourceSha,
      sourceDirty,
      libraryVersion: libVersion,
      libraryCommit: libSha,
      pages: pageCount,
    },
    null,
    2,
  ) + "\n",
);

console.log(`\n\x1b[32m✓ Built ${pageCount} pages into out/\x1b[0m\n`);

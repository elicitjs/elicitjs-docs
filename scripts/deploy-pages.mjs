#!/usr/bin/env node
/**
 * deploy-pages.mjs — publish the built docs to elicitjs/elicitjs.github.io.
 *
 *   npm run deploy:pages              build, sync, commit, push
 *   npm run deploy:pages -- --dry-run build and sync, then stop before committing
 *   npm run deploy:pages -- --allow-dirty   deploy from an uncommitted tree
 *
 * THE SHAPE OF THIS: two repos, one direction.
 *
 *   elicitjs-docs        the SOURCE. Private, holds the MDX, the components and
 *                        the examples. This is the only place anything is edited.
 *   elicitjs.github.io   the BUILD. Public, holds nothing but `next build`'s
 *                        static output. Never edited by hand — every commit here
 *                        is written by this script and names the source commit it
 *                        came from, so the live site can always be traced back to
 *                        a docs revision.
 *
 * The two stay synced because the build repo is DERIVED, not maintained. If it
 * ever disagrees with the source, re-running this script is the repair: the sync
 * deletes whatever the build no longer produces. Don't commit into the build repo
 * directly — the next deploy would silently revert it.
 *
 *
 * Three things here are load-bearing and easy to lose:
 *
 *   - `.nojekyll`. GitHub Pages runs Jekyll by default, and Jekyll SKIPS every
 *     path beginning with an underscore. Next puts all of its JS and CSS under
 *     `_next/`, so without this file the site serves as unstyled HTML with no
 *     charts — and it does it silently, with a 200 on every page.
 *   - The clean-tree guard. A build from a dirty tree cannot be traced to a
 *     commit, which makes the stamp a lie. `--allow-dirty` records the fact.
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
const workspace = path.resolve(docsRoot, "..");
const pagesRoot = path.join(workspace, "elicitjs.github.io");
const libRoot = path.join(workspace, "elicitjs");
const outDir = path.join(docsRoot, "out");

const PAGES_REMOTE = "elicitjs/elicitjs.github.io";
const SITE_URL = "https://elicitjs.github.io/";

// Routes the build emits that are not documentation.
const EXCLUDE = ["test"];

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const allowDirty = args.includes("--allow-dirty");

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
if (!fs.existsSync(path.join(pagesRoot, ".git"))) {
  die(
    `No Pages checkout at ${pagesRoot}.\n` +
      `  Clone it first:\n` +
      `    git clone https://github.com/${PAGES_REMOTE}.git ${pagesRoot}`,
  );
}

// The Pages repo must be the real one. Deleting the contents of the wrong
// directory is the one mistake here that hurts.
const pagesRemote = sh("git", ["remote", "get-url", "origin"], pagesRoot);
if (!pagesRemote.includes(PAGES_REMOTE)) {
  die(
    `${pagesRoot} points at ${pagesRemote}, not ${PAGES_REMOTE}. Refusing to sync.`,
  );
}

const docsDirty = sh("git", ["status", "--porcelain"], docsRoot);
if (docsDirty && !allowDirty) {
  die(
    `The docs tree has uncommitted changes, so this build could not be traced\n` +
      `  back to a commit. Commit them, or pass --allow-dirty to record the build\n` +
      `  as provisional.\n\n${docsDirty.split("\n").slice(0, 10).join("\n")}`,
  );
}

const sourceSha = sh("git", ["rev-parse", "HEAD"], docsRoot);
const sourceBranch = sh("git", ["rev-parse", "--abbrev-ref", "HEAD"], docsRoot);
const libVersion = JSON.parse(
  fs.readFileSync(path.join(libRoot, "package.json"), "utf8"),
).version;

console.log(
  `  docs   ${sourceBranch} @ ${sourceSha.slice(0, 8)}${docsDirty ? " (dirty)" : ""}`,
);
console.log(`  library elicitjs@${libVersion}`);
console.log(`  target  ${pagesRoot}`);

// ---- Build -----------------------------------------------------------------
// The API index is derived from the library's exports, so it is regenerated on
// every deploy rather than trusted to be current in the tree. A stale index is
// the one kind of documentation error that looks authoritative.
step("Regenerating the API index from the library");
execFileSync("node", [path.join(docsRoot, "scripts/gen-api-index.mjs")], {
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
  die("The build produced no out/index.html — nothing to deploy.");
}

for (const route of EXCLUDE) {
  fs.rmSync(path.join(outDir, route), { recursive: true, force: true });
  fs.rmSync(path.join(outDir, `${route}.html`), { force: true });
  fs.rmSync(path.join(outDir, `${route}.txt`), { force: true });
}

const pageCount = sh("find", [outDir, "-name", "index.html"])
  .split("\n")
  .filter(Boolean).length;
console.log(`\n  ${pageCount} pages exported`);

// ---- Sync ------------------------------------------------------------------
// --delete is what makes the build repo derived rather than accumulated: a page
// removed from the docs disappears from the site. The excludes are the only
// things in that repo this script does not own.
step(`Syncing out/ → ${path.basename(pagesRoot)}/`);
execFileSync(
  "rsync",
  [
    "-a",
    "--delete",
    "--exclude",
    ".git/",
    "--exclude",
    "CNAME", // a custom domain, if one is ever configured
    "--exclude",
    "README.md", // the build repo's own explanation of itself
    `${outDir}/`,
    `${pagesRoot}/`,
  ],
  { stdio: "inherit" },
);

// Jekyll would drop _next/ and serve a chartless site with a 200 on every page.
fs.writeFileSync(path.join(pagesRoot, ".nojekyll"), "");

fs.writeFileSync(
  path.join(pagesRoot, "DEPLOY.json"),
  JSON.stringify(
    {
      deployedAt: new Date().toISOString(),
      sourceRepo: "elicitjs/elicitjs-docs",
      sourceBranch,
      sourceCommit: sourceSha,
      sourceDirty: Boolean(docsDirty),
      libraryVersion: libVersion,
      pages: pageCount,
    },
    null,
    2,
  ) + "\n",
);

// The build repo explains itself, so nobody edits it by hand.
fs.writeFileSync(
  path.join(pagesRoot, "README.md"),
  `# elicitjs.github.io\n\n` +
    `The ElicitJS documentation site, live at <${SITE_URL}>.\n\n` +
    `**This repository is generated. Do not edit it by hand** — the next deploy\n` +
    `overwrites everything here.\n\n` +
    `The source lives in [elicitjs/elicitjs-docs](https://github.com/elicitjs/elicitjs-docs).\n` +
    `To publish a change, edit it there and run \`npm run deploy:pages\`.\n` +
    `\`DEPLOY.json\` records which source commit produced the current build.\n`,
);

// ---- Commit ----------------------------------------------------------------
// A full site is ~14 MB across a couple of hundred files, which is enough for
// git's default 1 MB HTTP post buffer to fail the push with a bare `HTTP 400 /
// unexpected disconnect`. The commit has already landed by then, so a naive
// retry stacks a second identical commit on top of the first. Raise the buffer
// once, and treat "committed but unpushed" as a state to finish rather than to
// repeat.
function pushPages() {
  if (
    sh("git", ["config", "--local", "--get", "http.postBuffer"], pagesRoot) ===
    ""
  ) {
    sh("git", ["config", "--local", "http.postBuffer", "524288000"], pagesRoot);
    sh("git", ["config", "--local", "http.version", "HTTP/1.1"], pagesRoot);
  }
  execFileSync("git", ["push", "origin", "HEAD"], {
    cwd: pagesRoot,
    stdio: "inherit",
  });
}

// An earlier run may have committed and then failed to push. That is not "up to
// date" — the site on disk is published only once the push lands.
function unpushedCommits() {
  try {
    const upstream = sh(
      "git",
      ["rev-list", "--count", "@{u}..HEAD"],
      pagesRoot,
    );
    return Number(upstream) || 0;
  } catch {
    // No upstream yet (the first deploy into an empty repo).
    return sh("git", ["rev-list", "--count", "HEAD"], pagesRoot) ? 1 : 0;
  }
}

const pagesDirty = sh("git", ["status", "--porcelain"], pagesRoot);
if (!pagesDirty) {
  if (unpushedCommits() > 0 && !dryRun) {
    step(
      "The build is unchanged, but an earlier run never pushed — pushing now",
    );
    pushPages();
    console.log(`\n\x1b[32m✓ Published.\x1b[0m ${SITE_URL}\n`);
    process.exit(0);
  }
  console.log(
    "\n\x1b[32m✓ The site is already up to date — nothing to publish.\x1b[0m\n",
  );
  process.exit(0);
}

if (dryRun) {
  step("Dry run — stopping before the commit");
  console.log(
    sh("git", ["status", "--short"], pagesRoot)
      .split("\n")
      .slice(0, 20)
      .join("\n"),
  );
  console.log(`\n  Preview it locally:\n    npx --yes serve ${pagesRoot}\n`);
  process.exit(0);
}

step("Committing and pushing");
const message =
  `docs: ${sourceSha.slice(0, 8)}${docsDirty ? " (dirty tree)" : ""}\n\n` +
  `Built from elicitjs/elicitjs-docs@${sourceSha}\n` +
  `Library: elicitjs@${libVersion}\n` +
  `Pages: ${pageCount}`;

sh("git", ["add", "-A"], pagesRoot);
sh("git", ["commit", "-m", message], pagesRoot);
pushPages();

console.log(`\n\x1b[32m✓ Published.\x1b[0m ${SITE_URL}`);
console.log("  GitHub Pages takes a minute or two to serve the new build.\n");

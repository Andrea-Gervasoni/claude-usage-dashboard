// Builds the public demo (sample data, no audio) into ./site for GitHub Pages.
// Usage: node scripts/pages.mjs [baseUrl]   e.g. https://owner.github.io/repo/
import { mkdirSync, writeFileSync, readFileSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sampleHistory } from "./sample.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.argv[2] || "https://andrea-gervasoni.github.io/claude-usage-dashboard/").replace(/\/?$/, "/");
const site = join(root, "site");
mkdirSync(site, { recursive: true });
const sample = join(site, "sample-history.json");
writeFileSync(sample, JSON.stringify(sampleHistory()));
const r = spawnSync(process.execPath, [join(root, "scripts", "build.mjs"), sample, join(site, "index.html")], { stdio: "inherit", env: { ...process.env, VIBECRAB_DEMO: "1", VIBECRAB_NO_AUDIO: "1", VIBECRAB_NAME: "you" } });
if (r.status !== 0) process.exit(r.status);
copyFileSync(join(root, "docs", "social.png"), join(site, "og.png"));
const desc = "Your Claude Code usage as a game: a 3D crab, aura levels, trophies and a story-ready card. This is a demo with sample data. Run it on yours in one command.";
const tags = `<meta name="description" content="${desc}"><meta property="og:type" content="website"><meta property="og:title" content="vibecrab: your Claude Code usage, as a game"><meta property="og:description" content="${desc}"><meta property="og:image" content="${base}og.png"><meta property="og:image:alt" content="A 3D crab mascot coding on a cloud next to the numbers 184 days and 1.83B tokens"><meta property="og:url" content="${base}"><meta name="twitter:card" content="summary_large_image">`;
const f = join(site, "index.html"); let html = readFileSync(f, "utf8");
if (!html.includes("<title>vibecrab</title>")) throw new Error("title not found: cannot inject Open Graph tags");
writeFileSync(f, html.replace("<title>vibecrab</title>", "<title>vibecrab</title>" + tags));
writeFileSync(join(site, ".nojekyll"), "");
console.log(`site/ ready for ${base}`);

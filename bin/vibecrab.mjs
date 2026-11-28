#!/usr/bin/env node
// vibecrab: your Claude Code usage as a local recap. One command, macOS, Linux and Windows.
// Reads usage with ccusage, merges it into ~/.vibecrab/history.json (days are never deleted),
// builds one HTML file and opens it. Nothing is uploaded.
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, readFileSync, statSync, createReadStream } from "node:fs";
import { createServer } from "node:http";
import { homedir, tmpdir, platform } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const args = process.argv.slice(2), flag = (f) => args.includes(f), val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const isWin = platform() === "win32";

if (flag("--version") || flag("-v")) { console.log(pkg.version); process.exit(0); }
if (flag("--help") || flag("-h")) {
  console.log(`vibecrab ${pkg.version}: your Claude Code usage as a playful local recap. Unofficial.

Usage: vibecrab [options]
  (no options)     read usage with ccusage, update the history, build the page, open it
  --demo           open the page with made-up sample data (no Claude Code needed)
  --live           serve the page on http://127.0.0.1 and refresh the numbers every 2 minutes
  --no-open        do not open the browser, just print the page path
  --home <dir>     where to keep history.json, index.html and badge.svg (default ~/.vibecrab)
  --version, --help

Environment: VIBECRAB_NAME sets the nickname shown on the card, VIBECRAB_HOME the data folder.
What it reads: the output of ccusage. What it writes: ${join(homedir(), ".vibecrab")}. What it sends: nothing.`);
  process.exit(0);
}
const [major] = process.versions.node.split(".").map(Number);
if (major < 18) { console.error(`vibecrab needs Node 18 or newer (you have ${process.versions.node}). Get it from https://nodejs.org`); process.exit(1); }

const home = val("--home", process.env.VIBECRAB_HOME || join(homedir(), ".vibecrab"));
const history = join(home, "history.json"), page = join(home, "index.html");
mkdirSync(home, { recursive: true });
const node = (script, a, env = {}) => spawnSync(process.execPath, [join(root, "scripts", script), ...a], { encoding: "utf8", env: { ...process.env, ...env } });
const show = (r) => { process.stdout.write(r.stdout || ""); process.stderr.write(r.stderr || ""); };

function openFile(target) {
  const p = platform();
  if (p === "darwin") spawnSync("open", [target], { stdio: "ignore" });
  else if (isWin) spawnSync("cmd", ["/c", "start", "", target], { stdio: "ignore" });
  else spawnSync("xdg-open", [target], { stdio: "ignore" });
}

function update() {
  console.log("Reading Claude Code usage with ccusage...");
  // On Windows npx is npx.cmd: it needs a shell, and a single fixed command string avoids argument-quoting surprises.
  const cc = isWin ? spawnSync("npx -y ccusage@latest daily --breakdown --json", { encoding: "utf8", shell: true, maxBuffer: 256 * 1024 * 1024 })
    : spawnSync("npx", ["-y", "ccusage@latest", "daily", "--breakdown", "--json"], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (cc.status === 0 && cc.stdout.trim().startsWith("{")) {
    const tmp = join(tmpdir(), `ccusage-${process.pid}.json`); writeFileSync(tmp, cc.stdout);
    show(node("merge.mjs", [tmp, history]));
  } else {
    console.error(existsSync(history) ? "ccusage failed: rebuilding from the saved history." : "ccusage failed. Is Claude Code installed and used on this machine?\nTry it first with fake numbers:  npx github:Andrea-Gervasoni/vibecrab --demo");
    if (cc.stderr) console.error(cc.stderr.split("\n").slice(0, 4).join("\n"));
  }
  const b = node("build.mjs", [history, page]); show(b);
  return b.status === 0;
}

if (flag("--demo")) {
  const dir = join(home, "demo"); mkdirSync(dir, { recursive: true });
  const sample = join(dir, "history.json");
  const { sampleHistory } = await import("../scripts/sample.mjs");
  writeFileSync(sample, JSON.stringify(sampleHistory()));
  const out = join(dir, "index.html"), b = node("build.mjs", [sample, out], { VIBECRAB_DEMO: "1" }); show(b);
  if (b.status !== 0) process.exit(1);
  console.log(`Demo page (sample data): ${out}`);
  if (!flag("--no-open")) openFile(out);
  process.exit(0);
}

if (!update()) process.exit(1);
console.log(`Page: ${page}`);

if (flag("--live")) {
  const port = Number(val("--port", 0)), every = Math.max(30, Number(val("--every", 120)));
  const server = createServer((req, res) => {
    const url = (req.url || "/").split("?")[0];
    if (url === "/__v") { res.writeHead(200, { "content-type": "text/plain", "cache-control": "no-store" }); res.end(String(statSync(page).mtimeMs)); return; }
    if (url !== "/" && url !== "/index.html" && url !== "/badge.svg") { res.writeHead(404); res.end("not found"); return; }
    const f = url === "/badge.svg" ? join(home, "badge.svg") : page;
    if (!existsSync(f)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": url === "/badge.svg" ? "image/svg+xml" : "text/html; charset=utf-8", "cache-control": "no-store", "content-security-policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:; connect-src 'self'" });
    createReadStream(f).pipe(res);
  });
  // 127.0.0.1 only: the page contains your usage numbers and must not be reachable from the network.
  server.listen(port, "127.0.0.1", () => {
    const addr = `http://127.0.0.1:${server.address().port}/`;
    console.log(`Live at ${addr}  (refreshes every ${every}s, Ctrl+C to stop)`);
    if (!flag("--no-open")) openFile(addr);
  });
  setInterval(() => { update(); }, every * 1000).unref?.();
  setInterval(() => {}, 1 << 30);
} else if (!flag("--no-open")) openFile(page);

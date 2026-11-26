#!/usr/bin/env node
// Un comando solo, su macOS, Linux e Windows: legge l'uso con ccusage, lo unisce
// alla storia in ~/.vibecrab e apre la pagina. La storia non viene mai cancellata.
//
//   npx github:<owner>/<repo>            aggiorna e apre
//   npx github:<owner>/<repo> --no-open  aggiorna soltanto
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { homedir, tmpdir, platform } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const home = process.env.VIBECRAB_HOME || join(homedir(), ".vibecrab");
const history = join(home, "history.json"), page = join(home, "index.html");
const args = process.argv.slice(2);
mkdirSync(home, { recursive: true });

const run = (cmd, a, opts = {}) => spawnSync(cmd, a, { encoding: "utf8", shell: platform() === "win32", maxBuffer: 64 * 1024 * 1024, ...opts });

console.log("Reading Claude Code usage with ccusage...");
const cc = run("npx", ["-y", "ccusage@latest", "daily", "--breakdown", "--json"]);
if (cc.status === 0 && cc.stdout.trim().startsWith("{")) {
  const tmp = join(tmpdir(), `ccusage-${process.pid}.json`);
  writeFileSync(tmp, cc.stdout);
  const m = run(process.execPath, [join(root, "scripts", "merge.mjs"), tmp, history], { shell: false });
  process.stdout.write(m.stdout || ""); process.stderr.write(m.stderr || "");
} else {
  console.error("ccusage failed" + (existsSync(history) ? ": rebuilding from saved history." : ". Is Claude Code installed and used on this machine?"));
  if (cc.stderr) console.error(cc.stderr.split("\n").slice(0, 4).join("\n"));
}
const b = run(process.execPath, [join(root, "scripts", "build.mjs"), history, page], { shell: false });
process.stdout.write(b.stdout || ""); process.stderr.write(b.stderr || "");
if (b.status !== 0) process.exit(b.status || 1);
console.log(`Page: ${page}`);
if (!args.includes("--no-open")) {
  const p = platform();
  if (p === "darwin") run("open", [page], { shell: false });
  else if (p === "win32") run("cmd", ["/c", "start", "", page], { shell: false });
  else run("xdg-open", [page], { shell: false });
}

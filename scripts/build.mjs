#!/usr/bin/env node
// Genera index.html autosufficiente: template + dati di history.json + font
// incorporati in base64. Nessuna risorsa esterna.
//
// Uso: node build.mjs [history.json] [index.html]
import { readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { homedir, userInfo } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const historyPath = process.argv[2] ?? join(root, "history.json");
const outPath = process.argv[3] ?? join(root, "index.html");

const history = existsSync(historyPath)
  ? JSON.parse(readFileSync(historyPath, "utf8"))
  : { version: 1, days: {} };

const font = (file) => readFileSync(join(root, "fonts", file)).toString("base64");
const fontCss = `
@font-face{font-family:"Instrument Serif";font-style:normal;font-weight:400;font-display:swap;
  src:url(data:font/woff2;base64,${font("instrument-serif-latin-400-normal.woff2")}) format("woff2")}
@font-face{font-family:"Instrument Sans";font-style:normal;font-weight:400 700;font-display:swap;
  src:url(data:font/woff2;base64,${font("instrument-sans-latin-wght-normal.woff2")}) format("woff2")}`;

// nome della repo (owner/nome) dal remote git, per la card da condividere
let repo = "";
try {
  const url = execSync("git remote get-url origin", { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  const m = url.match(/([^/:]+)\/([^/]+?)(?:\.git)?$/);
  if (m) repo = `${m[1]}/${m[2]}`;
} catch {}
if (!repo) {   // lanciato con npx: non c'è un remote, si legge package.json
  try {
    const m = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).repository.url.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (m) repo = `${m[1]}/${m[2]}`;
  } catch {}
}

// nickname per la card: VIBELOG_NAME, poi il nome dell'account Claude Code locale, poi l'utente del computer.
// L'indirizzo email non viene mai usato.
let nick = (process.env.VIBELOG_NAME || "").trim();
if (!nick) {
  try { nick = (JSON.parse(readFileSync(join(homedir(), ".claude.json"), "utf8")).oauthAccount?.displayName || "").trim().split(/\s+/)[0] || ""; } catch {}
}
if (!nick) {
  try { const u = userInfo().username; if (!/^(root|user|admin|ubuntu|runner|claude)$/i.test(u)) nick = u; } catch {}
}
nick = nick.replace(/[<>"'&]/g, "").slice(0, 20);

// audio della clip segreta: sounds/huss.(mp3|m4a|wav|ogg). Se manca, la clip usa un suono sintetizzato.
let huss = "";
for (const [ext, mime] of [["mp3", "audio/mpeg"], ["m4a", "audio/mp4"], ["wav", "audio/wav"], ["ogg", "audio/ogg"]]) {
  const f = join(root, "sounds", "huss." + ext);
  if (existsSync(f)) { huss = `data:${mime};base64,${readFileSync(f).toString("base64")}`; break; }
}

// JSON sicuro dentro <script>
const data = JSON.stringify({ updatedAt: history.updatedAt ?? null, repo, nick, huss, days: history.days })
  .replace(/</g, "\\u003c");

const template = readFileSync(join(root, "template.html"), "utf8");
// libreria 3D inclusa nel file: nessuna richiesta di rete
const three = readFileSync(join(root, "vendor", "three.min.js"), "utf8").replace(/<\/script/gi, "<\\/script");
const html = template
  .replace("/*__THREE__*/", () => three)
  .replace("/*__FONTS__*/", () => fontCss)
  .replace("/*__DATA__*/null", () => data);

const tmp = outPath + ".tmp";
writeFileSync(tmp, html);
renameSync(tmp, outPath);
console.log(`build: ${outPath} (${Object.keys(history.days).length} giorni, ${(html.length / 1024).toFixed(0)} KB)`);

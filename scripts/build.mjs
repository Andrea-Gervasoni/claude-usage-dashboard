#!/usr/bin/env node
// Genera index.html autosufficiente: template + dati di history.json + font
// incorporati in base64. Nessuna risorsa esterna.
//
// Uso: node build.mjs [history.json] [index.html]
import { readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
@font-face{font-family:"Instrument Serif";font-style:italic;font-weight:400;font-display:swap;
  src:url(data:font/woff2;base64,${font("instrument-serif-latin-400-italic.woff2")}) format("woff2")}
@font-face{font-family:"Instrument Sans";font-style:normal;font-weight:400 700;font-display:swap;
  src:url(data:font/woff2;base64,${font("instrument-sans-latin-wght-normal.woff2")}) format("woff2")}`;

// JSON sicuro dentro <script>
const data = JSON.stringify({ updatedAt: history.updatedAt ?? null, days: history.days })
  .replace(/</g, "\\u003c");

const template = readFileSync(join(root, "template.html"), "utf8");
const html = template
  .replace("/*__FONTS__*/", () => fontCss)
  .replace("/*__DATA__*/null", () => data);

const tmp = outPath + ".tmp";
writeFileSync(tmp, html);
renameSync(tmp, outPath);
console.log(`build: ${outPath} (${Object.keys(history.days).length} giorni, ${(html.length / 1024).toFixed(0)} KB)`);

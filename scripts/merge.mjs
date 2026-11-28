#!/usr/bin/env node
// Merge di un export `ccusage daily --breakdown --json` dentro history.json.
//
// Regole:
//  - chiave = data (YYYY-MM-DD);
//  - un giorno già presente NON viene mai cancellato, anche se ccusage non lo
//    riporta più (Claude Code elimina i log dopo cleanupPeriodDays);
//  - un giorno già presente viene sostituito solo se il nuovo export ha
//    almeno altrettanti token: così la giornata in corso cresce, ma un giorno
//    i cui log sono stati eliminati solo in parte non perde dati.
//
// Uso: node merge.mjs <export.json> <history.json>
import { readFileSync, writeFileSync, existsSync, renameSync, copyFileSync } from "node:fs";

const [, , exportPath, historyPath] = process.argv;
if (!exportPath || !historyPath) {
  console.error("uso: merge.mjs <export.json> <history.json>");
  process.exit(2);
}

const raw = JSON.parse(readFileSync(exportPath, "utf8"));
const rows = Array.isArray(raw) ? raw : raw.daily;
if (!Array.isArray(rows)) throw new Error("export ccusage senza array 'daily'");

let history = { version: 1, days: {} };
if (existsSync(historyPath)) {
  try {
    history = JSON.parse(readFileSync(historyPath, "utf8"));
    if (!history || typeof history !== "object" || typeof history.days !== "object") throw new Error("no days object");
  } catch (e) {
    // a damaged history is never silently thrown away: keep it next to the new one and say so
    const bad = `${historyPath}.corrupt-${Date.now()}`; copyFileSync(historyPath, bad);
    console.error(`history.json could not be read (${e.message}). A copy was kept at ${bad}. Starting a new history.`);
    history = { version: 1, days: {} };
  }
  history.version ??= 1;
  if (history.version > 1) { console.error(`history.json comes from a newer vibecrab (schema ${history.version}). Update vibecrab before running it again.`); process.exit(3); }
  copyFileSync(historyPath, historyPath + ".bak");
}

const num = (v) => (Number.isFinite(+v) ? +v : 0);
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

function normalize(d) {
  const models = (d.modelBreakdowns ?? []).map((m) => ({
    model: m.modelName ?? m.model ?? "sconosciuto",
    input: num(m.inputTokens),
    output: num(m.outputTokens),
    cacheCreation: num(m.cacheCreationTokens),
    cacheRead: num(m.cacheReadTokens),
    cost: num(m.cost ?? m.totalCost),
  }));
  const day = {
    input: num(d.inputTokens),
    output: num(d.outputTokens),
    cacheCreation: num(d.cacheCreationTokens),
    cacheRead: num(d.cacheReadTokens),
    cost: num(d.totalCost ?? d.cost),
    models,
  };
  day.total = num(d.totalTokens) || day.input + day.output + day.cacheCreation + day.cacheRead;
  return day;
}

let added = 0, updated = 0, kept = 0;
for (const d of rows) {
  const date = d.date ?? d.period;
  if (!isDate(date)) continue;
  const next = normalize(d);
  const prev = history.days[date];
  if (!prev) { history.days[date] = next; added++; }
  else if (next.total >= (prev.total ?? 0)) {
    if (next.total !== prev.total || next.cost !== prev.cost) updated++;
    history.days[date] = next;
  } else kept++;
}

// ordina le chiavi per data
history.days = Object.fromEntries(Object.entries(history.days).sort(([a], [b]) => a.localeCompare(b)));
history.updatedAt = new Date().toISOString();

const tmp = historyPath + ".tmp";
writeFileSync(tmp, JSON.stringify(history, null, 2));
renameSync(tmp, historyPath);

const dates = Object.keys(history.days);
console.log(`merge: +${added} nuovi, ${updated} aggiornati, ${kept} protetti; ${dates.length} giorni in storia (dal ${dates[0] ?? "-"})`);

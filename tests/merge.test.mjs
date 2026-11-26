import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const merge = join(dirname(fileURLToPath(import.meta.url)), "..", "scripts", "merge.mjs");
const row = (period, total, cost = 1) => ({ period, inputTokens: 1, outputTokens: 1, cacheCreationTokens: 1, cacheReadTokens: total - 3, totalTokens: total, totalCost: cost,
  modelBreakdowns: [{ modelName: "claude-test", inputTokens: 1, outputTokens: 1, cacheCreationTokens: 1, cacheReadTokens: total - 3, cost }] });
function run(dir, days) {
  const exp = join(dir, "export.json"); writeFileSync(exp, JSON.stringify({ daily: days }));
  const r = spawnSync(process.execPath, [merge, exp, join(dir, "history.json")], { encoding: "utf8" }); assert.equal(r.status, 0, r.stderr);
  return JSON.parse(readFileSync(join(dir, "history.json"), "utf8")).days;
}

test("a day that ccusage no longer reports is never deleted", () => {
  const dir = mkdtempSync(join(tmpdir(), "vc-")); run(dir, [row("2026-01-01", 100), row("2026-01-02", 200)]);
  const days = run(dir, [row("2026-02-01", 300)]);
  assert.deepEqual(Object.keys(days), ["2026-01-01", "2026-01-02", "2026-02-01"]);
});

test("a partly deleted day does not overwrite a fuller one", () => {
  const dir = mkdtempSync(join(tmpdir(), "vc-")); run(dir, [row("2026-01-01", 1000)]);
  assert.equal(run(dir, [row("2026-01-01", 10)])["2026-01-01"].total, 1000);
});

test("today grows as the day goes on", () => {
  const dir = mkdtempSync(join(tmpdir(), "vc-")); run(dir, [row("2026-01-01", 100)]);
  assert.equal(run(dir, [row("2026-01-01", 500)])["2026-01-01"].total, 500);
});

test("rows with a bad date are ignored", () => {
  const dir = mkdtempSync(join(tmpdir(), "vc-")); assert.deepEqual(Object.keys(run(dir, [row("not-a-date", 5), row("2026-03-03", 5)])), ["2026-03-03"]);
});

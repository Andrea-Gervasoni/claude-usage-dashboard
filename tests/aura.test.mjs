import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAura, badgeSvg, LEVELS } from "../scripts/aura.mjs";
import { sampleHistory } from "../scripts/sample.mjs";

const day = (t) => ({ total: t, input: 0, output: 0, cacheCreation: 0, cacheRead: t, cost: 0, models: [] });

test("aura formula: +1 per million tokens, +50 per streak day, +10 per active day", () => {
  const a = computeAura({ "2026-01-01": day(2e6), "2026-01-02": day(3e6), "2026-01-04": day(1e6) });
  assert.equal(a.tot, 6e6); assert.equal(a.best, 2); assert.equal(a.act, 3); assert.equal(a.pts, 6 + 100 + 30);
});
test("level thresholds are ordered and the first level is reachable at zero", () => {
  assert.equal(computeAura({}).level.n, 1);
  for (let i = 1; i < LEVELS.length; i++) assert.ok(LEVELS[i].at > LEVELS[i - 1].at);
});
test("badge is a valid, escaped svg", () => {
  const svg = badgeSvg(computeAura({ "2026-01-01": day(1e6) }));
  assert.match(svg, /^<svg xmlns/); assert.ok(!svg.includes("<script")); assert.ok(svg.includes("aura"));
});
test("sample history is deterministic and never empty", () => {
  const d = new Date("2026-06-01T12:00:00"), a = sampleHistory(d), b = sampleHistory(d);
  assert.deepEqual(Object.keys(a.days), Object.keys(b.days)); assert.ok(Object.keys(a.days).length > 100);
});

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, existsSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { install, uninstall } from "../scripts/app.mjs";

const sandbox = () => { const d = mkdtempSync(join(tmpdir(), "vc-app-")); process.env.VIBECRAB_APPS_DIR = join(d, "apps"); process.env.VIBECRAB_DESKTOP_DIR = join(d, "desk"); return d; };

test("dry run changes nothing", () => {
  const d = sandbox(), r = install({ home: join(d, "h"), dry: true, plat: "linux", user: d });
  assert.ok(r.dry && r.plan.length > 1); assert.equal(existsSync(join(d, "h")), false);
});
test("macOS bundle layout", () => {
  const d = sandbox(), h = join(d, "h"); const r = install({ home: h, plat: "darwin", user: d });
  assert.ok(existsSync(join(r.bundle, "Contents", "Info.plist")) && existsSync(join(r.bundle, "Contents", "Resources", "vibecrab.icns")));
  assert.ok(statSync(join(r.bundle, "Contents", "MacOS", "vibecrab")).mode & 0o100);
  assert.match(readFileSync(join(r.bundle, "Contents", "MacOS", "vibecrab"), "utf8"), /--app/);
  assert.ok(existsSync(join(h, "app", "bin", "vibecrab.mjs")) && existsSync(join(h, "app", "template.html")));
});
test("linux entry and uninstall keeps history", () => {
  const d = sandbox(), h = join(d, "h"); const r = install({ home: h, plat: "linux", user: d });
  assert.match(readFileSync(r.desktopFile, "utf8"), /Exec=.*--app/);
  require_history(h);
  uninstall({ home: h, plat: "linux", user: d });
  assert.equal(existsSync(r.desktopFile), false); assert.equal(existsSync(join(h, "app")), false); assert.ok(existsSync(join(h, "history.json")));
});
import { writeFileSync, mkdirSync } from "node:fs";
function require_history(h) { mkdirSync(h, { recursive: true }); writeFileSync(join(h, "history.json"), "{}"); }

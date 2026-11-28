// Desktop launcher: one-time install of a clickable icon (macOS .app, Windows shortcut, Linux .desktop).
// The icon runs a private copy of vibecrab in <home>/app, so it works without npx and without a terminal.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync, chmodSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { homedir, platform } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const COPY = ["bin", "scripts", "fonts", "vendor", "sounds", "assets", "template.html", "package.json"];
const xml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Where things go. Every location can be overridden so tests never touch the real home folder.
export function targets({ home, plat = platform(), user = homedir() } = {}) {
  const appDir = join(home, "app");
  const t = { plat, appDir, node: process.execPath, entry: join(appDir, "bin", "vibecrab.mjs") };
  if (plat === "darwin") {
    t.bundle = join(process.env.VIBECRAB_APPS_DIR || join(user, "Applications"), "Vibecrab.app");
    t.files = [t.bundle];
  } else if (plat === "win32") {
    t.vbs = join(appDir, "launch.vbs");
    t.lnk = join(process.env.VIBECRAB_DESKTOP_DIR || join(user, "Desktop"), "Vibecrab.lnk");
    t.start = join(process.env.APPDATA || join(user, "AppData", "Roaming"), "Microsoft", "Windows", "Start Menu", "Programs", "Vibecrab.lnk");
    t.files = [t.lnk, t.start];
  } else {
    t.desktopFile = join(process.env.VIBECRAB_APPS_DIR || join(user, ".local", "share", "applications"), "vibecrab.desktop");
    t.desktopCopy = join(process.env.VIBECRAB_DESKTOP_DIR || join(user, "Desktop"), "vibecrab.desktop");
    t.files = [t.desktopFile, t.desktopCopy];
  }
  return t;
}

export function plan(t) {
  return [`copy the app to ${t.appDir}`, ...t.files.map((f) => `create ${f}`), "your history stays in the same folder and is never touched"];
}

function copyApp(t) {
  rmSync(t.appDir, { recursive: true, force: true });
  mkdirSync(t.appDir, { recursive: true });
  for (const p of COPY) if (existsSync(join(root, p))) cpSync(join(root, p), join(t.appDir, p), { recursive: true });
}

export function install({ home, dry = false, plat, user } = {}) {
  const t = targets({ home, plat, user });
  if (dry) return { ...t, dry: true, plan: plan(t) };
  copyApp(t);
  const icon = join(t.appDir, "assets", "icon");
  if (t.plat === "darwin") {
    const c = join(t.bundle, "Contents");
    rmSync(t.bundle, { recursive: true, force: true });
    mkdirSync(join(c, "MacOS"), { recursive: true }); mkdirSync(join(c, "Resources"), { recursive: true });
    cpSync(join(icon, "vibecrab.icns"), join(c, "Resources", "vibecrab.icns"));
    writeFileSync(join(c, "Info.plist"), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleName</key><string>Vibecrab</string>
<key>CFBundleDisplayName</key><string>Vibecrab</string>
<key>CFBundleIdentifier</key><string>local.vibecrab.app</string>
<key>CFBundleExecutable</key><string>vibecrab</string>
<key>CFBundleIconFile</key><string>vibecrab</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleVersion</key><string>1</string>
<key>LSUIElement</key><false/>
</dict></plist>
`);
    const sh = join(c, "MacOS", "vibecrab");
    // Finder starts apps with a bare PATH, so try the node used at install time first, then common places.
    writeFileSync(sh, `#!/bin/bash
export PATH="${dirname(t.node)}:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
NODE="${t.node}"; [ -x "$NODE" ] || NODE="$(command -v node)"
[ -n "$NODE" ] || { osascript -e 'display dialog "Vibecrab needs Node.js 18 or newer: https://nodejs.org" buttons {"OK"}'; exit 1; }
exec "$NODE" "${t.entry}" --app
`);
    chmodSync(sh, 0o755);
  } else if (t.plat === "win32") {
    // wscript runs the command with no console window.
    writeFileSync(t.vbs, `CreateObject("WScript.Shell").Run """${t.node}"" ""${t.entry}"" --app", 0, False\r\n`);
    const ps = (p) => `$s=(New-Object -ComObject WScript.Shell).CreateShortcut('${p.replace(/'/g, "''")}');$s.TargetPath='wscript.exe';$s.Arguments='"${t.vbs.replace(/'/g, "''")}"';$s.IconLocation='${join(icon, "vibecrab.ico").replace(/'/g, "''")}';$s.Description='Vibecrab';$s.Save()`;
    for (const l of t.files) {
      mkdirSync(dirname(l), { recursive: true });
      const r = spawnSync("powershell", ["-NoProfile", "-Command", ps(l)], { encoding: "utf8" });
      if (r.status !== 0) throw new Error(`could not create ${l}: ${(r.stderr || "").trim()}`);
    }
  } else {
    const entry = `[Desktop Entry]
Type=Application
Name=Vibecrab
Comment=Your Claude Code usage recap
Exec="${t.node}" "${t.entry}" --app
Icon=${join(icon, "icon-256.png")}
Terminal=false
Categories=Utility;Development;
`;
    for (const f of t.files) { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, entry); chmodSync(f, 0o755); }
  }
  return { ...t, plan: plan(t) };
}

export function uninstall({ home, plat, user } = {}) {
  const t = targets({ home, plat, user });
  for (const f of t.files) rmSync(f, { recursive: true, force: true });
  rmSync(t.appDir, { recursive: true, force: true });
  return t;
}
export { xml };

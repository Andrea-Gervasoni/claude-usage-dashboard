#!/bin/bash
# Installa il LaunchAgent (23:50 ogni giorno + al login), fa il primo run e
# apre la dashboard. Solo macOS. Non tocca ~/.claude/settings.json.
set -euo pipefail

[ "$(uname)" = "Darwin" ] || { echo "install.sh è pensato per macOS (launchd)." >&2; exit 1; }

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LABEL="local.claude-usage-dashboard"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
NODE_BIN="$(dirname "$(command -v node || echo /usr/local/bin/node)")"
chmod +x "$DIR/update.sh"
mkdir -p "$HOME/Library/LaunchAgents" "$DIR/logs"

# 1. primo run
"$DIR/update.sh"

# 2. LaunchAgent
cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>/bin/bash</string><string>$DIR/update.sh</string></array>
  <key>WorkingDirectory</key><string>$DIR</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key><string>$NODE_BIN:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    <key>HOME</key><string>$HOME</string>
  </dict>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>23</integer><key>Minute</key><integer>50</integer></dict>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>$DIR/logs/update.log</string>
  <key>StandardErrorPath</key><string>$DIR/logs/update.err.log</string>
</dict>
</plist>
EOF
plutil -lint "$PLIST" >/dev/null

DOMAIN="gui/$(id -u)"
launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
launchctl bootstrap "$DOMAIN" "$PLIST"
launchctl enable "$DOMAIN/$LABEL"
echo "LaunchAgent caricato: $PLIST"
launchctl print "$DOMAIN/$LABEL" | grep -E "state|path" | head -3 || true

# 3. apri la dashboard e riporta la prima data
open "$DIR/index.html"
FIRST="$(node -e 'const d=Object.keys(require(process.argv[1]).days).sort();console.log(d[0]||"")' "$DIR/history.json")"
SIX="$(date -v-6m +%F)"
if [ -z "$FIRST" ]; then echo "Nessun dato trovato da ccusage."
elif [[ "$FIRST" > "$SIX" ]]; then echo "Attenzione: la storia parte dal $FIRST, meno di 6 mesi fa ($SIX)."
else echo "La storia parte dal $FIRST."; fi

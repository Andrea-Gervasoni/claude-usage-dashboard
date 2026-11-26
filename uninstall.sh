#!/bin/bash
# Rimuove il LaunchAgent. Non cancella history.json né index.html.
set -euo pipefail
LABEL="local.claude-usage-dashboard"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
echo "LaunchAgent rimosso. La storia resta in $(cd "$(dirname "$0")" && pwd)/history.json"

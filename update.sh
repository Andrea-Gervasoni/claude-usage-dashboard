#!/bin/bash
# Aggiorna history.json con i dati di ccusage e rigenera index.html.
# Lanciato da launchd ogni giorno alle 23:50 e al login, oppure a mano.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# launchd parte con un PATH minimo: aggiungo i percorsi tipici di node/npx.
export PATH="${PATH:-/usr/bin:/bin}:/opt/homebrew/bin:/usr/local/bin:$HOME/.volta/bin:$HOME/.local/bin"
if ! command -v npx >/dev/null 2>&1 && [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
fi
command -v npx >/dev/null 2>&1 || { echo "$(date '+%F %T') errore: npx non trovato nel PATH" >&2; exit 1; }

mkdir -p logs
LOCK="$DIR/.update.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  # un altro run è in corso (es. RunAtLoad subito dopo l'installazione)
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +30 2>/dev/null)" ]; then rm -rf "$LOCK"; mkdir "$LOCK"
  else echo "$(date '+%F %T') update già in corso, esco"; exit 0; fi
fi
TMP="$(mktemp -t ccusage.XXXXXX)"
trap 'rm -rf "$LOCK" "$TMP"' EXIT

echo "$(date '+%F %T') avvio update"
if npx -y ccusage@latest daily --breakdown --json > "$TMP" 2> logs/ccusage.err; then
  node scripts/merge.mjs "$TMP" history.json
else
  echo "$(date '+%F %T') ccusage fallito (vedi logs/ccusage.err): rigenero solo dalla storia esistente" >&2
fi
node scripts/build.mjs history.json index.html
echo "$(date '+%F %T') fatto"

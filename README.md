# Diario d'uso · Claude Code

Dashboard locale che si aggiorna da sola: legge i log di Claude Code con
[`ccusage`](https://github.com/ryoppippi/ccusage), conserva la storia in
`history.json` (i giorni salvati non vengono mai cancellati) e genera
`index.html`, una pagina unica e autosufficiente (dati e font incorporati, nessuna CDN).

## Installazione (macOS)

```bash
git clone <questo-repo> ~/claude-usage-dashboard
cd ~/claude-usage-dashboard && ./install.sh
```

`install.sh` esegue il primo aggiornamento, installa il LaunchAgent
`~/Library/LaunchAgents/local.claude-usage-dashboard.plist` (ogni giorno alle 23:50
e al login), lo carica con `launchctl`, apre la dashboard e stampa la prima data in storia.

Requisiti: Node.js (per `npx`). Log in `logs/`. Per rimuovere il job: `./uninstall.sh`.

## File

| File | Ruolo |
| --- | --- |
| `update.sh` | `npx ccusage@latest daily --breakdown --json` → merge → build |
| `scripts/merge.mjs` | merge per data; un giorno esistente viene sostituito solo se il nuovo export ha almeno altrettanti token |
| `scripts/build.mjs` | `template.html` + `history.json` + font → `index.html` |
| `template.html` | la pagina: un canvas con i giorni che cambiano posa fra i grafici, senza librerie |
| `DESIGN.md` | idea, token, principi e divieti del design |
| `fonts/` | Instrument Serif e Instrument Sans (SIL OFL 1.1) |
| `.backup/` | la prima versione della pagina |

`history.json` e `index.html` sono dati personali e restano fuori da git.

## Conservare i log più a lungo

Claude Code cancella i log dopo `cleanupPeriodDays` (30 giorni di default).
`history.json` protegge comunque i totali giornalieri; per conservare anche i log
grezzi si può impostare `"cleanupPeriodDays": 3650` in `~/.claude/settings.json`.

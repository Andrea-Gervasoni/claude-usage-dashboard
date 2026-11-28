---
description: Open your Claude Code usage recap (aura level, trophies, share card). Runs locally.
argument-hint: "[--demo] [--live] [--no-open]"
allowed-tools: Bash(node:*)
---

Run the vibecrab recap on this machine and tell the user where the page is.

1. Run: `node "${CLAUDE_PLUGIN_ROOT}/bin/vibecrab.mjs" $ARGUMENTS`
2. If the command prints a line starting with `Page:` or `Demo page`, tell the user that path in one sentence and that the browser should have opened.
3. If it says ccusage failed, suggest `--demo` to try it with sample data.
4. Say that nothing was uploaded: the page is a local file.

Do not read or print the contents of the history file; it contains the user's usage numbers.

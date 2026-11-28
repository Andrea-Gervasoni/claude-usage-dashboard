# Security

## What the project does

- Runs `npx ccusage` and reads its JSON output.
- Writes `history.json`, `index.html` and `badge.svg` to `~/.vibecrab` (or `--home`).
- Builds a page that has a content security policy with no network access.
- `--live` serves that page on `127.0.0.1` only.

It does not send data anywhere and has no dependencies.

## Reporting a vulnerability

Please use GitHub's **private vulnerability reporting** (Security tab, "Report a vulnerability") instead of a public issue. Include the version (`vibecrab --version`), your OS and steps to reproduce. You should get a first answer within a week.

Things that count as vulnerabilities: reading or writing outside the data folder, the `--live` server reachable from another machine, the page making a network request, command injection through a model name or path.

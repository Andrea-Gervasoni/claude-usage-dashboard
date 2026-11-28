# Changelog

## 0.2.0
- `--demo` (sample data, no Claude Code needed), `--live` (local server, refreshes every 2 minutes), `--help`, `--version`.
- Claude Code plugin: `/plugin install vibecrab --marketplace Andrea-Gervasoni/vibecrab`, then run its `vibecrab` command.
- README badge (`badge.svg`) and a page button to save it.
- New opening sequence with real steps, skip and "always skip".
- Gentle notices when you reach a new level or trophy, and a weekly recap offer (once a week, easy to dismiss).
- A damaged `history.json` is kept aside instead of being lost; a history from a newer schema is never overwritten.
- Content security policy: the page cannot make network requests.
- Windows: `npx` is launched through a shell with one fixed command string.
- Removed the "streak at risk" wording.
- Public demo build for GitHub Pages; CI on Linux, macOS and Windows.

## 0.1.0
- First version: recap page with 3D mascot, aura levels, trophies, share card, recap and the secret clip.

# Contributing

Thanks for helping. This project is small on purpose: no dependencies, no build tooling, one HTML template.

## Setup

```bash
git clone https://github.com/Andrea-Gervasoni/vibecrab
cd vibecrab
npm test                          # needs Node 18+
node bin/vibecrab.mjs --demo      # opens the page with sample data
```

## Before you open a pull request

- `npm test` passes. Add a test for any change to `scripts/merge.mjs`, `scripts/aura.mjs` or `bin/vibecrab.mjs`.
- The history is sacred: a change must never be able to delete a day already saved.
- No new runtime dependencies, no network calls from the page, no telemetry. The page ships a content security policy that blocks them.
- For visual changes, attach a screenshot at 1440 and 390 px wide.
- Keep the interface copy in English, short, and free of guilt-tripping (no "your streak is at risk").

## Good first issues

- Try it on macOS or Windows and report what happens (`node bin/vibecrab.mjs --version`, then the full command).
- Suggest better aura thresholds with your own numbers (do not paste raw logs).
- Translate the README.

## Releasing (maintainers)

1. Update `CHANGELOG.md` and the version in `package.json` and `.claude-plugin/plugin.json`.
2. `git tag vX.Y.Z && git push origin vX.Y.Z`. The release workflow runs the tests, checks the tag matches `package.json` and attaches the demo page with a checksum.
3. npm publishing is off by default: set the repository variable `NPM_PUBLISH=true` once a trusted publisher is configured on npmjs.com.

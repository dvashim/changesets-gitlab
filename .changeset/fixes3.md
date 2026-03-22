---
"@dvashim/changesets-gitlab": minor
---

Add GITLAB_CHANGESETS_DEBUG env var for debug logging

- **Refactor:** Split monolithic `comment.ts` into focused modules under `src/comment/`
- **Refactor:** Split monolithic `utils.ts` into individual files under `src/utils/`
- **Feature:** Add `GITLAB_CHANGESETS_DEBUG` env var to enable verbose API fetch logging, replacing `--verbose` CLI flag
- **Config:** Upgrade biome config to `react-balanced` with explicit rule overrides
- **Lint:** Apply biome lint fixes across codebase (unicode regex flags, interface-to-type, destructuring)

# changesets-gitlab

## 0.1.0

### Minor Changes

- [#12](https://github.com/dvashim/changesets-gitlab/pull/12) [`a8be123`](https://github.com/dvashim/changesets-gitlab/commit/a8be123a2d3aa8fe271852750dbc515be4616cfa) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Add GITLAB_CHANGESETS_DEBUG env var for debug logging

  - **Refactor:** Split monolithic `comment.ts` into focused modules under `src/comment/`
  - **Refactor:** Split monolithic `utils.ts` into individual files under `src/utils/`
  - **Feature:** Add `GITLAB_CHANGESETS_DEBUG` env var to enable verbose API fetch logging, replacing `--verbose` CLI flag
  - **Config:** Upgrade biome config to `react-balanced` with explicit rule overrides
  - **Lint:** Apply biome lint fixes across codebase (unicode regex flags, interface-to-type, destructuring)

## 0.0.4

### Patch Changes

- [#10](https://github.com/dvashim/changesets-gitlab/pull/10) [`29955fd`](https://github.com/dvashim/changesets-gitlab/commit/29955fd63b3b8c35e7b01e622f50f92c5ccf7748) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Add package description field to package.json

## 0.0.3

### Patch Changes

- [#5](https://github.com/dvashim/changesets-gitlab/pull/5) [`702f3e4`](https://github.com/dvashim/changesets-gitlab/commit/702f3e44a844d7a1a5d679b8f82d88bf9226b1d0) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Improve CI and release workflow configuration

  - **Build:** Centralize Node.js version in `.node-version` file instead of hardcoding in workflows
  - **CI:** Add `registry-url` and `NODE_AUTH_TOKEN` for reliable npm provenance publishing
  - **CI:** Move build step into publish command to skip unnecessary builds on version-only runs
  - **CI:** Remove redundant `--provenance` flag and default action options

## 0.0.2

### Patch Changes

- [#1](https://github.com/dvashim/changesets-gitlab/pull/1) [`525b196`](https://github.com/dvashim/changesets-gitlab/commit/525b19646d766f8ef34a5ce0cbcc82a39d30e049) Thanks [@aleksei-reznichenko](https://github.com/aleksei-reznichenko)! - Fork setup and tooling migration

  - **Build:** Migrate from yarn to pnpm with updated lockfile and package config
  - **Build:** Update dependencies and TypeScript settings
  - **CI:** Simplify workflows for the new fork
  - **Refactor:** Apply biome formatting and remove eslint directives
  - **Chore:** Remove upstream tooling configs (codesandbox, commitlint, prettier, renovate, size-limit)
  - **Chore:** Sort package.json fields per sort-package-json conventions
  - **Docs:** Rewrite README with pnpm examples and remove yarn references
  - **Docs:** Add CLAUDE.md with architecture details

---
"@dvashim/changesets-gitlab": patch
---

Improve CI and release workflow configuration

- **Build:** Centralize Node.js version in `.node-version` file instead of hardcoding in workflows
- **CI:** Add `registry-url` and `NODE_AUTH_TOKEN` for reliable npm provenance publishing
- **CI:** Move build step into publish command to skip unnecessary builds on version-only runs
- **CI:** Remove redundant `--provenance` flag and default action options

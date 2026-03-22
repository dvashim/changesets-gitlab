// Simulate context in GitHub Actions
/** biome-ignore-all lint/style/noNonNullAssertion: fix later */

import process from 'node:process'

export const projectId = process.env.CI_PROJECT_ID!

export const ref = process.env.CI_COMMIT_REF_NAME!

import type { ReleasePlan } from '@changesets/types'
import {
  ADD_CHANGESET_URL_PLACEHOLDER_REGEXP,
  CUSTOM_LINKS,
  GENERATED_BY_BOT_NOTE,
} from './constants.ts'
import { getReleasePlanMessage } from './getReleasePlanMessage.ts'

export const getAbsentMessage = (
  commitSha: string,
  addChangesetUrl: string,
  newChangesetTemplateFallback: string,
  releasePlan: ReleasePlan | null
) => `###  ⚠️  No Changeset found

Latest commit: ${commitSha}

Merging this MR will not cause a version bump for any packages. If these changes should not result in a new version, you're good to go. **If these changes should result in a version bump, you need to add a changeset.**

${getReleasePlanMessage(releasePlan)}

${
  CUSTOM_LINKS
    ? CUSTOM_LINKS.replace(
        ADD_CHANGESET_URL_PLACEHOLDER_REGEXP,
        addChangesetUrl
      )
    : `[Click here to learn what changesets are, and how to add one](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md).

[Click here if you're a maintainer who wants to add a changeset to this MR](${addChangesetUrl})`
}

${newChangesetTemplateFallback}

__${GENERATED_BY_BOT_NOTE}__
`

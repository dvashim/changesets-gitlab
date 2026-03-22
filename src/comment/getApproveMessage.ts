import type { ReleasePlan } from '@changesets/types'
import {
  ADD_CHANGESET_URL_PLACEHOLDER_REGEXP,
  CUSTOM_LINKS,
  GENERATED_BY_BOT_NOTE,
} from './constants.ts'
import { getReleasePlanMessage } from './getReleasePlanMessage.ts'

export const getApproveMessage = (
  commitSha: string,
  addChangesetUrl: string,
  newChangesetTemplateFallback: string,
  releasePlan: ReleasePlan | null
) => `###  🦋  Changeset detected

Latest commit: ${commitSha}

**The changes in this MR will be included in the next version bump.**

${getReleasePlanMessage(releasePlan)}

${
  CUSTOM_LINKS
    ? CUSTOM_LINKS.replace(
        ADD_CHANGESET_URL_PLACEHOLDER_REGEXP,
        addChangesetUrl
      )
    : `Not sure what this means? [Click here to learn what changesets are](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md).

[Click here if you're a maintainer who wants to add another changeset to this MR](${addChangesetUrl})`
}

${newChangesetTemplateFallback}

__${GENERATED_BY_BOT_NOTE}__
`

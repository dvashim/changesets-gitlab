import { ValidationError } from '@changesets/errors'
import { GitbeakerRequestError } from '@gitbeaker/rest'
import { humanId } from 'human-id'
import { createApi } from '../api.ts'
import * as context from '../context.ts'
import { env } from '../env.ts'
import { getChangedPackages } from '../get-changed-packages.ts'
import { HTTP_STATUS_NOT_FOUND, TRUTHY_VALUES } from '../utils/constants.ts'
import { VERBOSE_LOGGER } from './constants.ts'
import { getAbsentMessage } from './getAbsentMessage.ts'
import { getApproveMessage } from './getApproveMessage.ts'
import { getNewChangesetTemplate } from './getNewChangesetTemplate.ts'
import { getNoteInfo } from './getNoteInfo.ts'
import { hasChangesetBeenAdded } from './hasChangesetBeenAdded.ts'

export const comment = async () => {
  if (env.GITLAB_CHANGESETS_DEBUG) {
    VERBOSE_LOGGER.enable()
    VERBOSE_LOGGER.print('running comment')
  }

  const mrBranch = env.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME

  if (!mrBranch) {
    console.warn('[changesets-gitlab:comment] It should only be used on MR')
    return
  }

  if (mrBranch.startsWith('changeset-release')) {
    VERBOSE_LOGGER.print('Wrong branch', mrBranch)
    return
  }

  const {
    CI_MERGE_REQUEST_IID: mrIid,
    GITLAB_COMMENT_TYPE: commentType,
    GITLAB_ADD_CHANGESET_MESSAGE: commitMessage,
    CI_MERGE_REQUEST_SOURCE_BRANCH_SHA: latestCommitSha,
  } = env

  VERBOSE_LOGGER.print('env', {
    mrIid,
    commentType,
    commitMessage,
    latestCommitSha,
  })

  const api = createApi()

  let errFromFetchingChangedFiles = ''

  try {
    const changedFilesPromise = api.MergeRequests.allDiffs(
      context.projectId,
      mrIid
    ).catch(async (err: unknown) => {
      VERBOSE_LOGGER.print('error 0', err)

      if (
        !(err instanceof GitbeakerRequestError)
        || err.cause?.response.status !== HTTP_STATUS_NOT_FOUND
      ) {
        throw err
      }

      const { changes } = await api.MergeRequests.showChanges(
        context.projectId,
        mrIid
      )

      return changes
    })

    const [noteInfo, hasChangeset, { changedPackages, releasePlan }] =
      await Promise.all([
        getNoteInfo(api, mrIid, commentType),
        hasChangesetBeenAdded(changedFilesPromise),
        getChangedPackages({
          changedFiles: changedFilesPromise.then((changedFiles) =>
            changedFiles.map(({ new_path }) => new_path)
          ),
          api,
        }).catch((err: unknown) => {
          VERBOSE_LOGGER.print('error 1', err)

          if (err instanceof ValidationError) {
            errFromFetchingChangedFiles = `<details><summary>💥 An error occurred when fetching the changed packages and changesets in this MR</summary>\n\n\`\`\`\n${err.message}\n\`\`\`\n\n</details>\n`
          } else {
            console.error(err)
          }

          return {
            changedPackages: ['@fake-scope/fake-pkg'],
            releasePlan: null,
          }
        }),
      ] as const)

    const newChangesetFileName = `.changeset/${humanId({
      separator: '-',
      capitalize: false,
    })}.md`

    const newChangesetTemplate = getNewChangesetTemplate(
      changedPackages,
      env.CI_MERGE_REQUEST_TITLE
    )

    const addChangesetUrl = `${env.CI_MERGE_REQUEST_PROJECT_URL}/-/new/${mrBranch}?file_name=${newChangesetFileName}&file=${encodeURIComponent(newChangesetTemplate)}${
      commitMessage
        ? `&commit_message=${encodeURIComponent(commitMessage)}`
        : ''
    }`

    const newChangesetTemplateFallback = `
If the above link doesn't fill the changeset template file name and content which is [a known regression on GitLab >= 16.11](https://gitlab.com/gitlab-org/gitlab/-/issues/532221), you can copy and paste the following template into ${newChangesetFileName} instead:

\`\`\`yaml
${newChangesetTemplate}
\`\`\`
`.trim()

    const prComment =
      (hasChangeset
        ? getApproveMessage(
            latestCommitSha,
            addChangesetUrl,
            newChangesetTemplateFallback,
            releasePlan
          )
        : getAbsentMessage(
            latestCommitSha,
            addChangesetUrl,
            newChangesetTemplateFallback,
            releasePlan
          )) + errFromFetchingChangedFiles

    switch (commentType) {
      case 'discussion': {
        if (noteInfo) {
          if (
            hasChangeset
            && TRUTHY_VALUES.has(
              env.GITLAB_COMMENT_DISCUSSION_AUTO_RESOLVE || '1'
            )
          ) {
            await api.MergeRequestDiscussions.resolve(
              context.projectId,
              mrIid,
              noteInfo.discussionId,
              true
            )
          }

          return api.MergeRequestDiscussions.editNote(
            context.projectId,
            mrIid,
            noteInfo.discussionId,
            noteInfo.noteId,
            {
              body: prComment,
            }
          )
        }

        return api.MergeRequestDiscussions.create(
          context.projectId,
          mrIid,
          prComment
        )
      }
      case 'note': {
        if (noteInfo) {
          return api.MergeRequestNotes.edit(
            context.projectId,
            mrIid,
            noteInfo.noteId,
            { body: prComment }
          )
        }

        return api.MergeRequestNotes.create(context.projectId, mrIid, prComment)
      }

      default: {
        VERBOSE_LOGGER.print(
          'error 2',
          `Invalid comment type "${commentType}", should be "discussion" or "note"`
        )

        throw new Error(
          `Invalid comment type "${commentType}", should be "discussion" or "note"`
        )
      }
    }
  } catch (err) {
    VERBOSE_LOGGER.print('error 3', err)

    if (err instanceof GitbeakerRequestError && err.cause) {
      const { description, request, response } = err.cause
      console.error(description)
      try {
        console.error('request:', await request.text())
      } catch {
        console.error("The error's request could not be used as plain text")
      }
      try {
        console.error('response:', await response.text())
      } catch {
        console.error("The error's response could not be used as plain text")
      }
    }
    throw err
  }
}

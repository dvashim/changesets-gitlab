import type { Gitlab } from '@gitbeaker/core'
import * as context from '../context.js'
import type { LooseString } from '../types.ts'
import { getUsername } from '../utils/index.js'
import { isChangesetBotNote } from './isChangesetBotNote.ts'
import { isMrNote } from './isMrNote.ts'

async function getNoteInfo(
  api: Gitlab,
  mrIid: number | string,
  commentType: LooseString<'discussion'>,
  random?: boolean
): Promise<{ discussionId: string; noteId: number } | null | undefined>

async function getNoteInfo(
  api: Gitlab,
  mrIid: number | string,
  commentType: LooseString<'note'>,
  random?: boolean
): Promise<{ noteId: number } | null | undefined>

async function getNoteInfo(
  api: Gitlab,
  mrIid: number | string,
  commentType: LooseString<'discussion' | 'note'>,
  random?: boolean
): Promise<
  | { discussionId: string; noteId: number }
  | { noteId: number }
  | null
  | undefined
> {
  const discussionOrNotes =
    commentType === 'discussion'
      ? await api.MergeRequestDiscussions.all(context.projectId, mrIid)
      : await api.MergeRequestNotes.all(context.projectId, +mrIid)

  const username = await getUsername(api)

  for (const discussionOrNote of discussionOrNotes) {
    if (isMrNote(discussionOrNote)) {
      if (isChangesetBotNote(discussionOrNote, username, random)) {
        return {
          noteId: discussionOrNote.id,
        }
      }
      continue
    }

    if (!discussionOrNote.notes) {
      continue
    }

    const changesetBotNote = discussionOrNote.notes.find((note) =>
      isChangesetBotNote(note, username)
    )

    if (changesetBotNote) {
      return {
        discussionId: discussionOrNote.id,
        noteId: changesetBotNote.id,
      }
    }
  }

  /**
   * The `username` used for commenting could be random, if we haven't tested
   * the random `username`, then test it
   *
   * @see https://docs.gitlab.com/ee/development/internal_users.html
   * @see https://github.com/un-ts/changesets-gitlab/issues/145#issuecomment-1860610958
   */
  return random ? null : getNoteInfo(api, mrIid, commentType, true)
}

export { getNoteInfo }

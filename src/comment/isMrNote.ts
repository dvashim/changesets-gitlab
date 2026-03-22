import type { DiscussionSchema, MergeRequestNoteSchema } from '@gitbeaker/core'

export const isMrNote = (
  discussionOrNote: DiscussionSchema | MergeRequestNoteSchema
): discussionOrNote is MergeRequestNoteSchema =>
  'noteable_type' in discussionOrNote
  && discussionOrNote.noteable_type === 'MergeRequest'

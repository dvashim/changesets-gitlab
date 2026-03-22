import type { CommitDiffSchema, MergeRequestDiffSchema } from '@gitbeaker/core'

export const hasChangesetBeenAdded = async (
  changedFilesPromise: Promise<CommitDiffSchema[] | MergeRequestDiffSchema[]>
) => {
  const changedFiles = await changedFilesPromise
  return changedFiles.some(
    (file) =>
      file.new_file
      && /^\.changeset\/.+\.md$/u.test(file.new_path)
      && file.new_path !== '.changeset/README.md'
  )
}

import type {
  ComprehensiveRelease,
  ReleasePlan,
  VersionType,
} from '@changesets/types'
import { markdownTable } from 'markdown-table'

export const getReleasePlanMessage = (releasePlan: ReleasePlan | null) => {
  if (!releasePlan) {
    return ''
  }

  const publishableReleases = releasePlan.releases.filter(
    (x): x is ComprehensiveRelease & { type: Exclude<VersionType, 'none'> } =>
      x.type !== 'none'
  )

  const table = markdownTable([
    ['Name', 'Type'],
    ...publishableReleases.map((x) => [
      x.name,
      {
        major: 'Major',
        minor: 'Minor',
        patch: 'Patch',
      }[x.type],
    ]),
  ])

  return `<details><summary>This MR includes ${
    releasePlan.changesets.length > 0
      ? `changesets to release ${
          publishableReleases.length === 1
            ? '1 package'
            : `${publishableReleases.length} packages`
        }`
      : 'no changesets'
  }</summary>

  ${
    publishableReleases.length > 0
      ? table
      : "When changesets are added to this MR, you'll see the packages that this MR includes changesets for and the associated semver types"
  }

</details>`
}

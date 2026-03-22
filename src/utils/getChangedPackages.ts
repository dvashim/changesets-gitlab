import type { Package } from '@manypkg/get-packages'
import { getPackages } from '@manypkg/get-packages'

export async function getChangedPackages(
  cwd: string,
  previousVersions: Map<string, string>
) {
  const { packages } = await getPackages(cwd)
  const changedPackages = new Set<Package>()

  for (const pkg of packages) {
    const previousVersion = previousVersions.get(pkg.dir)
    if (previousVersion !== pkg.packageJson.version) {
      changedPackages.add(pkg)
    }
  }

  return [...changedPackages]
}

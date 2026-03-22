import { getPackages } from '@manypkg/get-packages'

export async function getVersionsByDirectory(cwd: string) {
  const { packages } = await getPackages(cwd)
  return new Map(packages.map((x) => [x.dir, x.packageJson.version]))
}

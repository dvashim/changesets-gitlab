import fs from 'node:fs'
import path from 'node:path'

export async function getAllFiles(dir: string, base = dir): Promise<string[]> {
  const direntList = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    direntList.map((dirent) => {
      const res = path.resolve(dir, dirent.name)
      return dirent.isDirectory()
        ? getAllFiles(res, base)
        : [path.relative(base, res)]
    })
  )
  return files.flat()
}

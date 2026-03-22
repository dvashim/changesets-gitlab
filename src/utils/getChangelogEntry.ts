import { toString as mdastToString } from 'mdast-util-to-string'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { BumpLevels } from './constants.ts'

export function getChangelogEntry(changelog: string, version: string) {
  const ast = unified().use(remarkParse).parse(changelog)

  let highestLevel: number = BumpLevels.dep

  const nodes = ast.children
  let headingStartInfo:
    | {
        index: number
        depth: number
      }
    | undefined
  let endIndex: number | undefined

  for (const [i, node] of nodes.entries()) {
    if (node.type === 'heading') {
      const stringified = mdastToString(node)
      const match = /(major|minor|patch)/u.exec(stringified.toLowerCase())
      if (match !== null) {
        const level = BumpLevels[match[0] as 'major' | 'minor' | 'patch']
        highestLevel = Math.max(level, highestLevel)
      }
      if (headingStartInfo === undefined && stringified === version) {
        headingStartInfo = {
          index: i,
          depth: node.depth,
        }
        continue
      }
      if (
        endIndex === undefined
        && headingStartInfo !== undefined
        && headingStartInfo.depth === node.depth
      ) {
        endIndex = i
        break
      }
    }
  }
  if (headingStartInfo) {
    ast.children = ast.children.slice(headingStartInfo.index + 1, endIndex)
  }
  return {
    content: unified().use(remarkStringify).stringify(ast),
    highestLevel,
  }
}

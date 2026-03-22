export const getNewChangesetTemplate = (
  changedPackages: string[],
  title: string
) => `---
${changedPackages.map((x) => `"${x}": patch`).join('\n')}
---

${title}
`

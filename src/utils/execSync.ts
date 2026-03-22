import { execSync as execSync_ } from 'node:child_process'

export const execSync = (command: string) =>
  execSync_(command, { stdio: 'inherit' })

import { createRequire } from 'node:module'

export const cjsRequire =
  typeof require === 'undefined' ? createRequire(import.meta.url) : require

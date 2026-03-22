export const BumpLevels = {
  dep: 0,
  patch: 1,
  minor: 2,
  major: 3,
} as const

export const FALSY_VALUES = new Set(['false', '0'])

export const TRUTHY_VALUES = new Set(['true', '1'])

export const GITLAB_MAX_TAGS = 4

export const HTTP_STATUS_NOT_FOUND = 404

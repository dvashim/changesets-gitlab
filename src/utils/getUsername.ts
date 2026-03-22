import type { Gitlab } from '@gitbeaker/core'
import { env } from '../env.js'

export const getUsername = async (api: Gitlab): Promise<string> =>
  env.GITLAB_CI_USER_NAME ?? (await api.Users.showCurrentUser()).username

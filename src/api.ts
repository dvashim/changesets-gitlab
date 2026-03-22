/// <reference path="../global.d.ts" />

import process from 'node:process'
import { Gitlab } from '@gitbeaker/rest'
import type { ProxyAgentConfigurationType } from 'global-agent'
import { bootstrap } from 'global-agent'
import { env } from './env.ts'
import { Logger } from './Logger.ts'

const PROXY_PROPS = ['http_proxy', 'https_proxy', 'no_proxy'] as const

let bootstrapped = false

const API_VERBOSE_LOGGER = new Logger('api')

const enableApiVerboseLogging = () => {
  API_VERBOSE_LOGGER.enable()

  const originalFetch = globalThis.fetch
  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url
    const method = init?.method ?? 'GET'
    API_VERBOSE_LOGGER.print(method, url)

    const response = await originalFetch(input, init)

    API_VERBOSE_LOGGER.print(method, url, response.status)
    return response
  }
}

if (env.GITLAB_CHANGESETS_DEBUG) {
  enableApiVerboseLogging()
}

export const createApi = (gitlabToken?: string) => {
  if (!bootstrapped) {
    bootstrapped = true

    bootstrap()

    for (const prop of PROXY_PROPS) {
      const uProp = prop.toUpperCase() as keyof ProxyAgentConfigurationType
      const value = process.env[uProp] || process.env[prop]
      if (value) {
        // biome-ignore lint/correctness/noUndeclaredVariables: @see global.d.ts
        GLOBAL_AGENT[uProp] = value
      }
    }
  }

  const token = gitlabToken ?? env.GITLAB_TOKEN
  const host = env.GITLAB_HOST

  if (env.GITLAB_TOKEN_TYPE === 'oauth') {
    return new Gitlab({
      host,
      oauthToken: token,
    })
  }

  return new Gitlab({
    host,
    token,
  })
}

import { getInput } from '@actions/core'

export const getOptionalInput = (name: string) => getInput(name) || undefined

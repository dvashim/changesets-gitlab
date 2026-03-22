#!/usr/bin/env node

import process from 'node:process'
import { program } from 'commander'
import { comment } from './comment/comment.js'
import './env.js'
import { main } from './main.js'
import { cjsRequire, getOptionalInput } from './utils/index.js'

const run = () => {
  program.version(
    (cjsRequire('../../package.json') as { version: string }).version
  )

  program.command('comment').action(async () => {
    await comment()
  })

  program.command('main', { isDefault: true }).action(() =>
    main({
      published: getOptionalInput('published'),
      onlyChangesets: getOptionalInput('only_changesets'),
    })
  )

  return program.showHelpAfterError().parseAsync()
}

run().catch((err: Error) => {
  console.error(err)
  process.exitCode = 1
})

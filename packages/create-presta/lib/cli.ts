#! /usr/bin/env node

import fs from 'fs-extra'
import path from 'path'
import prompts, { PromptObject } from 'prompts'
import c from 'kleur'

import pkg from '../package.json'
import { createPresta, Config } from './'

console.clear()
console.log(`create-presta ${c.gray(`v${pkg.version}`)}\n\nHey there. Let's get you set up :)\n`)
;(async () => {
  const questions: PromptObject[] = [
    {
      type: 'text',
      name: 'root',
      message: `Where would you like to create your project?`,
      initial: `./`,
      validate(value) {
        return fs.existsSync(path.join(process.cwd(), value))
          ? `whoops, looks like directory ${value} already exists`
          : true
      },
      format(value) {
        return path.join(process.cwd(), value)
      },
    },
    {
      type: 'autocomplete',
      name: 'service',
      message: `Where do you plan to deploy your project? If you're unsure, just hit enter.`,
      choices: [
        { title: `I don't know`, value: `presta` },
        { title: `Netlify`, value: `netlify` },
        { title: `Vercel`, value: `vercel` },
        { title: `Cloudflare Workers`, value: `cloudflare_workers` },
      ],
    },
    {
      type: 'autocomplete',
      name: 'language',
      message: `JavaScript or TypeScript?`,
      choices: [
        { title: `JavaScript`, value: 'js' },
        { title: `TypeScript`, value: 'ts' },
      ],
    },
  ]

  const answers = await prompts(questions)

  await createPresta(answers as Config)

  const relativeCwd = '.' + answers.root.replace(process.cwd(), '')

  console.log(`\nYou're all set! To get started, run:\n\n  cd ${relativeCwd} && npm i\n`)
})()

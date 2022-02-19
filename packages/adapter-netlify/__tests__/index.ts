import fs from 'fs'
import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'
import { ManifestDynamicFile } from 'presta'

import createPlugin, {
  toAbsolutePath,
  normalizeNetlifyRoute,
  prestaRoutesToNetlifyRedirects,
  getNetlifyConfig,
  generateRedirectsString,
  getUserConfiguredRedirects,
  validateAndNormalizeNetlifyConfig,
  onPostBuild,
} from '../index'

const test = suite('@presta/adapter-netlify')

test('toAbsolutePath', async () => {
  assert.equal(toAbsolutePath('/foo', 'bar'), '/foo/bar')
})

test('normalizeNetlifyRoute', async () => {
  assert.equal(normalizeNetlifyRoute('/foo'), '/foo')
  assert.equal(normalizeNetlifyRoute('/*'), '/*')
  assert.equal(normalizeNetlifyRoute('*'), '/*')
  assert.equal(normalizeNetlifyRoute('/foo/*'), '/foo/*')
})

test('prestaRoutesToNetlifyRedirects', async () => {
  const dynamicFile: ManifestDynamicFile = {
    type: 'dynamic',
    src: 'src',
    dest: 'Func',
    route: '/*',
  }
  assert.equal(prestaRoutesToNetlifyRedirects([dynamicFile])[0], {
    from: '/*',
    to: '/.netlify/functions/Func',
    status: 200,
    force: false,
    query: {},
    conditions: {},
    signed: undefined,
  })
})

test('generateRedirectsString', async () => {
  assert.equal(
    generateRedirectsString([
      {
        from: '/*',
        to: '/.netlify/functions/Func',
        status: 200,
        force: false,
        query: {},
        conditions: {},
        signed: undefined,
      },
    ]),
    `/* /.netlify/functions/Func 200`
  )

  assert.equal(
    generateRedirectsString([
      {
        from: '/*',
        to: '/.netlify/functions/Func',
        status: 200,
        force: true,
        query: {},
        conditions: {},
        signed: undefined,
      },
    ]),
    `/* /.netlify/functions/Func 200!`
  )
})

test(`getNetlifyConfig`, async () => {
  const fixtures = afix({
    config: ['netlify.toml', `[build]\n\tpublish = 'static'`],
  })

  const config = getNetlifyConfig({ cwd: fixtures.root })

  assert.equal(config, { build: { publish: 'static' } })
})

test(`getNetlifyConfig - no data`, async () => {
  const fixtures = afix({
    config: ['netlify.toml', ``],
  })

  const config = getNetlifyConfig({ cwd: fixtures.root })

  assert.equal(config, {})
})

test('validateAndNormalizeNetlifyConfig', async () => {
  let plan = 0

  try {
    validateAndNormalizeNetlifyConfig()
  } catch (e) {
    plan++
  }

  try {
    validateAndNormalizeNetlifyConfig({})
  } catch (e) {
    plan++
  }

  try {
    // @ts-expect-error
    validateAndNormalizeNetlifyConfig({ build: {} })
  } catch (e) {
    plan++
  }

  const config = validateAndNormalizeNetlifyConfig({
    build: {
      publish: 'build',
    },
  })

  assert.equal(config.build.publish, path.join(process.cwd(), 'build'))

  const config2 = validateAndNormalizeNetlifyConfig({
    build: {
      publish: 'build',
      functions: 'functions',
    },
  })

  assert.equal(config2.build.functions, path.join(process.cwd(), 'functions'))

  assert.equal(plan, 3)
})

test('getUserConfiguredRedirects - cwd', async () => {
  const cwd = process.cwd()
  const fixtures = afix({
    redirects: ['_redirects', `/old /new 302`],
  })

  process.chdir(fixtures.root)

  const redirects = await getUserConfiguredRedirects(process.cwd())

  assert.equal(redirects.length, 1)
  assert.equal(redirects[0], {
    from: '/old',
    to: '/new',
    status: 302,
    force: false,
    query: {},
    conditions: {},
    signed: undefined,
  })

  process.chdir(cwd)
})

test('onPostBuild - just static, netlify config matches presta config', async () => {
  const cwd = process.cwd()
  const fixtures = afix({
    html: ['build/static/index.html', ''],
  })

  process.chdir(fixtures.root)

  const config = validateAndNormalizeNetlifyConfig({ build: { publish: 'build/static' } })
  const props = {
    output: path.join(fixtures.root, 'build'),
    staticOutput: path.join(fixtures.root, 'build/static'),
    functionsOutput: path.join(fixtures.root, 'build/functions'),
    manifest: { files: [] },
  }

  await onPostBuild(config, props)

  assert.ok(fs.existsSync(path.join(config.build.publish, 'index.html')))
  assert.ok(fs.existsSync(props.output))

  process.chdir(cwd)
})

test('onPostBuild - just static, netlify config does not match presta config', async () => {
  const cwd = process.cwd()
  const fixtures = afix({
    html: ['build/static/index.html', ''],
  })
  fixtures.mkdir('site')

  process.chdir(fixtures.root)

  const config = validateAndNormalizeNetlifyConfig({ build: { publish: 'site' } })
  const props = {
    output: path.join(fixtures.root, 'build'),
    staticOutput: path.join(fixtures.root, 'build/static'),
    functionsOutput: path.join(fixtures.root, 'build/functions'),
    manifest: { files: [] },
  }

  await onPostBuild(config, props)

  assert.ok(fs.existsSync(path.join(config.build.publish, 'index.html')))
  assert.not.ok(fs.existsSync(props.output))

  process.chdir(cwd)
})

test('onPostBuild - has functions, not configured', async () => {
  const cwd = process.cwd()
  const fixtures = afix({
    html: ['build/static/index.html', ''],
    lambda: ['build/functions/lamba.js', ''],
  })

  process.chdir(fixtures.root)

  const config = validateAndNormalizeNetlifyConfig({ build: { publish: 'build/static' } })
  const props = {
    output: path.join(fixtures.root, 'build'),
    staticOutput: path.join(fixtures.root, 'build/static'),
    functionsOutput: path.join(fixtures.root, 'build/functions'),
    manifest: {
      files: [
        {
          type: 'dynamic',
          src: 'src',
          dest: fixtures.files.lambda.path,
          route: '*',
        } as ManifestDynamicFile,
      ],
    },
  }

  let plan = 0

  try {
    await onPostBuild(config, props)
  } catch (e) {
    plan++
  }

  assert.equal(plan, 1)

  process.chdir(cwd)
})

test(`onPostBuild - has functions, paths match`, async () => {
  const cwd = process.cwd()
  const fixtures = afix({
    html: ['build/static/index.html', ''],
    lambda: ['build/functions/lambda.js', ''],
  })

  process.chdir(fixtures.root)

  const config = validateAndNormalizeNetlifyConfig({
    build: {
      publish: 'build/static',
      functions: 'build/functions',
    },
  })
  const props = {
    output: path.join(fixtures.root, 'build'),
    staticOutput: path.join(fixtures.root, 'build/static'),
    functionsOutput: path.join(fixtures.root, 'build/functions'),
    manifest: {
      files: [
        {
          type: 'dynamic',
          src: 'src',
          dest: fixtures.files.lambda.path,
          route: '*',
        } as ManifestDynamicFile,
      ],
    },
  }

  await onPostBuild(config, props)

  assert.ok(fs.existsSync(path.join(config.build.publish, 'index.html')))
  // @ts-ignore
  assert.ok(fs.existsSync(path.join(config.build.publish, '_redirects')))
  // @ts-ignore
  assert.ok(fs.existsSync(path.join(config.build.functions, 'lambda.js')))

  process.chdir(cwd)
})

test(`onPostBuild - has functions, paths don't match`, async () => {
  const cwd = process.cwd()
  const fixtures = afix({
    html: ['build/static/index.html', ''],
    lambda: ['build/functions/lambda.js', ''],
  })

  process.chdir(fixtures.root)

  const config = validateAndNormalizeNetlifyConfig({
    build: {
      publish: 'site',
      functions: 'functions',
    },
  })
  const props = {
    output: path.join(fixtures.root, 'build'),
    staticOutput: path.join(fixtures.root, 'build/static'),
    functionsOutput: path.join(fixtures.root, 'build/functions'),
    manifest: {
      files: [
        {
          type: 'dynamic',
          src: 'src',
          dest: fixtures.files.lambda.path,
          route: '*',
        } as ManifestDynamicFile,
      ],
    },
  }

  await onPostBuild(config, props)

  assert.ok(fs.existsSync(path.join(config.build.publish, 'index.html')))
  // @ts-ignore
  assert.ok(fs.existsSync(path.join(config.build.publish, '_redirects')))
  // @ts-ignore
  assert.ok(fs.existsSync(path.join(config.build.functions, 'lambda.js')))
  assert.not.ok(fs.existsSync(props.output))

  process.chdir(cwd)
})

test('createPlugin with no config', async () => {
  try {
    // @ts-ignore
    await createPlugin()()
    throw 'err'
  } catch (e) {
    assert.ok(e !== 'err')
  }
})

test('createPlugin with config', async () => {
  const cwd = process.cwd()
  const fixtures = afix({
    config: [
      'netlify.toml',
      `
      [build]
        publish = 'build/static'
        functions = 'build/functions'
    `,
    ],
  })

  process.chdir(fixtures.root)

  let plan = 0

  await createPlugin()(
    // @ts-ignore
    {},
    {
      onPostBuild() {
        plan++
      },
    }
  )

  process.chdir(cwd)

  assert.equal(plan, 1)
})

test.run()

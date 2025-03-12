import path from 'path'
import fs from 'fs-extra'
import merge from 'deepmerge'
import sort from 'sort-package-json'

export type Service = 'presta' | 'netlify' | 'vercel'
export type Language = 'ts' | 'js'
export type Config = {
  root: string
  service: Service
  language: Language
}

const LOCAL_TEMPLATES_DIR = path.join(__dirname, 'lib/templates')

const basePackageJson = {
  name: 'create-presta',
  version: '0.0.0',
  scripts: {
    start: 'presta dev',
    build: 'presta',
  },
}

const commonDependencies = {
  js: {
    devDependencies: {},
    dependencies: {
      presta: '*',
    },
  },
  ts: {
    devDependencies: {
      typescript: '*',
    },
    dependencies: {
      presta: '*',
    },
  },
}

const serviceDependencies = {
  presta: {
    devDependencies: {},
    dependencies: {},
  },
  netlify: {
    devDependencies: {
      '@presta/adapter-netlify': '*',
    },
    dependencies: {},
  },
  vercel: {
    devDependencies: {
      '@presta/adapter-vercel': '*',
    },
    dependencies: {},
  },
}

export async function createPresta(config: Config) {
  const { root, language, service } = config
  const isTypeScript = language === 'ts'
  const serviceDir = path.join(LOCAL_TEMPLATES_DIR, service)

  // common files
  await fs.copy(path.join(LOCAL_TEMPLATES_DIR, '_common'), root)
  await fs.copy(isTypeScript ? path.join(LOCAL_TEMPLATES_DIR, '_ts') : path.join(LOCAL_TEMPLATES_DIR, '_js'), root)

  // package.json
  const commonDeps = commonDependencies[language]
  const serviceDeps = serviceDependencies[service]
  const deps = merge(commonDeps, serviceDeps)
  const packageJson = merge(basePackageJson, deps)
  await fs.writeFile(path.join(root, 'package.json'), JSON.stringify(sort(packageJson), null, '  '), 'utf8')

  // .gitignore
  const mergedGitignore =
    fs.readFileSync(path.join(root, 'gitignore'), 'utf8') + fs.readFileSync(path.join(serviceDir, 'gitignore'), 'utf8')
  await fs.writeFile(path.join(root, './.gitignore'), mergedGitignore, 'utf8')

  // presta.config
  const prestaConfigFilename = isTypeScript ? 'presta.config.ts' : 'presta.config.js'
  const prestaConfigFilepath = path.join(serviceDir, prestaConfigFilename)
  await fs.copy(prestaConfigFilepath, path.join(root, prestaConfigFilename))
}

import path from 'path'

export const CWD = process.cwd()

export const TMP_DIR = path.join(CWD, '.presta')
export const TMP_STATIC = path.join(TMP_DIR, 'static')
export const TMP_DYNAMIC = path.join(TMP_DIR, 'dynamic')

export const CONFIG_DEFAULT = 'presta.config.js' // no extension

export const OUTPUT_STATIC_DIR = 'static'
export const OUTPUT_DYNAMIC_PAGES_ENTRY = 'functions/presta.js'

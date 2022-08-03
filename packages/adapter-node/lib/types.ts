/**
 * THIS IS PROD CODE, BE CAREFUL WHAT YOU ADD TO THIS FILE
 */
import type { Manifest } from 'presta'

export type Options = {
  port: number
}

export type Context = {
  staticOutputDir: string
  functionsOutputDir: string
  manifest: Manifest
}

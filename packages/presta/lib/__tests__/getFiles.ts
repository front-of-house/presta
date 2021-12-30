import path from 'path'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { afix } from 'afix'

import { isStatic, isDynamic, getFiles } from '../getFiles'

const test = suite('presta - getFiles')

test('getFiles - isStatic', async () => {
  const fixture = afix({
    no: ['noGetStaticPaths.js', `export function handler () {}`],
    yes: ['getStaticPaths.js', `export function getStaticPaths () {}`],
    arrow: ['getStaticPathsArrow.js', `export const getStaticPaths = () => {}`],
  })

  assert.equal(isStatic(fixture.files.no.path), false)
  assert.equal(isStatic(fixture.files.yes.path), true)
  assert.equal(isStatic(fixture.files.arrow.path), true)
})

test('getFiles - isDynamic', async () => {
  const fixture = afix({
    no: ['noRoute.js', `export function handler() {}`],
    yes: ['route.js', `export const route = '/';`],
  })

  assert.equal(isDynamic(fixture.files.no.path), false)
  assert.equal(isDynamic(fixture.files.yes.path), true)
})

test('getFiles - getFiles', async () => {
  const fixture = afix({
    noMatch: ['noMatch.getFiles.js', `export function handler() {}`],
    hybrid: ['hybrid.getFiles.js', `export const route = '*';export function getStaticPaths() {};`],
    static: ['static.getFiles.js', `export function getStaticPaths() {};`],
  })

  const results = getFiles([path.join(fixture.root, '*.getFiles.js')])

  assert.equal(results.length, 3)
})

test.run()

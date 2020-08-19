#! /usr/bin/env node
'use strict'

const path = require('path')

const cwd = process.cwd()
const [ i, n ] = process.argv.slice(2)
const input = path.resolve(cwd, i || cwd)
const noreload = n || false

require('./')(input, noreload)

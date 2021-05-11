import fs from 'fs'
import path from 'path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Hypo, Box } from '@hypobox/react'
import { html } from 'presta/html'
import { hypostyle } from 'hypostyle'
import unified from 'unified'
import markdown from 'remark-parse'
import remarkHtml from 'remark-html'
import highlight from 'remark-highlight.js'
import { source } from 'presta/source'

import { title } from '@/src/lib/title'
import * as document from '@/src/lib/document'
import { theme } from '@/src/lib/theme'

import { Gutter } from '@/src/components/Gutter'
import { Github } from '@/src/icons/Github'
import { Logo } from '@/src/components/Logo'

export async function getStaticPaths () {
  const files = source(path.resolve(__dirname, '../content/docs.md'))
  console.log(files)
  return ['/docs']
}

export async function handler (ctx) {
  const file = fs.readFileSync(
    path.resolve(__dirname, '../content/docs.md'),
    'utf-8'
  )
  const content = await new Promise((res, rej) => {
    unified()
      .use(markdown)
      .use(highlight)
      .use(remarkHtml)
      .process(file, (err, h) => {
        if (err) rej(err)
        res(h)
      })
  })
  const hypo = hypostyle(theme)
  const head = document.head(ctx)
  const body = renderToStaticMarkup(
    <div id='root'>
      <Hypo hypostyle={hypo}>
        <Box pb={6} cx={{ overflow: 'hidden' }}>
          <Gutter withVertical>
            <Box mx='auto' w={1} maxWidth='640px'>
              <Box f aic jcb>
                <Box as='a' href='/' cx={{ textDecoration: 'none' }}>
                  <Logo noWord />
                </Box>

                <Box as='ul' f aic>
                  <Box as='li' db>
                    <Box
                      as='a'
                      db
                      lh='1.0'
                      href='https://github.com/sure-thing/presta'
                      target='_blank'
                      fw='bold'
                    >
                      <Github w='20px' h='20px' />
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box pt={16} f fw jcb>
                <Box
                  w={1}
                  className='wysiwyg'
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </Box>
            </Box>
          </Gutter>
        </Box>
      </Hypo>
    </div>
  )

  return {
    html: html({
      title: title(['Documentation', 'Presta']),
      description: 'Hyper minimal framework for the modern web.',
      head: {
        ...head,
        style: [...(head.style || []), { id: 'style', children: hypo.flush() }]
      },
      body: body,
      foot: document.foot(ctx)
    })
  }
}

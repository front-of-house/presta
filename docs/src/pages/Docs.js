import fs from 'fs'
import path from 'path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Hypo, Box } from '@hypobox/react'
import { html } from 'presta/html'
import { hypostyle } from 'hypostyle'

import { title } from '@/src/lib/title'
import * as document from '@/src/lib/document'
import { theme } from '@/src/lib/theme'

import { Gutter } from '@/src/components/Gutter'
import { Github } from '@/src/icons/Github'
import { Markdown } from '@/src/components/Markdown'
import { Logo } from '@/src/components/Logo'

export async function getStaticPaths () {
  return ['/docs']
}

export function handler (ctx) {
  const file = fs.readFileSync(
    path.resolve(__dirname, '../content/docs.md'),
    'utf-8'
  )
  const hypo = hypostyle(theme)

  const body = renderToStaticMarkup(
    <div id='root'>
      <Hypo hypostyle={hypo}>
        <Box pb={6} cx={{ overflow: 'hidden' }}>
          <Gutter withVertical>
            <Box mx='auto' maxWidth='640px'>
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
                <Markdown content={file} />
              </Box>
            </Box>
          </Gutter>
        </Box>
      </Hypo>
    </div>
  )
  const head = document.head(ctx)

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

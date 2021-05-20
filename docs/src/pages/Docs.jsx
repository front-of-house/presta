import path from 'path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Hypo, Box } from '@hypobox/react'
import { html } from 'presta/html'
import { hypostyle } from 'hypostyle'

import { title } from '@/src/lib/title'
import * as document from '@/src/lib/document'
import { theme } from '@/src/lib/theme'
import { source } from '@/src/lib/source'

import { Gutter } from '@/src/components/Gutter'
import { Github } from '@/src/icons/Github'
import { Logo } from '@/src/components/Logo'

const { paths, sources } = source('**/*.md', {
  file: __filename,
  baseDir: path.resolve(__dirname, '../content')
})

export async function getStaticPaths () {
  return paths
}

export async function handler (ctx) {
  const { content, frontmatter } = sources[ctx.path]

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
            </Box>

            <Box rel pt={16} mx='auto' w={1} maxWidth='640px'>
              <Box as='h1'>{frontmatter.title}</Box>
            </Box>

            <Box rel pt={10} mx='auto' w={1} maxWidth='640px'>
              <Box
                as='ul'
                db
                abs
                left
                w={200}
                transform='translateX(-100%) translateX(-48px)'
              >
                {Object.keys(sources)
                  .sort((a, b) => {
                    const _a = sources[a].frontmatter.order
                    const _b = sources[b].frontmatter.order
                    return _a - _b
                  })
                  .map(url => (
                    <Box as='li'>
                      <Box as='a' className='p' href={url}>
                        {sources[url].frontmatter.title}
                      </Box>
                    </Box>
                  ))}
              </Box>

              <Box f fw jcb>
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
        link: [
          ...head.link
          // { rel: 'stylesheet', href: extract.css(hypo.flush()) }
        ],
        style: [{ id: 'hypo', children: hypo.flush() }]
      },
      body: body,
      foot: document.foot(ctx)
    })
  }
}

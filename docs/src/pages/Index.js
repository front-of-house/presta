import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Hypo, Box } from '@hypobox/react'
import { html } from 'presta/html'
import { hypostyle } from 'hypostyle'

import { title } from '@/src/lib/title'
import * as document from '@/src/lib/document'
import { theme } from '@/src/lib/theme'

import { Gutter } from '@/src/components/Gutter'
import { Alert } from '@/src/components/Alert'
import { Github } from '@/src/icons/Github'
import { Button } from '@/src/components/Button'
import { Logo } from '@/src/components/Logo'

export function getStaticPaths () {
  return ['/']
}

function Page () {
  return (
    <Box pb={6} cx={{ overflow: 'hidden' }}>
      <Gutter withVertical>
        <Box mx='auto' maxWidth='1100px'>
          <Box f aic jcb>
            <Logo />

            <Box as='ul' f aic>
              <Box as='li' db>
                <Box as='a' db href='/docs' fs={5} fw='bold' mr={6}>
                  Docs
                </Box>
              </Box>
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

          <Box pt={80} pb={[8, 8, 12]}>
            <Box f aic jcb fw>
              <Box as='h2' fs={2} w={[1, 1, 3 / 5]}>
                Hyper minimal framework for the modern web.
              </Box>

              <Box w={[1, 1, 2 / 5]} pt={[8, 8, 0]} pl={[0, 0, 8]}>
                <Box
                  c='white'
                  bg='dark'
                  p={6}
                  pt={6}
                  pb={7}
                  ff='mono'
                  fs={6}
                  cx={{
                    boxShadow: 'var(--shadow)',
                    borderRadius: '6px'
                  }}
                >
                  <Box f aic mb={4}>
                    <Box
                      mr={2}
                      bg='#FA6666'
                      w='10px'
                      h='10px'
                      cx={{ borderRadius: '10px' }}
                    />
                    <Box
                      mr={2}
                      bg='#EDD13C'
                      w='10px'
                      h='10px'
                      cx={{ borderRadius: '10px' }}
                    />
                    <Box
                      mr={2}
                      bg='#86CD4F'
                      w='10px'
                      h='10px'
                      cx={{ borderRadius: '10px' }}
                    />
                  </Box>

                  <Box f>
                    <Box mr={2} cx={{ opacity: 0.5 }}>
                      $
                    </Box>{' '}
                    npx presta build pages/* dist/
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Alert>
            <Box f aic fw jcb>
              <Box w={[1, 1, 'auto']} c='dark'>
                Presta is in active beta. Questions, comments, ideas? Open an
                issue or PR!
              </Box>
              <Box pt={[4, 4, 0]} w={[1, 1, 'auto']}>
                <Button
                  as='a'
                  dib
                  href='https://github.com/sure-thing/presta/issues/new/choose'
                  target='_blank'
                >
                  New Issue
                </Button>
              </Box>
            </Box>
          </Alert>

          <Box f fw py={12} mx={-4}>
            <Box w={[1, 1, 1 / 2]} px={4}>
              <Box as='p' fs={4}>
                Render hybrid pages from a server or statically, with convenient
                co-located data loading. No more prop drilling or fat data
                files.
              </Box>
            </Box>
            <Box w={[1, 1, 1 / 2]} px={4} mt={[4, 4, 0]}>
              <Box as='p' fs={4}>
                Use any JS templating language (yes, React) and bring your own
                directory structure. Config is easy, if you even need it.
              </Box>
            </Box>
          </Box>

          <Box as='ul' f fw mx={-1}>
            {[
              {
                title: `0kb runtime*`,
                description: `*There is no runtime. Pulled a sneaky on ya. But don't worry, you can bring your own.`
              },
              {
                title: `Fast`,
                description: `Runs ES modules natively in Node with no pre-compilation.`
              },
              {
                title: `Flexible`,
                description: `Generate any file format. Seriously. Easily nest microsites.`
              },
              {
                title: `Familiar`,
                description: `Go read the source (and contribute!): atm it's only about 1300 loc.`
              },
              {
                title: `Easy`,
                description: `Get started in seconds, right from the command line. Scale to thousands of pages.`
              },
              {
                title: `Transparent`,
                description: `There's no magic, only strings. Bring back the document web.`
              }
            ].map(f => (
              <Box key={f.title} as='li' db p={1} w={[1, 1 / 2, 1 / 3]} mb={5}>
                <Box h='100%' cx={{ borderLeft: '4px solid var(--pink)' }}>
                  <Box px={5} py={1}>
                    <Box as='h5' mb={3}>
                      {f.title}
                    </Box>
                    <Box as='p' fs={6}>
                      {f.description}
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Gutter>
    </Box>
  )
}

export function handler (ctx) {
  const hypo = hypostyle(theme)
  const head = document.head(ctx)
  const body = renderToStaticMarkup(
    <div id='root'>
      <Hypo hypostyle={hypo}>
        <Page />
      </Hypo>
    </div>
  )

  return {
    html: html({
      title: title('Presta'),
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

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Hypo, Box } from '@hypobox/react'
import { html } from 'presta/html'
import { hypostyle } from 'hypostyle'

import { title } from '@/src/lib/title'
import * as document from '@/src/lib/document'
import { theme } from '@/src/lib/theme'
import { style } from '@/src/lib/style'

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
                <Box as='a' db href='/about' fs={5} fw='bold' mr={6}>
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
                The serverless-first web framework.
              </Box>

              <Box w={[1, 1, 2 / 5]} pt={[8, 8, 0]} pl={[0, 0, 8]}>
                <Box
                  rel
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

                  <Box
                    abs
                    left
                    right
                    top
                    mxa
                    bg='white'
                    borderRadius='4px'
                    px={[2, 2, 3]}
                    py={3}
                    fs={6}
                    w={140}
                    c='dark'
                    tac
                    boxShadow='shadow'
                    transform='translateY(-50%)'
                    cx={{
                      '@keyframes bounce': {
                        from: {
                          transform: 'translateY(-65%)'
                        },
                        to: {
                          transform: 'translateY(-50%)'
                        }
                      },
                      animation: 'bounce 0.4s',
                      animationDirection: 'alternate',
                      animationTimingFunction: 'cubic-bezier(.5, 0.05, 1, .5)',
                      animationIterationCount: 'infinite'
                    }}
                  >
                    Try it now!
                    <Box
                      abs
                      left
                      right
                      bottom
                      mxa
                      w={0}
                      h={0}
                      cx={{
                        borderTop: '8px solid white',
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        transform: 'translateY(100%)'
                      }}
                    />
                  </Box>

                  <Box f>
                    <Box mr={2} cx={{ opacity: 0.5 }}>
                      $
                    </Box>{' '}
                    npx presta watch index.ts
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            rel
            mb={[8, 8, 12]}
            borderRadius='8px'
            bg='dark'
            d={['none', 'none', 'block']}
          >
            <Box
              as='video'
              db
              src='/final.mov'
              w={1}
              borderRadius='8px'
              overflow='hidden'
              autoPlay
              muted
              loop
            />
          </Box>

          <Alert>
            <Box f aic fw jcb>
              <Box w={[1, 1, 'auto']} c='dark'>
                Presta is under active development. Questions, comments, ideas?
                Open an issue or PR!
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

          <Box f fw py={12} mx={-16}>
            <Box w={[1, 1, 1 / 2]} px={4}>
              <Box as='p' fs={4}>
                From HTML pages to serverless APIs, Presta's low level APIs mean
                you can build pretty much anything.
              </Box>
            </Box>
            <Box w={[1, 1, 1 / 2]} px={4} mt={[4, 4, 0]}>
              <Box as='p' fs={4}>
                Few opinions means you bring your own. Use any templating or
                serverless utility library you like.
              </Box>
            </Box>
          </Box>

          <Box as='ul' f fw mx={-1} px={0}>
            {[
              {
                title: `Fast AF`,
                description: `Powered by esbuild`
              },
              {
                title: `0kb runtime*`,
                description: `*There is no runtime. Pulled a sneaky on ya.`
              },
              {
                title: `Flexible`,
                description: `Generate any file type. Easily nest microsites.`
              },
              {
                title: `Hybrid`,
                description: `Make pages static, dynamic, or a mix of both`
              },
              {
                title: `Minimalist`,
                description: `< 1500 loc — and we aim to keep it that way`
              },
              {
                title: `Transparent`,
                description: `No magic — document web FTW`
              }
            ].map(f => (
              <Box key={f.title} as='li' db p={1} w={[1, 1 / 2, 1 / 3]} mb={5}>
                <Box
                  h='100%'
                  cx={{
                    borderLeft: '4px solid',
                    borderColor: 'accent'
                  }}
                >
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

  hypo.injectGlobal(style)

  return {
    html: html({
      head: {
        title: title('Presta'),
        description:
          'The serverless-first web framework. SSG, SSR, API functions and more.',
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

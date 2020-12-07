import path from 'path'
import { h } from 'hyposcript'
import { Box } from 'hypobox'

import { title } from '@/src/lib/title'
import { getFiles } from '@/src/lib/getFiles'

import { Gutter } from '@/src/components/Gutter'
import { Alert } from '@/src/components/Alert'
import { Github } from '@/src/icons/Github'
import { Button } from '@/src/components/Button'
import { SectionButton } from '@/src/components/SectionButton'

export function getStaticPaths () {
  return ['/']
}

export function template ({ head }) {
  const firstDoc = getFiles(
    path.resolve(__dirname, '../content/docs/*.md')
  ).find(doc => doc.slug === 'overview')

  head({
    title: title('Presta'),
    description: 'The hyper minimal web framework for developers.',
    image: '',
    link: [{ rel: 'icon', type: 'image/png', href: '/presta-favicon.png' }]
  })

  return (
    <Box pb={6} css={{ overflow: 'hidden' }}>
      <Gutter withVertical>
        <Box mx='auto' mw='1100px'>
          <Box f aic jcb>
            <Box as='h1' c='b'>
              <Box as='img' src='/presta-mark.png' w='40px' />
            </Box>

            <Box as='ul' f aic>
              <Box as='li' db>
                <Box as='a' db href='/docs' fs={5} fe='bold' mr={6}>
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
                  fe='bold'
                >
                  <Github w='20px' h='20px' />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box pt={80} pb={[8, 8, 12]}>
            <Box f aic jcb fw>
              <Box as='h2' fs={2} w={[1, 1, 3 / 5]}>
                The hyper minimal web framework for developers.
              </Box>

              <Box w={[1, 1, 2 / 5]} pt={[8, 8, 0]} pl={[0, 0, 8]}>
                <Box
                  c='white'
                  bg='d'
                  p={6}
                  pt={6}
                  pb={7}
                  ff='mono'
                  fs={6}
                  css={{
                    borderRadius: '6px',
                    boxShadow: 'var(--shadow)'
                  }}
                >
                  <Box f aic mb={4}>
                    <Box
                      mr={2}
                      bg='#FA6666'
                      w='10px'
                      h='10px'
                      css={{ borderRadius: '10px' }}
                    />
                    <Box
                      mr={2}
                      bg='#EDD13C'
                      w='10px'
                      h='10px'
                      css={{ borderRadius: '10px' }}
                    />
                    <Box
                      mr={2}
                      bg='#86CD4F'
                      w='10px'
                      h='10px'
                      css={{ borderRadius: '10px' }}
                    />
                  </Box>

                  <Box f>
                    <Box mr={2} css={{ opacity: 0.5 }}>
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
              <Box w={[1, 1, 'auto']} c='d'>
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
                description: `*There is no runtime. Pulled a sneaky on ya.`
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
                description: `Go read the source (and contribute!): atm it's only about 700 loc.`
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
              <Box as='li' db p={1} w={[1, 1 / 2, 1 / 3]}>
                <Box h='100%' bg='dAlpha' css={{ borderRadius: '6px' }}>
                  <Box p={5}>
                    <Box as='h5' mb={3} c='b'>
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

          <Box f aic jce pt={12}>
            <SectionButton
              right
              as='a'
              href={`/docs/${firstDoc.slug}`}
              title={firstDoc.linkTitle}
              description={firstDoc.linkDescription}
            />
          </Box>
        </Box>
      </Gutter>
    </Box>
  )
}

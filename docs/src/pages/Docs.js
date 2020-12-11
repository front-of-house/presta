import fs from 'fs'
import path from 'path'
import { h } from 'hyposcript'
import { Box } from 'hypobox'

import { title } from '@/src/lib/title'
import { getFiles } from '@/src/lib/getFiles'

import { Gutter } from '@/src/components/Gutter'
import { Github } from '@/src/icons/Github'
import { SectionButton } from '@/src/components/SectionButton'
import { Markdown } from '@/src/components/Markdown'
import { Logo } from '@/src/components/Logo'

const orderedDocs = [
  { slug: 'overview' },
  { slug: 'getting-started' },
  { slug: 'configuration' },
  { slug: 'pages' },
  { slug: 'development' },
  { slug: 'data-loading' },
  { slug: 'templating' },
  { slug: 'roadmap' }
]

export async function getStaticPaths () {
  return ['/docs']
}

export function template (context) {
  const file = fs.readFileSync(
    path.resolve(__dirname, '../content/docs.md'),
    'utf-8'
  )

  context.head({
    title: title(['Docs', 'Presta']),
    description: 'Docs',
    image: ''
  })

  return (
    <Box pb={6} css={{ overflow: 'hidden' }}>
      <Gutter withVertical>
        <Box mx='auto' mw='640px'>
          <Box f aic jcb>
            <Box as='a' href='/' css={{ textDecoration: 'none' }}>
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
                  fe='bold'
                >
                  <Github w='20px' h='20px' />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box pt={16} f fw jcb>
            <Markdown>{file}</Markdown>
          </Box>
        </Box>
      </Gutter>
    </Box>
  )
}

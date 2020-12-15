import fs from 'fs'
import path from 'path'
import { h } from 'hyposcript'
import { Box } from 'hypobox'

import { title } from '@/src/lib/title'

import { Gutter } from '@/src/components/Gutter'
import { Github } from '@/src/icons/Github'
import { Markdown } from '@/src/components/Markdown'
import { Logo } from '@/src/components/Logo'

export async function getStaticPaths () {
  return ['/docs']
}

export function template (context) {
  const file = fs.readFileSync(
    path.resolve(__dirname, '../content/docs.md'),
    'utf-8'
  )

  context.plugins.head({
    title: title(['Documentation', 'Presta']),
    description: 'Hyper minimal framework for the modern web.'
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

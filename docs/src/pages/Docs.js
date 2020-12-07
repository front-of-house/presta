import path from 'path'
import { h } from 'hyposcript'
import { Box } from 'hypobox'

import { title } from '@/src/lib/title'
import { getFiles } from '@/src/lib/getFiles'

import { Gutter } from '@/src/components/Gutter'
import { Github } from '@/src/icons/Github'
import { SectionButton } from '@/src/components/SectionButton'
import { Markdown } from '@/src/components/Markdown'

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
  const docs = getFiles(path.resolve(__dirname, '../content/docs/*.md'))
  return docs.map(doc => `/docs/${doc.slug}`)
}

export function template (context) {
  const [_, slug] = context.path.match(/\/docs\/(.+)/) || []

  // raw files
  const files = getFiles(path.resolve(__dirname, '../content/docs/*.md'))

  // ordered and filtered
  const docs = orderedDocs
    .map(({ slug }) => files.find(f => f.slug === slug))
    .filter(Boolean)

  const doc = docs.find(d => d.slug === slug)
  const docIndex = docs.findIndex(d => d.slug === slug)
  const prevDoc = docs[docIndex - 1]
  const nextDoc = docs[docIndex + 1]

  context.head({
    title: title([doc.title, 'Presta']),
    description: doc.description,
    image: ''
  })

  return (
    <Box pb={6} css={{ overflow: 'hidden' }}>
      <Gutter withVertical>
        <Box mx='auto' mw='1100px'>
          <Box f aic jcb>
            <Box as='h1' fs={3} c='b'>
              <Box as='a' href='/'>
                <Box as='img' src='/presta-mark.png' w='40px' />
              </Box>
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

          <Box pt={16} f fw jcb mx={-6}>
            <Box w={[1, 1, 1 / 5]} px={6} />
            <Box w={[1, 1, 4 / 5]} px={6}>
              <Box as='h1' mb={6}>
                {doc.title}
              </Box>
            </Box>

            <Box w={[1, 1, 1 / 5]} px={6}>
              <Box as='ul' db>
                {docs.map(doc => (
                  <Box as='li' f aic mb={2}>
                    <Box as='a' lh={5} href={`/docs/${doc.slug}`}>
                      {doc.linkTitle}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box w={[1, 1, 4 / 5]} px={6} mt={[6, 6, 0]}>
              <Markdown>{doc.content}</Markdown>

              <Box f fw jcb mt={12} mx={-4}>
                {prevDoc ? (
                  <Box f px={4} py={2} w={[1, 1, 1 / 2]}>
                    <SectionButton
                      as='a'
                      h
                      href={`/docs/${prevDoc.slug}`}
                      title={prevDoc.linkTitle}
                      description={prevDoc.linkDescription}
                    />
                  </Box>
                ) : (
                  <Box />
                )}
                {nextDoc && (
                  <Box f jce px={4} py={2} w={[1, 1, 1 / 2]}>
                    <SectionButton
                      as='a'
                      h
                      href={`/docs/${nextDoc.slug}`}
                      right
                      title={nextDoc.linkTitle}
                      description={nextDoc.linkDescription}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Gutter>
    </Box>
  )
}

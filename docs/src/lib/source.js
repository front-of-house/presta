import fs from 'fs'
import { source as root, createUrlFromFilepath } from 'presta/source-filesystem'
import unified from 'unified'
import markdown from 'remark-parse'
import remarkHtml from 'remark-html'
import highlight from 'remark-highlight.js'
import frontmatter from 'remark-frontmatter'
import parseFrontmatter from 'remark-parse-frontmatter'

export function source (globs, options) {
  return root(globs, {
    ...options,
    extensions: {
      md (filepath) {
        const p = createUrlFromFilepath({ filepath, baseDir: options.baseDir })

        const { data, contents } = unified()
          .use(frontmatter)
          .use(parseFrontmatter)
          .use(markdown)
          .use(highlight)
          .use(remarkHtml)
          .processSync(fs.readFileSync(filepath, 'utf8'))

        return {
          [p]: {
            content: contents,
            frontmatter: data.frontmatter
          }
        }
      }
    }
  })
}

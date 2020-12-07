import operator from 'operator'
import { picoapp } from 'picoapp'

import { img } from '@/client/components/img'

const initialHash = window.location.hash.replace('#', '')
const router = operator('#root')
const app = picoapp({
  img
})

function scrollToId (id) {
  try {
    document.getElementById(id).scrollIntoView()
  } catch (e) {}
}

if (initialHash) scrollToId(initialHash)

app.mount()

router.on('after', ({ previousDocument, location }) => {
  document.head.replaceChild(
    previousDocument.getElementById('style'),
    document.getElementById('style')
  )
  document.title = previousDocument.title
  window.history.pushState({}, '', location)

  window.scrollTo(0, 0)

  app.unmount()
  app.mount()
})

router.on('hash', ({ hash }) => {
  if (hash) scrollToId(hash)
})

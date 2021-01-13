const { document } = require('../document')

function defaultCreateContent (context) {
  return document({
    head: context.props.head,
    body: context.props.content
  })
}

module.exports = { defaultCreateContent }

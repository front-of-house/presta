const { head } = require('./pluginHead')

function initPlugins (context, config) {
  config.plugins = {
    head: head(),
    ...(config.plugins || {})
  }

  for (const plugin of Object.keys(config.plugins)) {
    context.plugins[plugin] = config.plugins[plugin](context, config)
  }
}

module.exports = { initPlugins }

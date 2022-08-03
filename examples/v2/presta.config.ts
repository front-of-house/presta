import { createConfig } from 'presta'

export default createConfig({
  files: ['pages/**'],
  output: 'output',
  assets: 'assets',
  plugins: [
    (context) => {
      context.logger.debug('starting plugin')

      context.events.on('buildComplete', () => {
        context.logger.info('plugin complete')
      })

      return {
        name: 'test',
      }
    },
  ],
})

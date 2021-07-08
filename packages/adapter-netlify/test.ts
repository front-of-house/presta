import { createPlugin } from './index'

test('adapter-netlify', async () => {
  expect(createPlugin()).toBeTruthy()
})

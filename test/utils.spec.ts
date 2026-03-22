import { getAllFiles } from '../src/utils/index.js'

describe('utils', () => {
  test('getAllFiles', async () => {
    expect(await getAllFiles('test/fixtures')).toMatchSnapshot()
  })
})

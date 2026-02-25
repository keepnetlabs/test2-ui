import manuelCheckUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/manuelCheckUrl'

describe('GrapesJs mergedTextsBlocks manuelCheckUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(manuelCheckUrl)).toBe(true)
    expect(manuelCheckUrl[0]).toHaveProperty('tagName')
    expect(manuelCheckUrl[0]).toHaveProperty('content')
  })
})

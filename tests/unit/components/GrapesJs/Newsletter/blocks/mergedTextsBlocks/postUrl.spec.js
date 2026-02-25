import postUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/postUrl'

describe('GrapesJs mergedTextsBlocks postUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(postUrl)).toBe(true)
    expect(postUrl[0]).toHaveProperty('tagName')
    expect(postUrl[0]).toHaveProperty('content')
  })
})

import webUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/webUrl'

describe('GrapesJs mergedTextsBlocks webUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(webUrl)).toBe(true)
    expect(webUrl[0]).toHaveProperty('tagName')
    expect(webUrl[0]).toHaveProperty('content')
  })
})

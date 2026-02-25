import link from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/link'

describe('GrapesJs mergedTextsBlocks link', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(link)).toBe(true)
    expect(link[0]).toHaveProperty('tagName')
    expect(link[0]).toHaveProperty('content')
  })
})

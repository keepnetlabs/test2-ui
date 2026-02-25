import to from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/to'

describe('GrapesJs mergedTextsBlocks to', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(to)).toBe(true)
    expect(to[0]).toHaveProperty('tagName')
    expect(to[0]).toHaveProperty('content')
  })
})

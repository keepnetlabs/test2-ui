import category from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/category'

describe('GrapesJs mergedTextsBlocks category', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(category)).toBe(true)
    expect(category[0]).toHaveProperty('tagName')
    expect(category[0]).toHaveProperty('content')
  })
})

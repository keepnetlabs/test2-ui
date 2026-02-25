import description from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/description'

describe('GrapesJs mergedTextsBlocks description', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(description)).toBe(true)
    expect(description[0]).toHaveProperty('tagName')
    expect(description[0]).toHaveProperty('content')
  })
})

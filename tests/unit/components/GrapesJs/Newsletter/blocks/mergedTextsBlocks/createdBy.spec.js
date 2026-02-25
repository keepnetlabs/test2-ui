import createdBy from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/createdBy'

describe('GrapesJs mergedTextsBlocks createdBy', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(createdBy)).toBe(true)
    expect(createdBy[0]).toHaveProperty('tagName')
    expect(createdBy[0]).toHaveProperty('content')
  })
})

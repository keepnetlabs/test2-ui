import owner from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/owner'

describe('GrapesJs mergedTextsBlocks owner', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(owner)).toBe(true)
    expect(owner[0]).toHaveProperty('tagName')
    expect(owner[0]).toHaveProperty('content')
  })
})

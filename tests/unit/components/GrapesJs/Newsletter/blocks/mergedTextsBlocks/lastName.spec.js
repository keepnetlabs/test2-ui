import lastName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/lastName'

describe('GrapesJs mergedTextsBlocks lastName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(lastName)).toBe(true)
    expect(lastName[0]).toHaveProperty('tagName')
    expect(lastName[0]).toHaveProperty('content')
  })
})

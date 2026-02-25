import investigationName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/investigationName'

describe('GrapesJs mergedTextsBlocks investigationName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(investigationName)).toBe(true)
    expect(investigationName[0]).toHaveProperty('tagName')
    expect(investigationName[0]).toHaveProperty('content')
  })
})

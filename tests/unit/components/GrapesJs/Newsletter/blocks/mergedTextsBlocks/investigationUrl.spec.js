import investigationUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/investigationUrl'

describe('GrapesJs mergedTextsBlocks investigationUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(investigationUrl)).toBe(true)
    expect(investigationUrl[0]).toHaveProperty('tagName')
    expect(investigationUrl[0]).toHaveProperty('content')
  })
})

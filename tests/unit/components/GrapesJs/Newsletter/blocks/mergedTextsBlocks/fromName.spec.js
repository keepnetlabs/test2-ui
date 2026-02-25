import fromName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/fromName'

describe('GrapesJs mergedTextsBlocks fromName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(fromName)).toBe(true)
    expect(fromName[0]).toHaveProperty('tagName')
    expect(fromName[0]).toHaveProperty('content')
  })
})

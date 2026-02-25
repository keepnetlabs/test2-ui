import companyName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/companyName'

describe('GrapesJs mergedTextsBlocks companyName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(companyName)).toBe(true)
    expect(companyName[0]).toHaveProperty('tagName')
    expect(companyName[0]).toHaveProperty('content')
  })
})

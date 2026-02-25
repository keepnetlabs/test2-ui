import shareCompanyName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/shareCompanyName'

describe('GrapesJs mergedTextsBlocks shareCompanyName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(shareCompanyName)).toBe(true)
    expect(shareCompanyName[0]).toHaveProperty('tagName')
    expect(shareCompanyName[0]).toHaveProperty('content')
  })
})

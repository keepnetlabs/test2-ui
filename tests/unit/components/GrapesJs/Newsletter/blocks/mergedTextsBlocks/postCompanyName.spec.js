import postCompanyName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/postCompanyName'

describe('GrapesJs mergedTextsBlocks postCompanyName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(postCompanyName)).toBe(true)
    expect(postCompanyName[0]).toHaveProperty('tagName')
    expect(postCompanyName[0]).toHaveProperty('content')
  })
})

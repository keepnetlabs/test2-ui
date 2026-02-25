import userLanguage from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/userLanguage'

describe('GrapesJs mergedTextsBlocks userLanguage', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(userLanguage)).toBe(true)
    expect(userLanguage[0]).toHaveProperty('tagName')
    expect(userLanguage[0]).toHaveProperty('content')
  })
})

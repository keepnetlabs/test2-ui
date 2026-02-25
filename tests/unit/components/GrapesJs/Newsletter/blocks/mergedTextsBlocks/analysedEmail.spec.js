import analysedEmail from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/analysedEmail'

describe('GrapesJs mergedTextsBlocks analysedEmail', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(analysedEmail)).toBe(true)
    expect(analysedEmail[0]).toHaveProperty('tagName')
    expect(analysedEmail[0]).toHaveProperty('content')
  })
})

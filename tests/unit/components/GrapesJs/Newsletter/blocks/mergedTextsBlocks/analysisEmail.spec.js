import analysisEmail from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/analysisEmail'

describe('GrapesJs mergedTextsBlocks analysisEmail', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(analysisEmail)).toBe(true)
    expect(analysisEmail[0]).toHaveProperty('tagName')
    expect(analysisEmail[0]).toHaveProperty('content')
  })
})

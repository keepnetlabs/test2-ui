import communityIndustry from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/communityIndustry'

describe('GrapesJs mergedTextsBlocks communityIndustry', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(communityIndustry)).toBe(true)
    expect(communityIndustry[0]).toHaveProperty('tagName')
    expect(communityIndustry[0]).toHaveProperty('content')
  })
})

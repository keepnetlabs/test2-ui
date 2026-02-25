import communityIndustry from '@/components/GrapesJs/Newsletter/mergedTexts/communityIndustry'

describe('GrapesJs mergedTexts communityIndustry', () => {
  it('exports default with label and category', () => {
    expect(communityIndustry.label).toBeDefined()
    expect(communityIndustry.category).toBe('Merge Tags')
  })
})

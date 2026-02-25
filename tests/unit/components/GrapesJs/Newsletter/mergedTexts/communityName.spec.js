import communityName from '@/components/GrapesJs/Newsletter/mergedTexts/communityName'

describe('GrapesJs mergedTexts communityName', () => {
  it('exports default with label and category', () => {
    expect(communityName.label).toBeDefined()
    expect(communityName.category).toBe('Merge Tags')
  })
})

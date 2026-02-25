import communityTitle from '@/components/GrapesJs/Newsletter/mergedTexts/communityTitle'

describe('GrapesJs mergedTexts communityTitle', () => {
  it('exports default with label and category', () => {
    expect(communityTitle.label).toBeDefined()
    expect(communityTitle.category).toBe('Merge Tags')
  })
})

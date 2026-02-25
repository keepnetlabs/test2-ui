import communityDescription from '@/components/GrapesJs/Newsletter/mergedTexts/communityDescription'

describe('GrapesJs mergedTexts communityDescription', () => {
  it('exports default with label and category', () => {
    expect(communityDescription.label).toBeDefined()
    expect(communityDescription.category).toBe('Merge Tags')
  })
})

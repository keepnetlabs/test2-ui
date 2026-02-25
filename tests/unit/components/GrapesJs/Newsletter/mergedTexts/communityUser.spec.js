import communityUser from '@/components/GrapesJs/Newsletter/mergedTexts/communityUser'

describe('GrapesJs mergedTexts communityUser', () => {
  it('exports default with label and category', () => {
    expect(communityUser.label).toBeDefined()
    expect(communityUser.category).toBe('Merge Tags')
  })
})

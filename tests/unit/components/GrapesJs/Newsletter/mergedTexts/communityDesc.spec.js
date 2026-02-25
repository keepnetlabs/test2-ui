import communityDesc from '@/components/GrapesJs/Newsletter/mergedTexts/communityDesc'

describe('GrapesJs mergedTexts communityDesc', () => {
  it('exports default with label and category', () => {
    expect(communityDesc.label).toBeDefined()
    expect(communityDesc.category).toBe('Merge Tags')
  })
})

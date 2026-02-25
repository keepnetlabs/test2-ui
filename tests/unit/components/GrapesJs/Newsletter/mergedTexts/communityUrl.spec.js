import communityUrl from '@/components/GrapesJs/Newsletter/mergedTexts/communityUrl'

describe('GrapesJs mergedTexts communityUrl', () => {
  it('exports default with label and category', () => {
    expect(communityUrl.label).toBeDefined()
    expect(communityUrl.category).toBe('Merge Tags')
  })
})

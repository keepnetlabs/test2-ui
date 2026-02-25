import memberCount from '@/components/GrapesJs/Newsletter/mergedTexts/memberCount'

describe('GrapesJs mergedTexts memberCount', () => {
  it('exports default with label and category', () => {
    expect(memberCount.label).toBeDefined()
    expect(memberCount.category).toBe('Merge Tags')
  })
})

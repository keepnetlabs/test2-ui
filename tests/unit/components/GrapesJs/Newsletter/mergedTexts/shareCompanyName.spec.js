import shareCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/shareCompanyName'

describe('GrapesJs mergedTexts shareCompanyName', () => {
  it('exports default with label and category', () => {
    expect(shareCompanyName.label).toBeDefined()
    expect(shareCompanyName.category).toBe('Merge Tags')
  })
})

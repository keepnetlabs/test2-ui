import companyLogo from '@/components/GrapesJs/Newsletter/mergedTexts/companyLogo'

describe('GrapesJs mergedTexts companyLogo', () => {
  it('exports default with label and category', () => {
    expect(companyLogo.label).toBeDefined()
    expect(companyLogo.category).toBe('Merge Tags')
  })
})

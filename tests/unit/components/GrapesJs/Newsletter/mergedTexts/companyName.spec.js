import companyName from '@/components/GrapesJs/Newsletter/mergedTexts/companyName'

describe('GrapesJs mergedTexts companyName', () => {
  it('exports default with label Company Name', () => {
    expect(companyName.label).toBe('Company Name')
    expect(companyName.category).toBe('Merge Tags')
  })
})

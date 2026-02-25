import postCompanyName from '@/components/GrapesJs/Newsletter/mergedTexts/postCompanyName'

describe('GrapesJs mergedTexts postCompanyName', () => {
  it('exports default with label and category', () => {
    expect(postCompanyName.label).toBeDefined()
    expect(postCompanyName.category).toBe('Merge Tags')
  })
})

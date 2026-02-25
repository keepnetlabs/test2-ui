import userLanguage from '@/components/GrapesJs/Newsletter/mergedTexts/userLanguage'

describe('GrapesJs mergedTexts userLanguage', () => {
  it('exports default with label and category', () => {
    expect(userLanguage.label).toBeDefined()
    expect(userLanguage.category).toBe('Merge Tags')
  })
})

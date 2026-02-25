import dateEmailSent from '@/components/GrapesJs/Newsletter/mergedTexts/dateEmailSent'

describe('GrapesJs mergedTexts dateEmailSent', () => {
  it('exports default with label and category', () => {
    expect(dateEmailSent.label).toBeDefined()
    expect(dateEmailSent.category).toBe('Merge Tags')
  })
})

import email from '@/components/GrapesJs/Newsletter/mergedTexts/email'

describe('GrapesJs mergedTexts email', () => {
  it('exports default with label and category', () => {
    expect(email.label).toBeDefined()
    expect(email.category).toBe('Merge Tags')
  })
})

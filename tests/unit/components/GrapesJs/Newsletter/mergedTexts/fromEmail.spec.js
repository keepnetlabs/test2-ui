import fromEmail from '@/components/GrapesJs/Newsletter/mergedTexts/fromEmail'

describe('GrapesJs mergedTexts fromEmail', () => {
  it('exports default with label and category', () => {
    expect(fromEmail.label).toBeDefined()
    expect(fromEmail.category).toBe('Merge Tags')
  })
})

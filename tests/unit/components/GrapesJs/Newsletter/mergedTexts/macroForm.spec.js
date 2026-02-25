import macroForm from '@/components/GrapesJs/Newsletter/mergedTexts/macroForm'

describe('GrapesJs mergedTexts macroForm', () => {
  it('exports default with label and category', () => {
    expect(macroForm.label).toBeDefined()
    expect(macroForm.category).toBe('Merge Tags')
  })
})

import passwordURL from '@/components/GrapesJs/Newsletter/mergedTexts/passwordURL'

describe('GrapesJs mergedTexts passwordURL', () => {
  it('exports default with label and category', () => {
    expect(passwordURL.label).toBeDefined()
    expect(passwordURL.category).toBe('Merge Tags')
  })
})

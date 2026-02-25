import fromName from '@/components/GrapesJs/Newsletter/mergedTexts/fromName'

describe('GrapesJs mergedTexts fromName', () => {
  it('exports default with label and category', () => {
    expect(fromName.label).toBeDefined()
    expect(fromName.category).toBe('Merge Tags')
  })
})

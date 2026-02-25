import investigationName from '@/components/GrapesJs/Newsletter/mergedTexts/investigationName'

describe('GrapesJs mergedTexts investigationName', () => {
  it('exports default with label and category', () => {
    expect(investigationName.label).toBeDefined()
    expect(investigationName.category).toBe('Merge Tags')
  })
})

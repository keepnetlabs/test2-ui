import to from '@/components/GrapesJs/Newsletter/mergedTexts/to'

describe('GrapesJs mergedTexts to', () => {
  it('exports default with label and category', () => {
    expect(to.label).toBeDefined()
    expect(to.category).toBe('Merge Tags')
  })
})

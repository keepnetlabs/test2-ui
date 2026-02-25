import category from '@/components/GrapesJs/Newsletter/mergedTexts/category'

describe('GrapesJs mergedTexts category', () => {
  it('exports default with label and category', () => {
    expect(category.label).toBeDefined()
    expect(category.category).toBe('Merge Tags')
  })
})

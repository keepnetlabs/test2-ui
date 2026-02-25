import productName from '@/components/GrapesJs/Newsletter/mergedTexts/productName'

describe('GrapesJs mergedTexts productName', () => {
  it('exports default with label and category', () => {
    expect(productName.label).toBeDefined()
    expect(productName.category).toBe('Merge Tags')
  })
})

import mergedFrom from '@/components/GrapesJs/Newsletter/mergedTexts/from'

describe('GrapesJs mergedTexts from', () => {
  it('exports default with label and category', () => {
    expect(mergedFrom.label).toBeDefined()
    expect(mergedFrom.category).toBe('Merge Tags')
  })
})

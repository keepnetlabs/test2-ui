import reportBy from '@/components/GrapesJs/Newsletter/mergedTexts/reportBy'

describe('GrapesJs mergedTexts reportBy', () => {
  it('exports default with label and category', () => {
    expect(reportBy.label).toBeDefined()
    expect(reportBy.category).toBe('Merge Tags')
  })
})

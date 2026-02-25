import date from '@/components/GrapesJs/Newsletter/mergedTexts/date'

describe('GrapesJs mergedTexts date', () => {
  it('exports default with label and category', () => {
    expect(date.label).toBeDefined()
    expect(date.category).toBe('Merge Tags')
  })
})

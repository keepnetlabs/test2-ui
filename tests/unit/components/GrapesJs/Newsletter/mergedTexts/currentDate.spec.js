import currentDate from '@/components/GrapesJs/Newsletter/mergedTexts/currentDate'

describe('GrapesJs mergedTexts currentDate', () => {
  it('exports default with label and category', () => {
    expect(currentDate.label).toBeDefined()
    expect(currentDate.category).toBe('Merge Tags')
  })
})

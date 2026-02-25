import startDate from '@/components/GrapesJs/Newsletter/mergedTexts/startDate'

describe('GrapesJs mergedTexts startDate', () => {
  it('exports default with label and category', () => {
    expect(startDate.label).toBeDefined()
    expect(startDate.category).toBe('Merge Tags')
  })
})

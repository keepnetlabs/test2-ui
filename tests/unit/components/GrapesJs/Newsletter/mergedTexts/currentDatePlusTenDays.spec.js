import currentDatePlusTenDays from '@/components/GrapesJs/Newsletter/mergedTexts/currentDatePlusTenDays'

describe('GrapesJs mergedTexts currentDatePlusTenDays', () => {
  it('exports default with label and category', () => {
    expect(currentDatePlusTenDays.label).toBeDefined()
    expect(currentDatePlusTenDays.category).toBe('Merge Tags')
  })
})

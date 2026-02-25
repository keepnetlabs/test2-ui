import currentDateMinusTenDays from '@/components/GrapesJs/Newsletter/mergedTexts/currentDateMinusTenDays'

describe('GrapesJs mergedTexts currentDateMinusTenDays', () => {
  it('exports default with label and category', () => {
    expect(currentDateMinusTenDays.label).toBeDefined()
    expect(currentDateMinusTenDays.category).toBe('Merge Tags')
  })
})

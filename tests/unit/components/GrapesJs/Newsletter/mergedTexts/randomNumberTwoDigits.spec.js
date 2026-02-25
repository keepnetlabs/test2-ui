import randomNumberTwoDigits from '@/components/GrapesJs/Newsletter/mergedTexts/randomNumberTwoDigits'

describe('GrapesJs mergedTexts randomNumberTwoDigits', () => {
  it('exports default with label and category', () => {
    expect(randomNumberTwoDigits.label).toBeDefined()
    expect(randomNumberTwoDigits.category).toBe('Merge Tags')
  })
})

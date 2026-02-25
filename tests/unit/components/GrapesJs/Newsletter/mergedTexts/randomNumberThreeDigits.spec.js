import randomNumberThreeDigits from '@/components/GrapesJs/Newsletter/mergedTexts/randomNumberThreeDigits'

describe('GrapesJs mergedTexts randomNumberThreeDigits', () => {
  it('exports default with label and category', () => {
    expect(randomNumberThreeDigits.label).toBeDefined()
    expect(randomNumberThreeDigits.category).toBe('Merge Tags')
  })
})

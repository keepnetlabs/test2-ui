import randomNumberOneDigit from '@/components/GrapesJs/Newsletter/mergedTexts/randomNumberOneDigit'

describe('GrapesJs mergedTexts randomNumberOneDigit', () => {
  it('exports default with label and category', () => {
    expect(randomNumberOneDigit.label).toBeDefined()
    expect(randomNumberOneDigit.category).toBe('Merge Tags')
  })
})

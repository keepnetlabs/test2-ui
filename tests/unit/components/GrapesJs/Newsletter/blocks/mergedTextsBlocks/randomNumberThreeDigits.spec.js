import randomNumberThreeDigits from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/randomNumberThreeDigits'

describe('GrapesJs mergedTextsBlocks randomNumberThreeDigits', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(randomNumberThreeDigits)).toBe(true)
    expect(randomNumberThreeDigits[0]).toHaveProperty('tagName')
    expect(randomNumberThreeDigits[0]).toHaveProperty('content')
  })
})

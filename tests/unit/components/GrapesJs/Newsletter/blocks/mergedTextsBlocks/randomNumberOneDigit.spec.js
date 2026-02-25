import randomNumberOneDigit from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/randomNumberOneDigit'

describe('GrapesJs mergedTextsBlocks randomNumberOneDigit', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(randomNumberOneDigit)).toBe(true)
    expect(randomNumberOneDigit[0]).toHaveProperty('tagName')
    expect(randomNumberOneDigit[0]).toHaveProperty('content')
  })
})

import randomNumberTwoDigits from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/randomNumberTwoDigits'

describe('GrapesJs mergedTextsBlocks randomNumberTwoDigits', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(randomNumberTwoDigits)).toBe(true)
    expect(randomNumberTwoDigits[0]).toHaveProperty('tagName')
    expect(randomNumberTwoDigits[0]).toHaveProperty('content')
  })
})

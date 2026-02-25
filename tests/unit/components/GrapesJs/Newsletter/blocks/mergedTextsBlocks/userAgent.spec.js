import userAgent from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/userAgent'

describe('GrapesJs mergedTextsBlocks userAgent', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(userAgent)).toBe(true)
    expect(userAgent[0]).toHaveProperty('tagName')
    expect(userAgent[0]).toHaveProperty('content')
  })
})

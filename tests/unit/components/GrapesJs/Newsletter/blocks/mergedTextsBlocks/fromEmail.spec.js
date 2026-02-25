import fromEmail from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/fromEmail'

describe('GrapesJs mergedTextsBlocks fromEmail', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(fromEmail)).toBe(true)
    expect(fromEmail[0]).toHaveProperty('tagName')
    expect(fromEmail[0]).toHaveProperty('content')
  })
})

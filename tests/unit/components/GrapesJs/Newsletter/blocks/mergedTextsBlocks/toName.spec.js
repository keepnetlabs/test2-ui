import toName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/toName'

describe('GrapesJs mergedTextsBlocks toName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(toName)).toBe(true)
    expect(toName[0]).toHaveProperty('tagName')
    expect(toName[0]).toHaveProperty('content')
  })
})

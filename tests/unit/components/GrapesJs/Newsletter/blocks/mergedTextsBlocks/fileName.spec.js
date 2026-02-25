import fileName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/fileName'

describe('GrapesJs mergedTextsBlocks fileName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(fileName)).toBe(true)
    expect(fileName[0]).toHaveProperty('tagName')
    expect(fileName[0]).toHaveProperty('content')
  })
})

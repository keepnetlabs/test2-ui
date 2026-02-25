import fromBlock from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/from'

describe('GrapesJs mergedTextsBlocks from', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(fromBlock)).toBe(true)
    expect(fromBlock[0]).toHaveProperty('tagName')
    expect(fromBlock[0]).toHaveProperty('content')
  })
})

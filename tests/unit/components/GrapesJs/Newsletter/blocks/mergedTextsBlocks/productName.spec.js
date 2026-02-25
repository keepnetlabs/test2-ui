import productName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/productName'

describe('GrapesJs mergedTextsBlocks productName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(productName)).toBe(true)
    expect(productName[0]).toHaveProperty('tagName')
    expect(productName[0]).toHaveProperty('content')
  })
})

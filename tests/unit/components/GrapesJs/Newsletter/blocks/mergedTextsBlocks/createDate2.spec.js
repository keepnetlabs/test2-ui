import createDate2 from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/createDate2'

describe('GrapesJs mergedTextsBlocks createDate2', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(createDate2)).toBe(true)
    expect(createDate2[0]).toHaveProperty('tagName')
    expect(createDate2[0]).toHaveProperty('content')
  })
})

import createDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/createDate'

describe('GrapesJs mergedTextsBlocks createDate', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(createDate)).toBe(true)
    expect(createDate[0]).toHaveProperty('tagName')
    expect(createDate[0]).toHaveProperty('content')
  })
})

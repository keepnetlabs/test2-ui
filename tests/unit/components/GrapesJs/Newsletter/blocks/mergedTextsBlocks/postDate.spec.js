import postDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/postDate'

describe('GrapesJs mergedTextsBlocks postDate', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(postDate)).toBe(true)
    expect(postDate[0]).toHaveProperty('tagName')
    expect(postDate[0]).toHaveProperty('content')
  })
})

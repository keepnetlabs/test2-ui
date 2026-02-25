import postTitle from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/postTitle'

describe('GrapesJs mergedTextsBlocks postTitle', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(postTitle)).toBe(true)
    expect(postTitle[0]).toHaveProperty('tagName')
    expect(postTitle[0]).toHaveProperty('content')
  })
})

import postUserName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/postUserName'

describe('GrapesJs mergedTextsBlocks postUserName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(postUserName)).toBe(true)
    expect(postUserName[0]).toHaveProperty('tagName')
    expect(postUserName[0]).toHaveProperty('content')
  })
})

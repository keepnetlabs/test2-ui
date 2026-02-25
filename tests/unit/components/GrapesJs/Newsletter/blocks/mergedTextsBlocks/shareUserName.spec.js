import shareUserName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/shareUserName'

describe('GrapesJs mergedTextsBlocks shareUserName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(shareUserName)).toBe(true)
    expect(shareUserName[0]).toHaveProperty('tagName')
    expect(shareUserName[0]).toHaveProperty('content')
  })
})

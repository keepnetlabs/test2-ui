import communityName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/communityName'

describe('GrapesJs mergedTextsBlocks communityName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(communityName)).toBe(true)
    expect(communityName[0]).toHaveProperty('tagName')
    expect(communityName[0]).toHaveProperty('content')
  })
})

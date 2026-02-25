import communityDesc from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/communityDesc'

describe('GrapesJs mergedTextsBlocks communityDesc', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(communityDesc)).toBe(true)
    expect(communityDesc[0]).toHaveProperty('tagName')
    expect(communityDesc[0]).toHaveProperty('content')
  })
})

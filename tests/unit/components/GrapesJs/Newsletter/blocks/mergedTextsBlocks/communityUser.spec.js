import communityUser from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/communityUser'

describe('GrapesJs mergedTextsBlocks communityUser', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(communityUser)).toBe(true)
    expect(communityUser[0]).toHaveProperty('tagName')
    expect(communityUser[0]).toHaveProperty('content')
  })
})

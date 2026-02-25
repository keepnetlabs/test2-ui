import communityTitle from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/communityTitle'

describe('GrapesJs mergedTextsBlocks communityTitle', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(communityTitle)).toBe(true)
    expect(communityTitle[0]).toHaveProperty('tagName')
    expect(communityTitle[0]).toHaveProperty('content')
  })
})

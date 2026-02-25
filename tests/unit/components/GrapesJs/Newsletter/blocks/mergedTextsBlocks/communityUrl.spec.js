import communityUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/communityUrl'

describe('GrapesJs mergedTextsBlocks communityUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(communityUrl)).toBe(true)
    expect(communityUrl[0]).toHaveProperty('tagName')
    expect(communityUrl[0]).toHaveProperty('content')
  })
})

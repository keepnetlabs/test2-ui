import communityDescription from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/communityDescription'

describe('GrapesJs mergedTextsBlocks communityDescription', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(communityDescription)).toBe(true)
    expect(communityDescription[0]).toHaveProperty('tagName')
    expect(communityDescription[0]).toHaveProperty('content')
  })
})

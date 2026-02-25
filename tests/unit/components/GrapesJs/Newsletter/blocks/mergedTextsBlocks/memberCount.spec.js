import memberCount from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/memberCount'

describe('GrapesJs mergedTextsBlocks memberCount', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(memberCount)).toBe(true)
    expect(memberCount[0]).toHaveProperty('tagName')
    expect(memberCount[0]).toHaveProperty('content')
  })
})

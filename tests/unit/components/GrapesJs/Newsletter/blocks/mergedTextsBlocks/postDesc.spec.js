import postDesc from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/postDesc'

describe('GrapesJs mergedTextsBlocks postDesc', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(postDesc)).toBe(true)
    expect(postDesc[0]).toHaveProperty('tagName')
    expect(postDesc[0]).toHaveProperty('content')
  })
})

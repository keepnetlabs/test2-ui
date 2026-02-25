import userName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/userName'

describe('GrapesJs mergedTextsBlocks userName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(userName)).toBe(true)
    expect(userName[0]).toHaveProperty('tagName')
    expect(userName[0]).toHaveProperty('content')
  })
})

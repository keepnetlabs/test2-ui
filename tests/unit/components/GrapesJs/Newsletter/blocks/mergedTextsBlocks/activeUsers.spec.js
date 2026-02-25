import activeUsers from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/activeUsers'

describe('GrapesJs mergedTextsBlocks activeUsers', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(activeUsers)).toBe(true)
    expect(activeUsers[0]).toHaveProperty('tagName')
    expect(activeUsers[0]).toHaveProperty('content')
  })
})

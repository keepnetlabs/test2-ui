import startedBy from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/startedBy'

describe('GrapesJs mergedTextsBlocks startedBy', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(startedBy)).toBe(true)
    expect(startedBy[0]).toHaveProperty('tagName')
    expect(startedBy[0]).toHaveProperty('content')
  })
})

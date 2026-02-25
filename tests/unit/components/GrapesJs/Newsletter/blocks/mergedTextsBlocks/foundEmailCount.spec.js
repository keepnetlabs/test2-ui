import foundEmailCount from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/foundEmailCount'

describe('GrapesJs mergedTextsBlocks foundEmailCount', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(foundEmailCount)).toBe(true)
    expect(foundEmailCount[0]).toHaveProperty('tagName')
    expect(foundEmailCount[0]).toHaveProperty('content')
  })
})

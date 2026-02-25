import startDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/startDate'

describe('GrapesJs mergedTextsBlocks startDate', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(startDate)).toBe(true)
    expect(startDate[0]).toHaveProperty('tagName')
    expect(startDate[0]).toHaveProperty('content')
  })
})

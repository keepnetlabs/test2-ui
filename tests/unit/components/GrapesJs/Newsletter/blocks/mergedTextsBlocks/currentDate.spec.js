import currentDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/currentDate'

describe('GrapesJs mergedTextsBlocks currentDate', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(currentDate)).toBe(true)
    expect(currentDate[0]).toHaveProperty('tagName')
    expect(currentDate[0]).toHaveProperty('content')
  })
})

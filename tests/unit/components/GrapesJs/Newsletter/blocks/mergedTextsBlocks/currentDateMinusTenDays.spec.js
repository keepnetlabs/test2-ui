import currentDateMinusTenDays from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/currentDateMinusTenDays'

describe('GrapesJs mergedTextsBlocks currentDateMinusTenDays', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(currentDateMinusTenDays)).toBe(true)
    expect(currentDateMinusTenDays[0]).toHaveProperty('tagName')
    expect(currentDateMinusTenDays[0]).toHaveProperty('content')
  })
})

import currentDatePlusTenDays from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/currentDatePlusTenDays'

describe('GrapesJs mergedTextsBlocks currentDatePlusTenDays', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(currentDatePlusTenDays)).toBe(true)
    expect(currentDatePlusTenDays[0]).toHaveProperty('tagName')
    expect(currentDatePlusTenDays[0]).toHaveProperty('content')
  })
})

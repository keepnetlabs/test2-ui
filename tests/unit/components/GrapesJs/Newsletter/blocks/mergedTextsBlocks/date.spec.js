import date from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/date'

describe('GrapesJs mergedTextsBlocks date', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(date)).toBe(true)
    expect(date[0]).toHaveProperty('tagName')
    expect(date[0]).toHaveProperty('content')
  })
})

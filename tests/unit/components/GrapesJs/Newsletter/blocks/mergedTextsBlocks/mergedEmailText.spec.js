import mergedEmailText from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/mergedEmailText'

describe('GrapesJs mergedTextsBlocks mergedEmailText', () => {
  it('exports default array with block structure', () => {
    expect(Array.isArray(mergedEmailText)).toBe(true)
    expect(mergedEmailText[0]).toBeDefined()
  })
})

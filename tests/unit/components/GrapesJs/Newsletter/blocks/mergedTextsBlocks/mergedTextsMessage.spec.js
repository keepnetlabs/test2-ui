import mergedTextsMessage from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/mergedTextsMessage'

describe('GrapesJs mergedTextsBlocks mergedTextsMessage', () => {
  it('exports default array with block structure', () => {
    expect(Array.isArray(mergedTextsMessage)).toBe(true)
    expect(mergedTextsMessage[0]).toBeDefined()
  })
})

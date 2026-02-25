import phishingCode from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/phishingCode'

describe('GrapesJs mergedTextsBlocks phishingCode', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(phishingCode)).toBe(true)
    expect(phishingCode[0]).toHaveProperty('tagName')
    expect(phishingCode[0]).toHaveProperty('content')
  })
})

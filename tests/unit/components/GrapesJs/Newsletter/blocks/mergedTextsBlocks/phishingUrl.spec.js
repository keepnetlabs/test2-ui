import phishingUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/phishingUrl'

describe('GrapesJs mergedTextsBlocks phishingUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(phishingUrl)).toBe(true)
    expect(phishingUrl[0]).toHaveProperty('tagName')
    expect(phishingUrl[0]).toHaveProperty('content')
  })
})

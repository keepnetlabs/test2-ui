import macroUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/macroUrl'

describe('GrapesJs mergedTextsBlocks macroUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(macroUrl)).toBe(true)
    expect(macroUrl[0]).toHaveProperty('tagName')
    expect(macroUrl[0]).toHaveProperty('content')
  })
})

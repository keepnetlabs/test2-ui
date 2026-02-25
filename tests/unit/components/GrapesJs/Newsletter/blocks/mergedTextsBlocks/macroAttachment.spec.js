import macroAttachment from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/macroAttachment'

describe('GrapesJs mergedTextsBlocks macroAttachment', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(macroAttachment)).toBe(true)
    expect(macroAttachment[0]).toHaveProperty('tagName')
    expect(macroAttachment[0]).toHaveProperty('content')
  })
})

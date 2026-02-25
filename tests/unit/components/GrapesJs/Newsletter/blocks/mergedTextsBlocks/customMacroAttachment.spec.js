import customMacroAttachment from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/customMacroAttachment'

describe('GrapesJs mergedTextsBlocks customMacroAttachment', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(customMacroAttachment)).toBe(true)
    expect(customMacroAttachment[0]).toHaveProperty('tagName')
    expect(customMacroAttachment[0]).toHaveProperty('content')
  })
})

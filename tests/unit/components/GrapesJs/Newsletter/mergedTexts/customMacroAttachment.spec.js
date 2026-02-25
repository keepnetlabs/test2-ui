import customMacroAttachment from '@/components/GrapesJs/Newsletter/mergedTexts/customMacroAttachment'

describe('GrapesJs mergedTexts customMacroAttachment', () => {
  it('exports default with label and category', () => {
    expect(customMacroAttachment.label).toBeDefined()
    expect(customMacroAttachment.category).toBe('Merge Tags')
  })
})

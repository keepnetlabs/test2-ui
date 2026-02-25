import macroAttachment from '@/components/GrapesJs/Newsletter/mergedTexts/macroAttachment'

describe('GrapesJs mergedTexts macroAttachment', () => {
  it('exports default with label and category', () => {
    expect(macroAttachment.label).toBeDefined()
    expect(macroAttachment.category).toBe('Merge Tags')
  })
})

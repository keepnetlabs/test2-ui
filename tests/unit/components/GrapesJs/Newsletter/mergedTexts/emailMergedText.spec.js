import emailMergedText from '@/components/GrapesJs/Newsletter/mergedTexts/emailMergedText'

describe('GrapesJs mergedTexts emailMergedText', () => {
  it('exports default with label and category', () => {
    expect(emailMergedText.label).toBeDefined()
    expect(emailMergedText.category).toBe('Merge Tags')
  })
})

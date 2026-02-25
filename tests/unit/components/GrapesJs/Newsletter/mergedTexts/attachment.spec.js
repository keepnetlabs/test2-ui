import attachment from '@/components/GrapesJs/Newsletter/mergedTexts/attachment'

describe('GrapesJs mergedTexts attachment', () => {
  it('exports default with label and category', () => {
    expect(attachment.label).toBeDefined()
    expect(attachment.category).toBe('Merge Tags')
  })
})

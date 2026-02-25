import phishingCode from '@/components/GrapesJs/Newsletter/mergedTexts/phishingCode'

describe('GrapesJs mergedTexts phishingCode', () => {
  it('exports default with label and category', () => {
    expect(phishingCode.label).toBeDefined()
    expect(phishingCode.category).toBe('Merge Tags')
  })
})

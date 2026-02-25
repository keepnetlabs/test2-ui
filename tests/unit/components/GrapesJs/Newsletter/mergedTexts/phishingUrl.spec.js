import phishingUrl from '@/components/GrapesJs/Newsletter/mergedTexts/phishingUrl'

describe('GrapesJs mergedTexts phishingUrl', () => {
  it('exports default with label and category', () => {
    expect(phishingUrl.label).toBeDefined()
    expect(phishingUrl.category).toBe('Merge Tags')
  })
})

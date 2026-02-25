import investigationUrl from '@/components/GrapesJs/Newsletter/mergedTexts/investigationUrl'

describe('GrapesJs mergedTexts investigationUrl', () => {
  it('exports default with label and category', () => {
    expect(investigationUrl.label).toBeDefined()
    expect(investigationUrl.category).toBe('Merge Tags')
  })
})

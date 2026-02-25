import macroUrl from '@/components/GrapesJs/Newsletter/mergedTexts/macroUrl'

describe('GrapesJs mergedTexts macroUrl', () => {
  it('exports default with label and category', () => {
    expect(macroUrl.label).toBeDefined()
    expect(macroUrl.category).toBe('Merge Tags')
  })
})

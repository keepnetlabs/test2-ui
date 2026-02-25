import analysisDetailUrl from '@/components/GrapesJs/Newsletter/mergedTexts/analysisDetailUrl'

describe('GrapesJs mergedTexts analysisDetailUrl', () => {
  it('exports default with label and category', () => {
    expect(analysisDetailUrl.label).toBeDefined()
    expect(analysisDetailUrl.category).toBe('Merge Tags')
  })
})

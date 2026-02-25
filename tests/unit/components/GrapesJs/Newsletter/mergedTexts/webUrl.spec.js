import webUrl from '@/components/GrapesJs/Newsletter/mergedTexts/webUrl'

describe('GrapesJs mergedTexts webUrl', () => {
  it('exports default with label and category', () => {
    expect(webUrl.label).toBeDefined()
    expect(webUrl.category).toBe('Merge Tags')
  })
})

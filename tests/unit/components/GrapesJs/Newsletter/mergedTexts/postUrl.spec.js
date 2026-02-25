import postUrl from '@/components/GrapesJs/Newsletter/mergedTexts/postUrl'

describe('GrapesJs mergedTexts postUrl', () => {
  it('exports default with label and category', () => {
    expect(postUrl.label).toBeDefined()
    expect(postUrl.category).toBe('Merge Tags')
  })
})

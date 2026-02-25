import surveyCoverImageUrl from '@/components/GrapesJs/Newsletter/mergedTexts/surveyCoverImageUrl'

describe('GrapesJs mergedTexts surveyCoverImageUrl', () => {
  it('exports default with label and category', () => {
    expect(surveyCoverImageUrl.label).toBeDefined()
    expect(surveyCoverImageUrl.category).toBe('Merge Tags')
  })
})

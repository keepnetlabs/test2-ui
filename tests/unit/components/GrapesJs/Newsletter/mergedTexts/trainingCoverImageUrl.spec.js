import trainingCoverImageUrl from '@/components/GrapesJs/Newsletter/mergedTexts/trainingCoverImageUrl'

describe('GrapesJs mergedTexts trainingCoverImageUrl', () => {
  it('exports default with label and category', () => {
    expect(trainingCoverImageUrl.label).toBeDefined()
    expect(trainingCoverImageUrl.category).toBe('Merge Tags')
  })
})

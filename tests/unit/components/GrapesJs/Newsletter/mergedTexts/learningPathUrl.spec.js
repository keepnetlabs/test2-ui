import learningPathUrl from '@/components/GrapesJs/Newsletter/mergedTexts/learningPathUrl'

describe('GrapesJs mergedTexts learningPathUrl', () => {
  it('exports default with label and category', () => {
    expect(learningPathUrl.label).toBeDefined()
    expect(learningPathUrl.category).toBe('Merge Tags')
  })
})

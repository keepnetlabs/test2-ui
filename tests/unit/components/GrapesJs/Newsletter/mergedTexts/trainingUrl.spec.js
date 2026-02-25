import trainingUrl from '@/components/GrapesJs/Newsletter/mergedTexts/trainingUrl'

describe('GrapesJs mergedTexts trainingUrl', () => {
  it('exports default with label and category', () => {
    expect(trainingUrl.label).toBeDefined()
    expect(trainingUrl.category).toBe('Merge Tags')
  })
})

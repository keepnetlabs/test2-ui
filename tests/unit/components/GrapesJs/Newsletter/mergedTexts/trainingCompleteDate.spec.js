import trainingCompleteDate from '@/components/GrapesJs/Newsletter/mergedTexts/trainingCompleteDate'

describe('GrapesJs mergedTexts trainingCompleteDate', () => {
  it('exports default with label and category', () => {
    expect(trainingCompleteDate.label).toBeDefined()
    expect(trainingCompleteDate.category).toBe('Merge Tags')
  })
})

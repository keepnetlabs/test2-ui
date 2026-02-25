import trainingName from '@/components/GrapesJs/Newsletter/mergedTexts/trainingName'

describe('GrapesJs mergedTexts trainingName', () => {
  it('exports default with label and category', () => {
    expect(trainingName.label).toBeDefined()
    expect(trainingName.category).toBe('Merge Tags')
  })
})

import trainingDescription from '@/components/GrapesJs/Newsletter/mergedTexts/trainingDescription'

describe('GrapesJs mergedTexts trainingDescription', () => {
  it('exports default with label and category', () => {
    expect(trainingDescription.label).toBeDefined()
    expect(trainingDescription.category).toBe('Merge Tags')
  })
})

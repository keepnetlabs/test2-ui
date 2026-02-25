import learningPathStep from '@/components/GrapesJs/Newsletter/mergedTexts/learningPathStep'

describe('GrapesJs mergedTexts learningPathStep', () => {
  it('exports default with label and category', () => {
    expect(learningPathStep.label).toBeDefined()
    expect(learningPathStep.category).toBe('Merge Tags')
  })
})

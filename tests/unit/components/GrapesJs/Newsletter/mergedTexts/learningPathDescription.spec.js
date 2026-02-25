import learningPathDescription from '@/components/GrapesJs/Newsletter/mergedTexts/learningPathDescription'

describe('GrapesJs mergedTexts learningPathDescription', () => {
  it('exports default with label and category', () => {
    expect(learningPathDescription.label).toBeDefined()
    expect(learningPathDescription.category).toBe('Merge Tags')
  })
})

import learningPathName from '@/components/GrapesJs/Newsletter/mergedTexts/learningPathName'

describe('GrapesJs mergedTexts learningPathName', () => {
  it('exports default with label and category', () => {
    expect(learningPathName.label).toBeDefined()
    expect(learningPathName.category).toBe('Merge Tags')
  })
})

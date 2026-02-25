import learningPathDescription from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/learningPathDescription'

describe('GrapesJs mergedTextsBlocks learningPathDescription', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(learningPathDescription)).toBe(true)
    expect(learningPathDescription[0]).toHaveProperty('tagName')
    expect(learningPathDescription[0]).toHaveProperty('content')
  })
})

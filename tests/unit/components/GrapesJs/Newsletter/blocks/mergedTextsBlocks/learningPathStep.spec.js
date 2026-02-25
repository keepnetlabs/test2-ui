import learningPathStep from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/learningPathStep'

describe('GrapesJs mergedTextsBlocks learningPathStep', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(learningPathStep)).toBe(true)
    expect(learningPathStep[0]).toHaveProperty('tagName')
    expect(learningPathStep[0]).toHaveProperty('content')
  })
})

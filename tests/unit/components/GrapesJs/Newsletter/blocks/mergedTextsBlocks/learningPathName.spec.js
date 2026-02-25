import learningPathName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/learningPathName'

describe('GrapesJs mergedTextsBlocks learningPathName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(learningPathName)).toBe(true)
    expect(learningPathName[0]).toHaveProperty('tagName')
    expect(learningPathName[0]).toHaveProperty('content')
  })
})

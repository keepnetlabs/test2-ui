import learningPathUrl from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/learningPathUrl'

describe('GrapesJs mergedTextsBlocks learningPathUrl', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(learningPathUrl)).toBe(true)
    expect(learningPathUrl[0]).toHaveProperty('tagName')
    expect(learningPathUrl[0]).toHaveProperty('content')
  })
})

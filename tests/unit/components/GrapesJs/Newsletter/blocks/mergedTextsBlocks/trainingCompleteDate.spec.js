import trainingCompleteDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingCompleteDate'

describe('GrapesJs mergedTextsBlocks trainingCompleteDate', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(trainingCompleteDate)).toBe(true)
    expect(trainingCompleteDate[0]).toHaveProperty('tagName')
    expect(trainingCompleteDate[0]).toHaveProperty('content')
  })
})

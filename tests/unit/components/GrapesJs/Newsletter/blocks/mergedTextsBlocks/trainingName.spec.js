import trainingName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingName'

describe('GrapesJs mergedTextsBlocks trainingName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(trainingName)).toBe(true)
    expect(trainingName[0]).toHaveProperty('tagName')
    expect(trainingName[0]).toHaveProperty('content')
  })
})

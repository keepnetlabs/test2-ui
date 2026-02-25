import trainingDescription from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingDescription'

describe('GrapesJs mergedTextsBlocks trainingDescription', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(trainingDescription)).toBe(true)
    expect(trainingDescription[0]).toHaveProperty('tagName')
    expect(trainingDescription[0]).toHaveProperty('content')
  })
})

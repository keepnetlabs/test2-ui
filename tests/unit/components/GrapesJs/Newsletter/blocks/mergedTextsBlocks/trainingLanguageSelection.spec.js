import trainingLanguageSelection from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingLanguageSelection'

describe('GrapesJs mergedTextsBlocks trainingLanguageSelection', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(trainingLanguageSelection)).toBe(true)
    expect(trainingLanguageSelection[0]).toHaveProperty('tagName')
    expect(trainingLanguageSelection[0]).toHaveProperty('content')
  })
})

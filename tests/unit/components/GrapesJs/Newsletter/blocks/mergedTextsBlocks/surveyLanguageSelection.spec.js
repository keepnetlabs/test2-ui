import surveyLanguageSelection from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyLanguageSelection'

describe('GrapesJs mergedTextsBlocks surveyLanguageSelection', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(surveyLanguageSelection)).toBe(true)
    expect(surveyLanguageSelection[0]).toHaveProperty('tagName')
    expect(surveyLanguageSelection[0]).toHaveProperty('content')
  })
})

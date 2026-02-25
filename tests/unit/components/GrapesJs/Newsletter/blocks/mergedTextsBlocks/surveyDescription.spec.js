import surveyDescription from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyDescription'

describe('GrapesJs mergedTextsBlocks surveyDescription', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(surveyDescription)).toBe(true)
    expect(surveyDescription[0]).toHaveProperty('tagName')
    expect(surveyDescription[0]).toHaveProperty('content')
  })
})

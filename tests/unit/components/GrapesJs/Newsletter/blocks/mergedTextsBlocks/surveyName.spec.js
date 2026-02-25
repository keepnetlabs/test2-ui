import surveyName from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyName'

describe('GrapesJs mergedTextsBlocks surveyName', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(surveyName)).toBe(true)
    expect(surveyName[0]).toHaveProperty('tagName')
    expect(surveyName[0]).toHaveProperty('content')
  })
})

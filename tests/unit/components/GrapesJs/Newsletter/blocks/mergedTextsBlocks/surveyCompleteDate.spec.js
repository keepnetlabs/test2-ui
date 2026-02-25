import surveyCompleteDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyCompleteDate'

describe('GrapesJs mergedTextsBlocks surveyCompleteDate', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(surveyCompleteDate)).toBe(true)
    expect(surveyCompleteDate[0]).toHaveProperty('tagName')
    expect(surveyCompleteDate[0]).toHaveProperty('content')
  })
})

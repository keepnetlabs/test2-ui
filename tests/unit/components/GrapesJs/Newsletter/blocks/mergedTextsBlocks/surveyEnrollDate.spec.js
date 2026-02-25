import surveyEnrollDate from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyEnrollDate'

describe('GrapesJs mergedTextsBlocks surveyEnrollDate', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(surveyEnrollDate)).toBe(true)
    expect(surveyEnrollDate[0]).toHaveProperty('tagName')
    expect(surveyEnrollDate[0]).toHaveProperty('content')
  })
})

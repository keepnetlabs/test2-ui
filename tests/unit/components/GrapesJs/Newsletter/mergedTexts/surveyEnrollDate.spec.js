import surveyEnrollDate from '@/components/GrapesJs/Newsletter/mergedTexts/surveyEnrollDate'

describe('GrapesJs mergedTexts surveyEnrollDate', () => {
  it('exports default with label and category', () => {
    expect(surveyEnrollDate.label).toBeDefined()
    expect(surveyEnrollDate.category).toBe('Merge Tags')
  })
})

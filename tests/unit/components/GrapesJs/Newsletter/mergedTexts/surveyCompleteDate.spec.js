import surveyCompleteDate from '@/components/GrapesJs/Newsletter/mergedTexts/surveyCompleteDate'

describe('GrapesJs mergedTexts surveyCompleteDate', () => {
  it('exports default with label and category', () => {
    expect(surveyCompleteDate.label).toBeDefined()
    expect(surveyCompleteDate.category).toBe('Merge Tags')
  })
})

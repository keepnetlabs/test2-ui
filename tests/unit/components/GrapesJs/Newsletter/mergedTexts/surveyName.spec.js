import surveyName from '@/components/GrapesJs/Newsletter/mergedTexts/surveyName'

describe('GrapesJs mergedTexts surveyName', () => {
  it('exports default with label and category', () => {
    expect(surveyName.label).toBeDefined()
    expect(surveyName.category).toBe('Merge Tags')
  })
})

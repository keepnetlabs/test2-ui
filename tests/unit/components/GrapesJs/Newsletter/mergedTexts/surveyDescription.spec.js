import surveyDescription from '@/components/GrapesJs/Newsletter/mergedTexts/surveyDescription'

describe('GrapesJs mergedTexts surveyDescription', () => {
  it('exports default with label and category', () => {
    expect(surveyDescription.label).toBeDefined()
    expect(surveyDescription.category).toBe('Merge Tags')
  })
})

import surveyLanguageSelection from '@/components/GrapesJs/Newsletter/mergedTexts/surveyLanguageSelection'

describe('GrapesJs mergedTexts surveyLanguageSelection', () => {
  it('exports default with label and category', () => {
    expect(surveyLanguageSelection.label).toBeDefined()
    expect(surveyLanguageSelection.category).toBe('Merge Tags')
  })
})

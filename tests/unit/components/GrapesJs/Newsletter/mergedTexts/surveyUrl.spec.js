import surveyUrl from '@/components/GrapesJs/Newsletter/mergedTexts/surveyUrl'

describe('GrapesJs mergedTexts surveyUrl', () => {
  it('exports default with label and category', () => {
    expect(surveyUrl.label).toBeDefined()
    expect(surveyUrl.category).toBe('Merge Tags')
  })
})

import surveyReminderCount from '@/components/GrapesJs/Newsletter/mergedTexts/surveyReminderCount'

describe('GrapesJs mergedTexts surveyReminderCount', () => {
  it('exports default with label and category', () => {
    expect(surveyReminderCount.label).toBeDefined()
    expect(surveyReminderCount.category).toBe('Merge Tags')
  })
})

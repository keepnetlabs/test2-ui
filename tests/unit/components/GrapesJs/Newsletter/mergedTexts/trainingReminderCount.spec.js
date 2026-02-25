import trainingReminderCount from '@/components/GrapesJs/Newsletter/mergedTexts/trainingReminderCount'

describe('GrapesJs mergedTexts trainingReminderCount', () => {
  it('exports default with label and category', () => {
    expect(trainingReminderCount.label).toBeDefined()
    expect(trainingReminderCount.category).toBe('Merge Tags')
  })
})

import surveyReminderCount from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/surveyReminderCount'

describe('GrapesJs mergedTextsBlocks surveyReminderCount', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(surveyReminderCount)).toBe(true)
    expect(surveyReminderCount[0]).toHaveProperty('tagName')
    expect(surveyReminderCount[0]).toHaveProperty('content')
  })
})

import trainingReminderCount from '@/components/GrapesJs/Newsletter/blocks/mergedTextsBlocks/trainingReminderCount'

describe('GrapesJs mergedTextsBlocks trainingReminderCount', () => {
  it('exports default array with tagName and content', () => {
    expect(Array.isArray(trainingReminderCount)).toBe(true)
    expect(trainingReminderCount[0]).toHaveProperty('tagName')
    expect(trainingReminderCount[0]).toHaveProperty('content')
  })
})

import DuplicateExecutiveReport from '@/views/DuplicateExecutiveReport.vue'

describe('DuplicateExecutiveReport.vue', () => {
  it('has correct component name', () => {
    expect(DuplicateExecutiveReport.name).toBe('DuplicateExecutiveReport')
  })

  it('registers NewExecutiveReportCommonContainer', () => {
    expect(DuplicateExecutiveReport.components.NewExecutiveReportCommonContainer).toBeDefined()
  })
})

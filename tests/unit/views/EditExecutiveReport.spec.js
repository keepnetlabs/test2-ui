import EditExecutiveReport from '@/views/EditExecutiveReport.vue'

describe('EditExecutiveReport.vue', () => {
  it('has correct component name', () => {
    expect(EditExecutiveReport.name).toBe('EditExecutiveReport')
  })

  it('registers NewExecutiveReportCommonContainer', () => {
    expect(EditExecutiveReport.components.NewExecutiveReportCommonContainer).toBeDefined()
  })
})

import PreviewExecutiveReport from '@/views/PreviewExecutiveReport.vue'

describe('PreviewExecutiveReport.vue', () => {
  it('has correct component name', () => {
    expect(PreviewExecutiveReport.name).toBe('PreviewExecutiveReport')
  })

  it('registers NewExecutiveReportCommonContainer', () => {
    expect(PreviewExecutiveReport.components.NewExecutiveReportCommonContainer).toBeDefined()
  })
})

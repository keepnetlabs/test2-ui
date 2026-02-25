import ScheduledReports from '@/views/ScheduledReports.vue'

describe('ScheduledReports.vue', () => {
  it('has correct component name', () => {
    expect(ScheduledReports.name).toBe('ScheduledReports')
  })

  it('toggleShowScheduleReportDialog toggles state', () => {
    const ctx = { isShowScheduleReportDialog: false }
    ScheduledReports.methods.toggleShowScheduleReportDialog.call(ctx)
    expect(ctx.isShowScheduleReportDialog).toBe(true)
  })

  it('toggleShowScheduleReportDialog when closing resets edit state and selectedRow', () => {
    const ctx = {
      isShowScheduleReportDialog: true,
      selectedRow: { id: 1 },
      isEdit: true,
      isDuplicate: true,
      callForData: jest.fn()
    }
    ScheduledReports.methods.toggleShowScheduleReportDialog.call(ctx, null, true)
    expect(ctx.isShowScheduleReportDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
    expect(ctx.isEdit).toBe(false)
    expect(ctx.isDuplicate).toBe(false)
  })
})

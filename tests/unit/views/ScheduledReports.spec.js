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

  it('getStatusBadgeProps returns active/inactive badge by status', () => {
    expect(ScheduledReports.methods.getStatusBadgeProps.call({}, true)).toEqual(
      expect.objectContaining({ color: '#1173C1' })
    )
    expect(ScheduledReports.methods.getStatusBadgeProps.call({}, false)).toEqual(
      expect.objectContaining({ color: '#B83A3A' })
    )
  })

  it('toggle delete/activation dialogs call refresh when forceUpdate is true', () => {
    const callForData = jest.fn()
    const deleteCtx = {
      isShowDeleteDialog: false,
      selectedRow: null,
      callForData
    }
    ScheduledReports.methods.toggleShowDeleteDialog.call(deleteCtx, { id: 1 }, true)
    expect(deleteCtx.isShowDeleteDialog).toBe(true)
    expect(deleteCtx.selectedRow).toEqual({ id: 1 })
    expect(callForData).toHaveBeenCalledTimes(1)

    const activationCtx = {
      isShowActivationDialog: false,
      selectedRow: null,
      callForData
    }
    ScheduledReports.methods.toggleShowActivationDialog.call(activationCtx, { id: 2 }, true)
    expect(activationCtx.isShowActivationDialog).toBe(true)
    expect(activationCtx.selectedRow).toEqual({ id: 2 })
    expect(callForData).toHaveBeenCalledTimes(2)
  })
})

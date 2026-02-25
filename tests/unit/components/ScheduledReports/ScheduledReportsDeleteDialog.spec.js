jest.mock('@/api/reports', () => ({
  deleteReportScheduling: jest.fn(() => Promise.resolve())
}))

import ScheduledReportsDeleteDialog from '@/components/ScheduledReports/ScheduledReportsDeleteDialog.vue'

describe('ScheduledReportsDeleteDialog.vue', () => {
  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    ScheduledReportsDeleteDialog.methods.handleClose.call(ctx, false)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close', null, false)
  })

  it('handleClose with forceUpdate emits on-close with true', () => {
    const ctx = { $emit: jest.fn() }
    ScheduledReportsDeleteDialog.methods.handleClose.call(ctx, true)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close', null, true)
  })

  it('data returns isActionButtonDisabled', () => {
    const data = ScheduledReportsDeleteDialog.data()
    expect(data.isActionButtonDisabled).toBe(false)
  })
})

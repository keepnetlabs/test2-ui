jest.mock('@/api/awarenessEducator', () => ({
  examTrainingNonTargetUserTrainingDetails: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } } })
  )
}))

import TrainingReportNonTargetExumResultsDetails from '@/components/ScormProxyReport/ExamResults/TrainingReportNonTargetExumResultsDetails.vue'

describe('TrainingReportNonTargetExumResultsDetails.vue', () => {
  it('getStatusBadgeProps returns Passed for isPassed true', () => {
    const result = TrainingReportNonTargetExumResultsDetails.methods.getStatusBadgeProps.call({}, true)
    expect(result).toEqual({ color: '#217124', text: 'Passed' })
  })

  it('getStatusBadgeProps returns Failed for isPassed false', () => {
    const result = TrainingReportNonTargetExumResultsDetails.methods.getStatusBadgeProps.call({}, false)
    expect(result).toEqual({ color: '#B83A3A', text: 'Failed' })
  })

  it('getSubtitle returns targetUserResourceId', () => {
    const ctx = { item: { targetUserResourceId: 'u123' } }
    expect(TrainingReportNonTargetExumResultsDetails.computed.getSubtitle.call(ctx)).toBe('u123')
  })

  it('getMessage returns queue message for In Queue status', () => {
    const ctx = { item: { status: 'In Queue' } }
    expect(TrainingReportNonTargetExumResultsDetails.computed.getMessage.call(ctx)).toContain('queue')
  })

  it('isShowMessage returns true for Processing status', () => {
    const ctx = { item: { status: 'Processing' } }
    expect(TrainingReportNonTargetExumResultsDetails.computed.isShowMessage.call(ctx)).toBe(true)
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    TrainingReportNonTargetExumResultsDetails.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })
})

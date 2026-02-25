jest.mock('@/api/awarenessEducator', () => ({
  examTrainingNonTargetUserReportResults: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } } })
  )
}))

import TrainingReportNonTargetExamResults from '@/components/ScormProxyReport/ExamResults/TrainingReportNonTargetExamResults.vue'

describe('TrainingReportNonTargetExamResults.vue', () => {
  it('getStatusBadgeProps returns Passed for isPassed true', () => {
    const result = TrainingReportNonTargetExamResults.methods.getStatusBadgeProps.call({}, true)
    expect(result).toEqual({ color: '#217124', text: 'Passed' })
  })

  it('handleInteractions sets selectedRow and toggles modal', () => {
    const row = { targetUserResourceId: 'u1' }
    const toggleIsShowInteractionsModal = jest.fn()
    const ctx = { selectedRow: null, toggleIsShowInteractionsModal }
    TrainingReportNonTargetExamResults.methods.handleInteractions.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(toggleIsShowInteractionsModal).toHaveBeenCalled()
  })

  it('toggleIsShowInteractionsModal toggles isShowInteractionsModal', () => {
    const ctx = { isShowInteractionsModal: false }
    TrainingReportNonTargetExamResults.methods.toggleIsShowInteractionsModal.call(ctx)
    expect(ctx.isShowInteractionsModal).toBe(true)
    TrainingReportNonTargetExamResults.methods.toggleIsShowInteractionsModal.call(ctx)
    expect(ctx.isShowInteractionsModal).toBe(false)
  })
})

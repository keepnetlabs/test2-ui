jest.mock('@/api/awarenessEducator', () => ({
  getTrainingReportNonTargetUsers: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  exportTrainingReportNonTargetUsers: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

const createObjectURL = jest.fn(() => 'blob:mock')
beforeAll(() => {
  window.URL.createObjectURL = createObjectURL
})

import TrainingReportUsersNonTargetUsers from '@/components/ScormProxyReport/Users/TrainingReportUsersNonTargetUsers.vue'

describe('TrainingReportUsersNonTargetUsers.vue', () => {
  it('handleInteractions sets selectedRow and toggles modal', () => {
    const toggleSpy = jest.fn()
    const ctx = {
      selectedRow: null,
      isShowInteractionsModal: false,
      toggleIsShowInteractionsModal: toggleSpy
    }
    const row = { resourceId: 'u1' }
    TrainingReportUsersNonTargetUsers.methods.handleInteractions.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(toggleSpy).toHaveBeenCalled()
  })

  it('toggleIsShowInteractionsModal toggles visibility', () => {
    const ctx = { isShowInteractionsModal: false }
    TrainingReportUsersNonTargetUsers.methods.toggleIsShowInteractionsModal.call(ctx)
    expect(ctx.isShowInteractionsModal).toBe(true)
    TrainingReportUsersNonTargetUsers.methods.toggleIsShowInteractionsModal.call(ctx)
    expect(ctx.isShowInteractionsModal).toBe(false)
  })
})

jest.mock('@/api/vishing', () => ({
  getVishingReportUsers: jest.fn(() =>
    Promise.resolve({
      data: {
        data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 },
        pageNumber: 1,
        totalNumberOfRecords: 0,
        totalNumberOfPages: 0
      }
    })
  ),
  exportVishingUsers: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

const createObjectURL = jest.fn(() => 'blob:mock')
beforeAll(() => {
  window.URL.createObjectURL = createObjectURL
})

import SmishingReportUsers from '@/components/SmishingReport/SmishingReportUsers.vue'

describe('SmishingReportUsers.vue', () => {
  it('getErrorMessage returns errorMessage when CallingError', () => {
    const ctx = {}
    expect(
      SmishingReportUsers.methods.getErrorMessage.call(ctx, {
        status: 'CallingError',
        errorMessage: 'Connection failed'
      })
    ).toBe('Connection failed')
  })

  it('getErrorMessage returns empty when not CallingError', () => {
    const ctx = {}
    expect(SmishingReportUsers.methods.getErrorMessage.call(ctx, { status: 'Answered' })).toBe('')
  })

  it('getErrorMessage returns empty string when CallingError but no errorMessage', () => {
    const ctx = {}
    expect(
      SmishingReportUsers.methods.getErrorMessage.call(ctx, { status: 'CallingError' })
    ).toBe('')
  })

  it('toggleIsShowInteractionsModal does not clear selectedRow when opening', () => {
    const ctx = {
      selectedRow: { resourceId: 'u1' },
      isShowInteractionsModal: false
    }
    SmishingReportUsers.methods.toggleIsShowInteractionsModal.call(ctx)
    expect(ctx.selectedRow).toEqual({ resourceId: 'u1' })
    expect(ctx.isShowInteractionsModal).toBe(true)
  })

  it('handleInteractions sets selectedRow and toggles modal', () => {
    const ctx = {
      selectedRow: null,
      isShowInteractionsModal: false,
      toggleIsShowInteractionsModal: jest.fn()
    }
    const row = { resourceId: 'u1' }
    SmishingReportUsers.methods.handleInteractions.call(ctx, row)
    expect(ctx.selectedRow).toBe(row)
    expect(ctx.toggleIsShowInteractionsModal).toHaveBeenCalled()
  })

  it('toggleIsShowInteractionsModal clears selectedRow when closing', () => {
    const ctx = {
      selectedRow: { resourceId: 'u1' },
      isShowInteractionsModal: true
    }
    SmishingReportUsers.methods.toggleIsShowInteractionsModal.call(ctx)
    expect(ctx.selectedRow).toBeNull()
    expect(ctx.isShowInteractionsModal).toBe(false)
  })
})

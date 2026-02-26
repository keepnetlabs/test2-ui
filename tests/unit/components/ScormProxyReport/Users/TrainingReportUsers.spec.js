jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchTrainingReportUsers: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ targetUserResourceId: 'u1', examStatusName: 'Passed' }],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    ),
    resendTrainingToUserList: jest.fn(() => Promise.resolve()),
    exportTrainingReportUsers: jest.fn(() => Promise.resolve({ data: 'file' }))
  }
}))

jest.mock('@/components/AwarenessEducator/TrainingReport/utils', () => ({
  __esModule: true,
  getStatusBadgeProps: jest.fn((status) => ({ text: status }))
}))

import TrainingReportUsers from '@/components/ScormProxyReport/Users/TrainingReportUsers.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('ScormProxy TrainingReportUsers.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('watch isScormProxy removes resend action when true', () => {
    const ctx = {
      isSurvey: false,
      tableOptions: {
        rowActions: [
          { name: 'Resend Training' },
          { name: 'Details' }
        ]
      }
    }
    TrainingReportUsers.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('handleOnResend prepares payload for array items', () => {
    const ctx = {
      axiosPayload: { filter: { status: 'x' } },
      isShowResendDialog: false
    }
    ctx.toggleIsShowResendDialog = TrainingReportUsers.methods.toggleIsShowResendDialog

    TrainingReportUsers.methods.handleOnResend.call(
      ctx,
      [{ targetUserResourceId: 'u1' }, { targetUserResourceId: 'u2' }],
      ['u3'],
      true
    )

    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u1', 'u2'],
      excludedItems: ['u3'],
      selectAll: true,
      filter: { status: 'x' }
    })
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('callForData maps examStatus and updates pagination', async () => {
    const ctx = {
      id: 'id-1',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    TrainingReportUsers.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.searchTrainingReportUsers).toHaveBeenCalledWith(
      ctx.axiosPayload,
      'id-1'
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].examStatus).toBe('Passed')
  })

  it('resendItem disables action button, calls API and resets states', async () => {
    const ctx = {
      id: 'id-1',
      resendPayload: { selectedItems: ['u1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      toggleIsShowResendDialog: jest.fn(),
      $refs: { refTable: { callForData: jest.fn() } }
    }

    TrainingReportUsers.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.resendTrainingToUserList).toHaveBeenCalledWith(
      { selectedItems: ['u1'] },
      'id-1'
    )
    expect(ctx.$refs.refTable.callForData).toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('exportTrainingReportUsersTable maps XLS to Excel and triggers download', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({ click })
    global.URL.createObjectURL = jest.fn(() => 'blob:mock')

    const ctx = {
      id: 'id-1',
      isSurvey: false,
      axiosPayload: { orderBy: 'email', ascending: true, filter: { q: 1 } }
    }

    TrainingReportUsers.methods.exportTrainingReportUsersTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })

    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.exportTrainingReportUsers).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'id-1'
    )
    expect(AwarenessEducatorService.exportTrainingReportUsers).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV' }),
      'id-1'
    )
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
  })
})

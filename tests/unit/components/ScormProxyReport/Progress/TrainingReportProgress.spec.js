import AwarenessEducatorService from '@/api/awarenessEducator'
import { getTrainingReportProgressStatusBadgeProps } from '@/components/AwarenessEducator/TrainingReport/Progress/utils'
import TrainingReportProgress from '@/components/ScormProxyReport/Progress/TrainingReportProgress.vue'

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    progressTrainingReportEmails: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    exportProgressTrainingReportEmails: jest.fn(() => Promise.resolve({ data: {} })),
    resendTrainingToProgressList: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/components/AwarenessEducator/TrainingReport/Progress/utils', () => ({
  __esModule: true,
  getTrainingReportProgressStatusBadgeProps: jest.fn(() => ({ color: '#2196f3' }))
}))

describe('ScormProxyReport TrainingReportProgress.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(TrainingReportProgress.name).toBe('TrainingReportClickedTrainingLink')
  })

  it('watch isScormProxy removes resend action when enabled', () => {
    const ctx = {
      isSurvey: false,
      tableOptions: { rowActions: [{ name: 'Resend Training' }, { name: 'Details' }] }
    }
    TrainingReportProgress.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('handleOnResend builds payload and opens resend dialog', () => {
    const ctx = {
      axiosPayload: { filter: { Condition: 'AND' } },
      resendPayload: null,
      toggleIsShowResendDialog: jest.fn()
    }
    TrainingReportProgress.methods.handleOnResend.call(
      ctx,
      [{ targetUserResourceId: 'u1' }],
      ['e1'],
      true
    )
    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u1'],
      excludedItems: ['e1'],
      selectAll: true,
      filter: { Condition: 'AND' }
    })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('resendItem calls api and resets states', async () => {
    const ctx = {
      id: 'enr-1',
      resendPayload: { selectedItems: ['u1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      $refs: { refTable: { callForData: jest.fn() } },
      toggleIsShowResendDialog: jest.fn()
    }
    TrainingReportProgress.methods.resendItem.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(AwarenessEducatorService.resendTrainingToProgressList).toHaveBeenCalledWith(
      { selectedItems: ['u1'] },
      'enr-1'
    )
    expect(ctx.$refs.refTable.callForData).toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
  })

  it('callForData maps table and pagination response', async () => {
    AwarenessEducatorService.progressTrainingReportEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ email: 'a@b.com' }],
          totalNumberOfRecords: 4,
          totalNumberOfPages: 2,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      setLoading: jest.fn(),
      axiosPayload: {},
      id: 'enr-2',
      serverSideProps: {},
      tableData: []
    }
    TrainingReportProgress.methods.callForData.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(4)
    expect(ctx.tableData).toEqual([{ email: 'a@b.com' }])
  })

  it('export maps XLS and triggers browser clicks', async () => {
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })
    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test')

    const ctx = {
      id: 'enr-3',
      isSurvey: false,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportProgress.methods.exportTrainingProgressEmailTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 20,
      reportAllPages: false
    })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(AwarenessEducatorService.exportProgressTrainingReportEmails).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' }),
      'enr-3'
    )
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('details and resend toggles clear selected row where expected', () => {
    const ctx = {
      selectedRow: null,
      isShowDetailsModal: false,
      isShowResendDialog: false,
      toggleIsShowDetailsModal: TrainingReportProgress.methods.toggleIsShowDetailsModal
    }
    TrainingReportProgress.methods.handleDetails.call(ctx, { resourceId: 'r1' })
    expect(ctx.selectedRow).toEqual({ resourceId: 'r1' })
    expect(ctx.isShowDetailsModal).toBe(true)
    TrainingReportProgress.methods.toggleIsShowDetailsModal.call(ctx)
    expect(ctx.selectedRow).toBeNull()
    expect(ctx.isShowDetailsModal).toBe(false)

    TrainingReportProgress.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('progress badge util method is exposed through methods', () => {
    const fn = TrainingReportProgress.methods.getTrainingReportProgressStatusBadgeProps
    expect(fn).toBe(getTrainingReportProgressStatusBadgeProps)
    expect(fn('Completed')).toEqual({ color: '#2196f3' })
  })
})

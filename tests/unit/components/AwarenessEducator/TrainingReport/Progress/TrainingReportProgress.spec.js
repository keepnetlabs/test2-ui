jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    progressTrainingReportEmails: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [
              {
                targetUserResourceId: 'u1',
                examStatusName: 'In Progress',
                customFieldValues: [{ name: 'Office', value: 'TR' }]
              }
            ],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    ),
    resendTrainingToProgressList: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customOffice' }])
}))

import TrainingReportProgress from '@/components/AwarenessEducator/TrainingReport/Progress/TrainingReportProgress.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportProgress.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name from source', () => {
    expect(TrainingReportProgress.name).toBe('TrainingReportClickedTrainingLink')
  })

  it('watch customFields appends generated columns', () => {
    const ctx = { tableOptions: { columns: [{ property: 'email' }, { property: 'department' }] } }
    TrainingReportProgress.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns[2].property).toBe('customOffice')
  })

  it('handleOnResend prepares payload and toggles dialog', () => {
    const ctx = {
      axiosPayload: { filter: { q: 'x' } },
      isShowResendDialog: false
    }
    ctx.toggleIsShowResendDialog = TrainingReportProgress.methods.toggleIsShowResendDialog
    TrainingReportProgress.methods.handleOnResend.call(ctx, { targetUserResourceId: 'u1' })
    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u1'],
      excludedItems: [],
      selectAll: false,
      filter: { q: 'x' }
    })
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('callForData maps response and custom field values', async () => {
    const ctx = {
      id: 'p1',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportProgress.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.progressTrainingReportEmails).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].Office).toBe('TR')
  })

  it('resendItem calls API and resets dialog flags', async () => {
    const ctx = {
      id: 'p1',
      resendPayload: { selectedItems: ['u1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      callForData: jest.fn(),
      toggleIsShowResendDialog: jest.fn(),
      $refs: { refTable: { resetSelectableParams: jest.fn() } }
    }

    TrainingReportProgress.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.resendTrainingToProgressList).toHaveBeenCalledWith(
      ctx.resendPayload,
      'p1'
    )
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.isResendActionButtonDisabled).toBe(false)
  })
})

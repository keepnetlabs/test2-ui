jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    openedTrainingReportEmails: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [{ targetUserResourceId: 'u1', customFieldValues: [{ name: 'Office', value: 'TR' }] }],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
    ),
    resendTrainingToOpenedEmailList: jest.fn(() => Promise.resolve()),
    exportOpenedTrainingReportEmails: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customOffice' }])
}))

import TrainingReportOpenedTrainingEmail from '@/components/AwarenessEducator/TrainingReport/OpenedTrainingEmail/TrainingReportOpenedTrainingEmail.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportOpenedTrainingEmail.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingReportOpenedTrainingEmail.name).toBe('TrainingReportOpenedTrainingEmail')
  })

  it('watch customFields appends generated columns', () => {
    const ctx = { tableOptions: { columns: [{ property: 'email' }, { property: 'department' }] } }
    TrainingReportOpenedTrainingEmail.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns[2].property).toBe('customOffice')
  })

  it('handleOnResend prepares payload and toggles modal', () => {
    const ctx = {
      axiosPayload: { filter: {} },
      resendPayload: null,
      isShowResendDialog: false
    }
    ctx.toggleIsShowResendDialog = TrainingReportOpenedTrainingEmail.methods.toggleIsShowResendDialog
    TrainingReportOpenedTrainingEmail.methods.handleOnResend.call(ctx, { targetUserResourceId: 'u1' })
    expect(ctx.resendPayload.selectedItems).toEqual(['u1'])
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('callForData maps custom fields and updates server props', async () => {
    const ctx = {
      id: 't1',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportOpenedTrainingEmail.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.tableData[0].Office).toBe('TR')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
  })

  it('resendItem calls API and resets state', async () => {
    const ctx = {
      id: 't1',
      resendPayload: { selectedItems: ['u1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      callForData: jest.fn(),
      toggleIsShowResendDialog: jest.fn(),
      $refs: { refTable: { resetSelectableParams: jest.fn() } }
    }
    TrainingReportOpenedTrainingEmail.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(AwarenessEducatorService.resendTrainingToOpenedEmailList).toHaveBeenCalledWith(
      ctx.resendPayload,
      't1'
    )
    expect(ctx.isShowResendDialog).toBe(false)
  })
})

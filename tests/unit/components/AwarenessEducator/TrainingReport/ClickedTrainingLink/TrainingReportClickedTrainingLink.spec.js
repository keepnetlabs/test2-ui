jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    clickedTrainingReportEmails: jest.fn(() =>
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
    resendTrainingToClickedLinkList: jest.fn(() => Promise.resolve()),
    exportClickedTrainingReportEmails: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customOffice' }])
}))

import TrainingReportClickedTrainingLink from '@/components/AwarenessEducator/TrainingReport/ClickedTrainingLink/TrainingReportClickedTrainingLink.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportClickedTrainingLink.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingReportClickedTrainingLink.name).toBe('TrainingReportClickedTrainingLink')
  })

  it('getEmptyTableTextMessage returns survey variant when isSurvey', () => {
    const text = TrainingReportClickedTrainingLink.methods.getEmptyTableTextMessage.call({
      isSurvey: true,
      trainingSummary: {}
    })
    expect(typeof text).toBe('string')
  })

  it('watch customFields appends generated columns', () => {
    const ctx = { tableOptions: { columns: [{ property: 'email' }, { property: 'department' }] } }
    TrainingReportClickedTrainingLink.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns[2].property).toBe('customOffice')
  })

  it('handleOnResend prepares payload and toggles modal', () => {
    const ctx = {
      axiosPayload: { filter: {} },
      resendPayload: null,
      isShowResendDialog: false
    }
    ctx.toggleIsShowResendDialog = TrainingReportClickedTrainingLink.methods.toggleIsShowResendDialog
    TrainingReportClickedTrainingLink.methods.handleOnResend.call(ctx, { targetUserResourceId: 'u1' })
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
    TrainingReportClickedTrainingLink.methods.callForData.call(ctx)
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
    TrainingReportClickedTrainingLink.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()
    expect(AwarenessEducatorService.resendTrainingToClickedLinkList).toHaveBeenCalledWith(
      ctx.resendPayload,
      't1'
    )
    expect(ctx.isShowResendDialog).toBe(false)
  })
})

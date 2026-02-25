jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchTrainingReportUsers: jest.fn(() =>
      Promise.resolve({
        data: {
          data: {
            results: [
              {
                targetUserResourceId: 'u1',
                examStatusName: 'Passed',
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
    resendTrainingToUserList: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customOffice' }])
}))

jest.mock('@/components/AwarenessEducator/TrainingReport/utils', () => ({
  __esModule: true,
  getStatusBadgeProps: jest.fn((status) => ({ text: status }))
}))

import TrainingReportUsers from '@/components/AwarenessEducator/TrainingReport/Users/TrainingReportUsers.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportUsers.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingReportUsers.name).toBe('TrainingReportUsers')
  })

  it('computed resend title/body reflect survey mode', () => {
    const surveyCtx = { isSurvey: true, trainingSummary: {} }
    expect(TrainingReportUsers.computed.getResendDialogTitle.call(surveyCtx)).toBeDefined()
    expect(TrainingReportUsers.computed.getBodyTrainingType.call(surveyCtx)).toBe('survey')
  })

  it('watch customFields appends generated columns', () => {
    const ctx = { tableOptions: { columns: [{ property: 'email' }, { property: 'department' }] } }
    TrainingReportUsers.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns[2].property).toBe('customOffice')
  })

  it('handleOnResend prepares payload and toggles dialog', () => {
    const ctx = {
      axiosPayload: { filter: { x: 1 } },
      isShowResendDialog: false
    }
    ctx.toggleIsShowResendDialog = TrainingReportUsers.methods.toggleIsShowResendDialog
    TrainingReportUsers.methods.handleOnResend.call(ctx, { targetUserResourceId: 'u1' })
    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u1'],
      excludedItems: [],
      selectAll: false,
      filter: { x: 1 }
    })
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('callForData maps response and custom fields', async () => {
    const ctx = {
      id: 'tr1',
      isAddTrainingTypeKeyToPayload: false,
      trainingSummary: { trainingTypeName: 'Training' },
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    TrainingReportUsers.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.searchTrainingReportUsers).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].Office).toBe('TR')
    expect(ctx.tableData[0].examStatus).toBe('Passed')
  })

  it('resendItem calls API and resets state', async () => {
    const ctx = {
      id: 'tr1',
      resendPayload: { selectedItems: ['u1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      callForData: jest.fn(),
      toggleIsShowResendDialog: jest.fn(),
      $refs: { refTable: { resetSelectableParams: jest.fn() } }
    }

    TrainingReportUsers.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.resendTrainingToUserList).toHaveBeenCalledWith(
      ctx.resendPayload,
      'tr1'
    )
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.isResendActionButtonDisabled).toBe(false)
  })
})

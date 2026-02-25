jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    examTrainingReportResults: jest.fn(() =>
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
    resendTrainingToExamResultList: jest.fn(() => Promise.resolve())
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customOffice' }])
}))

import TrainingReportExamResults from '@/components/AwarenessEducator/TrainingReport/ExamResults/TrainingReportExamResults.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportExamResults.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has correct component name', () => {
    expect(TrainingReportExamResults.name).toBe('TrainingReportExamResults')
  })

  it('watch customFields appends generated columns', () => {
    const ctx = { tableOptions: { columns: [{ property: 'email' }, { property: 'department' }] } }
    TrainingReportExamResults.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns[2].property).toBe('customOffice')
  })

  it('handleOnResend prepares payload and toggles dialog', () => {
    const ctx = {
      axiosPayload: { filter: { x: 1 } },
      isShowResendDialog: false
    }
    ctx.toggleIsShowResendDialog = TrainingReportExamResults.methods.toggleIsShowResendDialog
    TrainingReportExamResults.methods.handleOnResend.call(ctx, { targetUserResourceId: 'u1' })
    expect(ctx.resendPayload).toEqual({
      selectedItems: ['u1'],
      excludedItems: [],
      selectAll: false,
      filter: { x: 1 }
    })
    expect(ctx.isShowResendDialog).toBe(true)
  })

  it('callForData maps response and exam status', async () => {
    const ctx = {
      id: 'e1',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportExamResults.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.examTrainingReportResults).toHaveBeenCalled()
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.tableData[0].Office).toBe('TR')
    expect(ctx.tableData[0].examStatus).toBe('Passed')
  })

  it('resendItem calls API and resets dialog flags', async () => {
    const ctx = {
      id: 'e1',
      resendPayload: { selectedItems: ['u1'] },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      callForData: jest.fn(),
      toggleIsShowResendDialog: jest.fn(),
      $refs: { refTable: { resetSelectableParams: jest.fn() } }
    }

    TrainingReportExamResults.methods.resendItem.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.resendTrainingToExamResultList).toHaveBeenCalledWith(
      ctx.resendPayload,
      'e1'
    )
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.isResendActionButtonDisabled).toBe(false)
  })
})

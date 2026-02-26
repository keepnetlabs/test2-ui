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
    resendTrainingToProgressList: jest.fn(() => Promise.resolve()),
    exportProgressTrainingReportEmails: jest.fn(() => Promise.resolve({ data: 'blob-data' }))
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customOffice' }])
}))

import TrainingReportProgress from '@/components/AwarenessEducator/TrainingReport/Progress/TrainingReportProgress.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

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

  it('computed resend dialog title/body cover survey/infographic/default', () => {
    expect(
      TrainingReportProgress.computed.getResendDialogTitle.call({
        isSurvey: true,
        trainingSummary: {}
      })
    ).toBe(labels.ResendSurvey)
    expect(
      TrainingReportProgress.computed.getResendDialogTitle.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toBe(labels.ResendInfographic)
    expect(
      TrainingReportProgress.computed.getBodyTrainingType.call({
        isSurvey: false,
        trainingSummary: {}
      })
    ).toBe(labels.Training.toLowerCase())
  })

  it('watch isScormProxy removes resend action for current survey state', () => {
    const ctx = {
      isSurvey: false,
      tableOptions: { rowActions: [{ name: 'Resend Training' }, { name: 'Details' }] }
    }
    TrainingReportProgress.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('toggleIsShowResendDialog and toggleIsShowDetailsModal clear selectedRow on close', () => {
    const ctx = { isShowResendDialog: false, isShowDetailsModal: false, selectedRow: { id: 1 } }
    TrainingReportProgress.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    TrainingReportProgress.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()

    ctx.selectedRow = { id: 2 }
    TrainingReportProgress.methods.toggleIsShowDetailsModal.call(ctx)
    expect(ctx.isShowDetailsModal).toBe(true)
    TrainingReportProgress.methods.toggleIsShowDetailsModal.call(ctx)
    expect(ctx.isShowDetailsModal).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('handleDetails and handleResend set selected row and open dialogs', () => {
    const ctx = {
      selectedRow: null,
      toggleIsShowDetailsModal: jest.fn(),
      toggleIsShowResendDialog: jest.fn()
    }
    TrainingReportProgress.methods.handleDetails.call(ctx, { id: 'd1' })
    expect(ctx.selectedRow).toEqual({ id: 'd1' })
    expect(ctx.toggleIsShowDetailsModal).toHaveBeenCalled()

    TrainingReportProgress.methods.handleResend.call(ctx, { id: 'r1' })
    expect(ctx.selectedRow).toEqual({ id: 'r1' })
    expect(ctx.toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('exportTrainingProgressEmailTable maps XLS to Excel and triggers download', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      set href(v) {},
      set download(v) {},
      click
    })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:1')
    const ctx = {
      id: 'p1',
      isSurvey: false,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportProgress.methods.exportTrainingProgressEmailTable.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: true
    })
    await Promise.resolve()
    expect(AwarenessEducatorService.exportProgressTrainingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'p1'
    )
    expect(click).toHaveBeenCalled()
    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})

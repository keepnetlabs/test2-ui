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
import labels from '@/model/constants/labels'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '@/components/TrainingLibrary/TrainingLibraryFirstCard/utils'

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

  it('watch customFields does not append when department index is 0', () => {
    const ctx = { tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] } }
    TrainingReportOpenedTrainingEmail.watch.customFields.handler.call(ctx, [{ name: 'Office' }])
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
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

  it('callForData maps examStatus fallback from examStatusName', async () => {
    AwarenessEducatorService.openedTrainingReportEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ targetUserResourceId: 'u2', examStatus: '', examStatusName: 'Passed' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
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

    expect(ctx.tableData[0].examStatus).toBe('Passed')
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

  it('computed header/resend/body branches cover survey/infographic/default', () => {
    expect(
      TrainingReportOpenedTrainingEmail.computed.getHeaderTitle.call({
        isSurvey: true,
        trainingSummary: {}
      })
    ).toContain('survey')
    expect(
      TrainingReportOpenedTrainingEmail.computed.getHeaderSubtitle.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toContain('infographic')
    expect(
      TrainingReportOpenedTrainingEmail.computed.getResendDialogTitle.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC }
      })
    ).toBe(labels.ResendInfographic)
    expect(
      TrainingReportOpenedTrainingEmail.computed.getBodyTrainingType.call({
        isSurvey: false,
        trainingSummary: {}
      })
    ).toBe(labels.Training.toLowerCase())
  })

  it('watch isScormProxy removes resend action', () => {
    const ctx = {
      tableOptions: { rowActions: [{ name: 'Resend Training' }, { name: 'Details' }] }
    }
    TrainingReportOpenedTrainingEmail.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('watch isScormProxy keeps rowActions unchanged when false', () => {
    const original = [{ name: 'Resend Training' }, { name: 'Details' }]
    const ctx = {
      tableOptions: { rowActions: [...original] }
    }
    TrainingReportOpenedTrainingEmail.watch.isScormProxy.handler.call(ctx, false)
    expect(ctx.tableOptions.rowActions).toEqual(original)
  })

  it('handleSearchChange removes custom field filters and triggers refresh', () => {
    const ctx = {
      customFields: [{ name: 'Office' }],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber: jest.fn(),
      callForData: jest.fn()
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [{ FieldName: 'Office' }, { FieldName: 'email' }]
          }
        ]
      }
    }

    TrainingReportOpenedTrainingEmail.methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([{ FieldName: 'email' }])
    expect(ctx.resetPageNumber).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('handleOnDetail sets selectedRow and toggles details modal', () => {
    const ctx = {
      selectedRow: null,
      toggleIsShowDetailsModal: jest.fn()
    }
    const row = { targetUserResourceId: 'u1' }
    TrainingReportOpenedTrainingEmail.methods.handleOnDetail.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(ctx.toggleIsShowDetailsModal).toHaveBeenCalled()
  })

  it('toggleIsShowResendDialog clears selectedRow when closing', () => {
    const ctx = { isShowResendDialog: false, selectedRow: { id: 1 } }
    TrainingReportOpenedTrainingEmail.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    TrainingReportOpenedTrainingEmail.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('computed title/subtitle/body branches cover poster path', () => {
    const ctx = {
      isSurvey: false,
      trainingSummary: { trainingTypeName: TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER }
    }
    expect(TrainingReportOpenedTrainingEmail.computed.getHeaderTitle.call(ctx)).toContain('poster')
    expect(TrainingReportOpenedTrainingEmail.computed.getHeaderSubtitle.call(ctx)).toContain('poster')
    expect(TrainingReportOpenedTrainingEmail.computed.getBodyTrainingType.call(ctx)).toBe(
      labels.Poster.toLowerCase()
    )
  })

  it('toggleIsShowDetailsModal clears selectedRow on close', () => {
    const ctx = { isShowDetailsModal: false, selectedRow: { id: 1 } }
    TrainingReportOpenedTrainingEmail.methods.toggleIsShowDetailsModal.call(ctx)
    expect(ctx.isShowDetailsModal).toBe(true)
    TrainingReportOpenedTrainingEmail.methods.toggleIsShowDetailsModal.call(ctx)
    expect(ctx.isShowDetailsModal).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('exportTrainingReportOpenedTrainingEmailTable maps xls extension and survey prefix', async () => {
    const click = jest.fn()
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      set href(v) {},
      set download(v) {},
      click
    })
    const originalCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:1')
    const ctx = {
      id: 't1',
      isSurvey: true,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }

    TrainingReportOpenedTrainingEmail.methods.exportTrainingReportOpenedTrainingEmailTable.call(
      ctx,
      {
        exportTypes: ['XLS'],
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: false
      }
    )
    await Promise.resolve()
    expect(AwarenessEducatorService.exportOpenedTrainingReportEmails).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      't1'
    )
    expect(click).toHaveBeenCalled()
    createElementSpy.mockRestore()
    globalThis.URL.createObjectURL = originalCreateObjectURL
  })
})

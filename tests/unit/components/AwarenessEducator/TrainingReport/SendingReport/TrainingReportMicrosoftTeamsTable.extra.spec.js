jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchMicrosoftTeamsSendingReportEmails: jest.fn(),
    resendMicrosoftTeamsSendingReportEmails: jest.fn(),
    exportSendingReport: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      orderBy: 'email',
      ascending: true,
      filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] }
    })),
    getBtnStatusColor: jest.fn(() => '#55a')
  }
})

jest.mock('@/utils/helperFunctions', () => ({
  createCustomFieldColumns: jest.fn(() => [{ property: 'cf1' }])
}))

import TrainingReportMicrosoftTeamsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportMicrosoftTeamsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getBtnStatusColor } from '@/utils/functions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReportMicrosoftTeamsTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleSearchChange filters custom fields and triggers reset/fetch', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      customFields: [{ name: 'cf1' }],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }
    TrainingReportMicrosoftTeamsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          { FilterItems: [{ FieldName: 'email' }, { FieldName: 'cf1' }] }
        ]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([{ FieldName: 'email' }])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('handleSearchChange keeps filters when customFields is missing', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      customFields: undefined,
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }
    TrainingReportMicrosoftTeamsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'email' }] }]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([{ FieldName: 'email' }])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('toggleIsShowResendDialog toggles and clears selected row on close', () => {
    const ctx = { isShowResendDialog: false, selectedRow: { id: 1 } }
    TrainingReportMicrosoftTeamsTable.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(true)
    expect(ctx.selectedRow).toEqual({ id: 1 })
    TrainingReportMicrosoftTeamsTable.methods.toggleIsShowResendDialog.call(ctx)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('resendItem handles array and single selectedRow branches', async () => {
    AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails.mockResolvedValue({})
    const resetSelectableParams = jest.fn()

    const arrayCtx = {
      selectedRow: [{ id: 'a1' }, { id: 'a2' }],
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      $refs: { refTable: { resetSelectableParams } },
      callForData: jest.fn()
    }
    TrainingReportMicrosoftTeamsTable.methods.resendItem.call(arrayCtx)
    await flushPromises()
    expect(AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails).toHaveBeenCalledTimes(2)
    expect(arrayCtx.callForData).toHaveBeenCalled()
    expect(arrayCtx.isResendActionButtonDisabled).toBe(false)
    expect(arrayCtx.isShowResendDialog).toBe(false)
    expect(arrayCtx.selectedRow).toBeNull()

    AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails.mockClear()
    const singleCtx = {
      selectedRow: { id: 's1' },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      $refs: { refTable: { resetSelectableParams: jest.fn() } },
      callForData: jest.fn()
    }
    TrainingReportMicrosoftTeamsTable.methods.resendItem.call(singleCtx)
    await flushPromises()
    expect(AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails).toHaveBeenCalledWith({
      notificationActivityLogId: 's1'
    })
    expect(singleCtx.callForData).toHaveBeenCalled()
  })

  it('callForData maps custom fields and export maps xls extension', async () => {
    AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'cfA', value: 'x' }] }],
          totalNumberOfRecords: 2,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:teams')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      id: 'r-1',
      bodyTrainingType: 'training',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportMicrosoftTeamsTable.methods.callForData.call(ctx)
    await flushPromises()
    expect(AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails).toHaveBeenCalledWith(
      ctx.axiosPayload,
      'r-1'
    )
    expect(ctx.tableData[0].cfA).toBe('x')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(2)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.setLoading).toHaveBeenCalledWith(true)

    TrainingReportMicrosoftTeamsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(link.download).toBe('training-Sending-Report-Enrollment-Emails.xlsx')

    globalThis.URL.createObjectURL = oldURL
    document.createElement = oldCreateElement
  })

  it('watchers and helpers cover branch paths', () => {
    const watchCtx = {
      tableOptions: {
        columns: [{ property: 'department' }, { property: 'email' }],
        rowActions: [{ name: 'Resend training' }]
      },
      bodyTrainingType: 'training'
    }
    TrainingReportMicrosoftTeamsTable.watch.customFields.handler.call(watchCtx, [{ name: 'x' }])
    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'x' }], false)
    expect(watchCtx.tableOptions.columns.map((x) => x.property)).toEqual([
      'department',
      'email'
    ])

    const watchCtx2 = {
      tableOptions: {
        columns: [{ property: 'firstName' }, { property: 'department' }, { property: 'email' }],
        rowActions: [{ name: 'Resend training' }]
      },
      bodyTrainingType: 'training'
    }
    TrainingReportMicrosoftTeamsTable.watch.customFields.handler.call(watchCtx2, [{ name: 'x' }])
    expect(watchCtx2.tableOptions.columns.map((x) => x.property)).toEqual([
      'firstName',
      'department',
      'cf1',
      'email'
    ])

    TrainingReportMicrosoftTeamsTable.watch.isScormProxy.handler.call(watchCtx2, true)
    expect(watchCtx2.tableOptions.rowActions).toEqual([])

    expect(TrainingReportMicrosoftTeamsTable.methods.getBtnStatusColor('ok')).toBe('#55a')
    expect(getBtnStatusColor).toHaveBeenCalledWith('ok')
    expect(TrainingReportMicrosoftTeamsTable.methods.getEmptyTableTextMessage.call({})).toContain(
      'Microsoft Teams'
    )
  })

  it('handleOnResend/handleSelectionChange/mounted branches are covered', () => {
    const toggleIsShowResendDialog = jest.fn()
    const emit = jest.fn()
    const ctx = {
      selectedRow: null,
      toggleIsShowResendDialog,
      $emit: emit
    }
    TrainingReportMicrosoftTeamsTable.methods.handleOnResend.call(ctx, [{ id: 'x' }])
    expect(ctx.selectedRow).toEqual([{ id: 'x' }])
    expect(toggleIsShowResendDialog).toHaveBeenCalled()

    TrainingReportMicrosoftTeamsTable.methods.handleSelectionChange.call(ctx, 6)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 6)

    const callForData = jest.fn()
    TrainingReportMicrosoftTeamsTable.mounted.call({
      callForData,
      $nextTick: (cb) => cb()
    })
    expect(callForData).toHaveBeenCalled()
  })

  it('isScormProxy watcher keeps rowActions unchanged when false', () => {
    const ctx = {
      tableOptions: { rowActions: [{ name: 'Resend training' }] },
      bodyTrainingType: 'training'
    }
    TrainingReportMicrosoftTeamsTable.watch.isScormProxy.handler.call(ctx, false)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Resend training' }])
  })

  it('isScormProxy watcher keeps actions when resend label does not match', () => {
    const ctx = {
      tableOptions: { rowActions: [{ name: 'Details' }] },
      bodyTrainingType: 'training'
    }
    TrainingReportMicrosoftTeamsTable.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('customFields watcher inserts generated columns when department is missing', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'email' }, { property: 'firstName' }]
      }
    }
    TrainingReportMicrosoftTeamsTable.watch.customFields.handler.call(ctx, [{ name: 'cfX' }])
    expect(ctx.tableOptions.columns.map((x) => x.property)).toEqual(['cf1', 'email', 'firstName'])
  })

  it('resend/export keep working without refTable and with non-xls export type', async () => {
    AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails.mockResolvedValueOnce({})
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:csv')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const resendCtx = {
      selectedRow: { id: 'single' },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      $refs: {},
      callForData: jest.fn()
    }
    TrainingReportMicrosoftTeamsTable.methods.resendItem.call(resendCtx)
    await flushPromises()
    expect(resendCtx.callForData).toHaveBeenCalled()
    expect(resendCtx.selectedRow).toBeNull()

    const exportCtx = {
      id: 'r-csv',
      bodyTrainingType: 'training',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportMicrosoftTeamsTable.methods.exportTrainingReportSendingReportTable.call(exportCtx, {
      exportTypes: ['CSV'],
      pageNumber: 2,
      pageSize: 25,
      reportAllPages: true
    })
    await flushPromises()
    expect(link.download).toBe('training-Sending-Report-Enrollment-Emails.csv')

    globalThis.URL.createObjectURL = oldURL
    document.createElement = oldCreateElement
  })

  it('handleOnResend accepts single row object and toggles dialog state', () => {
    const toggleIsShowResendDialog = jest.fn()
    const ctx = {
      selectedRow: null,
      toggleIsShowResendDialog
    }
    const row = { id: 'single-row' }
    TrainingReportMicrosoftTeamsTable.methods.handleOnResend.call(ctx, row)
    expect(ctx.selectedRow).toEqual(row)
    expect(toggleIsShowResendDialog).toHaveBeenCalled()
  })

  it('export maps uppercase XLS payload type to Excel', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:xls')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      id: 'r-xls',
      bodyTrainingType: 'training',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportMicrosoftTeamsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'r-xls'
    )
    expect(link.download).toBe('training-Sending-Report-Enrollment-Emails.xlsx')

    globalThis.URL.createObjectURL = oldURL
    document.createElement = oldCreateElement
  })

  it('resendItem array branch resets dialog state even when one resend request fails', async () => {
    AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('fail'))

    const ctx = {
      selectedRow: [{ id: 'ok' }, { id: 'fail' }],
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      $refs: { refTable: { resetSelectableParams: jest.fn() } },
      callForData: jest.fn()
    }

    TrainingReportMicrosoftTeamsTable.methods.resendItem.call(ctx)
    await flushPromises()

    expect(ctx.callForData).not.toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('callForData handles empty rows and triggers loading start/finally', async () => {
    AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
    const setLoading = jest.fn()
    const ctx = {
      id: 'empty-report',
      bodyTrainingType: 'training',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} },
      serverSideProps: {},
      tableData: [{ id: 'old' }],
      setLoading
    }

    TrainingReportMicrosoftTeamsTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(0)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(setLoading).toHaveBeenCalledWith(true)
    expect(setLoading).toHaveBeenCalledTimes(2)
  })

  it('handleSearchChange removes all matching custom field names', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      customFields: [{ name: 'cf1' }, { name: 'cf2' }],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }

    TrainingReportMicrosoftTeamsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'email' },
              { FieldName: 'cf1' },
              { FieldName: 'cf2' },
              { FieldName: 'department' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email' },
      { FieldName: 'department' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('resendItem single branch resets state when resend request fails', async () => {
    AwarenessEducatorService.resendMicrosoftTeamsSendingReportEmails.mockRejectedValueOnce(
      new Error('single-fail')
    )
    const ctx = {
      selectedRow: { id: 'single-fail' },
      isResendActionButtonDisabled: false,
      isShowResendDialog: true,
      $refs: { refTable: { resetSelectableParams: jest.fn() } },
      callForData: jest.fn()
    }

    TrainingReportMicrosoftTeamsTable.methods.resendItem.call(ctx)
    await flushPromises()

    expect(ctx.callForData).not.toHaveBeenCalled()
    expect(ctx.isResendActionButtonDisabled).toBe(false)
    expect(ctx.isShowResendDialog).toBe(false)
    expect(ctx.selectedRow).toBeNull()
  })

  it('callForData keeps row object when customFieldValues does not exist', async () => {
    AwarenessEducatorService.searchMicrosoftTeamsSendingReportEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ id: 'row-1' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      id: 'report-no-custom',
      bodyTrainingType: 'training',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    TrainingReportMicrosoftTeamsTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([{ id: 'row-1' }])
    expect(ctx.setLoading).toHaveBeenCalledTimes(2)
  })

  it('customFields watcher does not insert when department index is zero', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'department' }, { property: 'email' }]
      }
    }

    TrainingReportMicrosoftTeamsTable.watch.customFields.handler.call(ctx, [{ name: 'cf-x' }])

    expect(ctx.tableOptions.columns.map((x) => x.property)).toEqual(['department', 'email'])
  })

  it('export forwards pagination and sort payload fields', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:payload')
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => ({ click: jest.fn(), download: '', href: '' }))

    const ctx = {
      id: 'payload-report',
      bodyTrainingType: 'training',
      axiosPayload: { orderBy: 'lastSendDate', ascending: false, filter: { f: 1 } }
    }
    TrainingReportMicrosoftTeamsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 4,
      pageSize: 50,
      reportAllPages: true
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 4,
        pageSize: 50,
        orderBy: 'lastSendDate',
        ascending: false,
        reportAllPages: true,
        exportType: 'CSV',
        filter: { f: 1 }
      }),
      'payload-report'
    )

    globalThis.URL.createObjectURL = oldURL
    document.createElement = oldCreateElement
  })
})

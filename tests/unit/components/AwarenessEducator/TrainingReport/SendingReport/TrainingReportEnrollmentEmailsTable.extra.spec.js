jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    getTrainingReportSendingReportDetails: jest.fn(),
    searchSendingReportEnrollmentEmails: jest.fn(),
    exportSendingReport: jest.fn()
  }
}))

import TrainingReportEnrollmentEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportEnrollmentEmailsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

describe('TrainingReportEnrollmentEmailsTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getTargetUserStatusDisplay returns status or empty string', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay({
        targetUserStatus: 'Active'
      })
    ).toBe('Active')
    expect(TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay({})).toBe('')
  })

  it('isRowTypeDeleted handles case/whitespace and non-deleted values', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.isRowTypeDeleted({
        targetUserStatus: '  Deleted  '
      })
    ).toBe(true)
    expect(
      TrainingReportEnrollmentEmailsTable.methods.isRowTypeDeleted({
        targetUserStatus: 'Active'
      })
    ).toBe(false)
  })

  it('getDeletedRowClassName returns deleted row class only for deleted users', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowClassName.call(
        TrainingReportEnrollmentEmailsTable.methods,
        { row: { targetUserStatus: 'Deleted' } }
      )
    ).toContain('deleted-row')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowClassName.call(
        TrainingReportEnrollmentEmailsTable.methods,
        { row: { targetUserStatus: 'Active' } }
      )
    ).toBe('')
  })

  it('getDeletedRowCellClass returns class except on targetUserStatus column', () => {
    const ctx = TrainingReportEnrollmentEmailsTable.methods
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: { property: 'email' }
      })
    ).toBe('training-report-enrollment__deleted-row-cell')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: { property: 'targetUserStatus' }
      })
    ).toBe('')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(ctx, {
        row: { targetUserStatus: 'Active' },
        column: { property: 'email' }
      })
    ).toBe('')
  })

  it('getDeletedRowTooltipText returns tooltip only for deleted non-status columns', () => {
    const ctx = TrainingReportEnrollmentEmailsTable.methods
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: { property: 'department' }
      })
    ).toBe('This user has been deleted')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: { property: 'targetUserStatus' }
      })
    ).toBe('')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx, {
        row: { targetUserStatus: 'Deleted' },
        column: {}
      })
    ).toBe('')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx, {
        row: { targetUserStatus: 'Active' },
        column: { property: 'department' }
      })
    ).toBe('')
  })

  it('getEvents returns empty array when extended view data has no events', () => {
    const mapped = TrainingReportEnrollmentEmailsTable.computed.getEvents.call({
      extendedViewValue: [{}],
      getEventReason: jest.fn()
    })
    expect(mapped).toEqual([])
  })

  it('getNoEventMessage falls back to SMTP text when provider is empty', () => {
    const message = TrainingReportEnrollmentEmailsTable.computed.getNoEventMessage.call({
      extendedViewValue: []
    })
    expect(message).toBe('Event history is only available for SMTP')
  })

  it('getNoEventMessage returns sendgrid waiting text for Sendgrid provider', () => {
    const message = TrainingReportEnrollmentEmailsTable.computed.getNoEventMessage.call({
      extendedViewValue: [{ serviceProvider: 'Sendgrid' }]
    })
    expect(message).toContain('few minutes')
  })

  it('getEvents maps status/date/reason/mxServer from event list', () => {
    const ctx = {
      extendedViewValue: [
        {
          events: [{ event: 'delivered', timestamp: '2026-02-01', mxServer: 'mx-main' }]
        }
      ],
      getEventReason: jest.fn(() => 'This email was delivered')
    }

    const mapped = TrainingReportEnrollmentEmailsTable.computed.getEvents.call(ctx)

    expect(mapped).toEqual([
      {
        status: 'Delivered',
        date: '2026-02-01',
        reason: 'This email was delivered',
        mxServer: 'mx-main'
      }
    ])
  })

  it('customFields watcher inserts columns at start when department column is missing', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'email' }, { property: 'firstName' }]
      }
    }
    TrainingReportEnrollmentEmailsTable.watch.customFields.handler.call(ctx, [
      { name: 'Branch', fieldDataType: 'string' }
    ])
    expect(ctx.tableOptions.columns[0].property).toBe('Branch')
    expect(ctx.tableOptions.columns[1].property).toBe('email')
  })

  it('isScormProxy watcher keeps row actions unchanged when resend action is not present', () => {
    const ctx = {
      tableOptions: {
        rowActions: [{ name: 'Details' }]
      }
    }
    TrainingReportEnrollmentEmailsTable.watch.isScormProxy.handler.call(ctx, true)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('isScormProxy watcher removes "Resend Survey" action when proxy is enabled', () => {
    const ctx = {
      tableOptions: {
        rowActions: [{ name: 'Resend Survey' }, { name: 'Details' }]
      }
    }

    TrainingReportEnrollmentEmailsTable.watch.isScormProxy.handler.call(ctx, true)

    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('deleted row helpers are safe with missing args', () => {
    const ctx = TrainingReportEnrollmentEmailsTable.methods
    expect(TrainingReportEnrollmentEmailsTable.methods.getDeletedRowClassName.call(ctx)).toBe('')
    expect(TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(ctx)).toBe('')
    expect(TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(ctx)).toBe('')
  })

  it('getTargetUserStatusDisplay returns empty for nullish status', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay({
        targetUserStatus: null
      })
    ).toBe('')
    expect(TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay()).toBe('')
  })

  it('getErrorMessage returns undefined when both errorMessage and tooltipText are missing', () => {
    expect(TrainingReportEnrollmentEmailsTable.methods.getErrorMessage({})).toBeUndefined()
  })

  it('getTooltipDisabilityStatus is false when errorMessage exists without hasTooltip', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTooltipDisabilityStatus({
        hasTooltip: false,
        errorMessage: 'Mail failed'
      })
    ).toBe(false)
  })

  it('getDeletedRowCellClass returns deleted class for deleted row when column is missing', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getDeletedRowCellClass.call(
        TrainingReportEnrollmentEmailsTable.methods,
        {
          row: { targetUserStatus: 'Deleted' }
        }
      )
    ).toBe('training-report-enrollment__deleted-row-cell')
  })

  it('getEventReason processed branch works even when originatingIP is missing', () => {
    const reason = TrainingReportEnrollmentEmailsTable.methods.getEventReason.call(
      { extendedViewValue: [{}] },
      { event: 'processed' }
    )

    expect(reason).toContain('shared IP address')
  })

  it('handleSearchChange keeps all filter items when customFields are undefined', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      customFields: undefined,
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }

    TrainingReportEnrollmentEmailsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'email' }, { FieldName: 'department' }] }]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email' },
      { FieldName: 'department' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('isScormProxy watcher keeps actions unchanged when flag is false', () => {
    const ctx = {
      tableOptions: {
        rowActions: [{ name: 'Resend Training' }, { name: 'Details' }]
      }
    }

    TrainingReportEnrollmentEmailsTable.watch.isScormProxy.handler.call(ctx, false)

    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Resend Training' }, { name: 'Details' }])
  })

  it('getEventReason returns delivered text and empty string for unknown event', () => {
    const ctx = { extendedViewValue: [{ originatingIP: '10.10.10.10' }] }

    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEventReason.call(ctx, { event: 'delivered' })
    ).toBe('This email was delivered')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEventReason.call(ctx, { event: 'open' })
    ).toBe('')
  })

  it('getEvents is resilient when event fields are missing', () => {
    const mapped = TrainingReportEnrollmentEmailsTable.computed.getEvents.call({
      extendedViewValue: [{ events: [{}] }],
      getEventReason: jest.fn(() => '')
    })

    expect(mapped).toEqual([
      {
        status: undefined,
        date: undefined,
        reason: '',
        mxServer: undefined
      }
    ])
  })

  it('handleSelectionChange emits selection count', () => {
    const emit = jest.fn()
    TrainingReportEnrollmentEmailsTable.methods.handleSelectionChange.call({ $emit: emit }, 7)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 7)
  })

  it('handleOnResend emits payload with axios filter', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }] } },
      $emit: emit
    }

    TrainingReportEnrollmentEmailsTable.methods.handleOnResend.call(
      ctx,
      [{ id: 1 }],
      ['x'],
      false
    )

    expect(emit).toHaveBeenCalledWith(
      'on-resend',
      [{ id: 1 }],
      ['x'],
      false,
      { FilterGroups: [{ FilterItems: [] }] }
    )
  })

  it('handleOnDetail uses safe fallback when response shape is missing', async () => {
    AwarenessEducatorService.getTrainingReportSendingReportDetails.mockResolvedValueOnce({})
    const ctx = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }

    TrainingReportEnrollmentEmailsTable.methods.handleOnDetail.call(ctx, {
      enrollmentId: 'e-safe',
      targetUserResourceId: 'u-safe'
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.extendedViewValue).toEqual([[]])
    expect(ctx.extendedViewOptions.isErrorState).toBe(false)
    expect(ctx.extendedViewLoading).toBe(false)
  })

  it('handleOnDetail sets error state and fallback value on request failure', async () => {
    AwarenessEducatorService.getTrainingReportSendingReportDetails.mockRejectedValueOnce(
      new Error('network-error')
    )
    const ctx = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }

    TrainingReportEnrollmentEmailsTable.methods.handleOnDetail.call(ctx, {
      enrollmentId: 'e-fail',
      targetUserResourceId: 'u-fail'
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.extendedViewValue).toEqual([{}])
    expect(ctx.extendedViewOptions.isErrorState).toBe(true)
    expect(ctx.extendedViewLoading).toBe(false)
    expect(ctx.isShowExtendedView).toBe(true)
  })

  it('isRowTypeDeleted returns false for nullish status', () => {
    expect(TrainingReportEnrollmentEmailsTable.methods.isRowTypeDeleted({})).toBe(false)
    expect(TrainingReportEnrollmentEmailsTable.methods.isRowTypeDeleted()).toBe(false)
  })

  it('getTooltipDisabilityStatus returns true when neither tooltip nor error exists', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTooltipDisabilityStatus({
        hasTooltip: false,
        errorMessage: ''
      })
    ).toBe(true)
  })

  it('getNoEventMessage returns SMTP fallback text for non-Sendgrid providers', () => {
    const message = TrainingReportEnrollmentEmailsTable.computed.getNoEventMessage.call({
      extendedViewValue: [{ serviceProvider: 'SMTP' }]
    })
    expect(message).toBe('Event history is only available for SMTP')
  })

  it('customFields watcher does not insert columns when department is first column', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'department' }, { property: 'email' }]
      }
    }

    TrainingReportEnrollmentEmailsTable.watch.customFields.handler.call(ctx, [
      { name: 'Branch', fieldDataType: 'string' }
    ])

    expect(ctx.tableOptions.columns).toEqual([{ property: 'department' }, { property: 'email' }])
  })

  it('callForData keeps rows when customFieldValues is missing and updates pagination', async () => {
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ firstName: 'John', email: 'john@example.com' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      id: 'report-1',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    TrainingReportEnrollmentEmailsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.tableData).toEqual([{ firstName: 'John', email: 'john@example.com' }])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('exportTrainingReportSendingReportTable creates survey csv filename', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:survey-csv')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      id: 'report-survey-csv',
      isSurvey: true,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportEnrollmentEmailsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'CSV' }),
      'report-survey-csv'
    )
    expect(link.download).toBe('Survey-Sending-Report-Enrollment-Emails.csv')
    expect(link.click).toHaveBeenCalled()

    globalThis.URL.createObjectURL = oldCreateObjectURL
    document.createElement = oldCreateElement
  })

  it('exportTrainingReportSendingReportTable keeps lowercase xls exportType and still uses xlsx extension', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:training-xls-lower')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      id: 'report-training-xls-lower',
      isSurvey: false,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportEnrollmentEmailsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'xls' }),
      'report-training-xls-lower'
    )
    expect(link.download).toBe('Training-Sending-Report-Enrollment-Emails.xlsx')
    expect(link.click).toHaveBeenCalled()

    globalThis.URL.createObjectURL = oldCreateObjectURL
    document.createElement = oldCreateElement
  })

  it('handleOnDetail writes [null] when response.data.data is explicitly null', async () => {
    AwarenessEducatorService.getTrainingReportSendingReportDetails.mockResolvedValueOnce({
      data: { data: null }
    })
    const ctx = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }

    TrainingReportEnrollmentEmailsTable.methods.handleOnDetail.call(ctx, {
      enrollmentId: 'e-null',
      targetUserResourceId: 'u-null'
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.extendedViewValue).toEqual([null])
    expect(ctx.extendedViewOptions.isErrorState).toBe(false)
    expect(ctx.extendedViewLoading).toBe(false)
  })

  it('getErrorMessage prefers tooltipText when errorMessage is empty string', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getErrorMessage({
        errorMessage: '',
        tooltipText: 'fallback tooltip'
      })
    ).toBe('fallback tooltip')
  })

  it('getTooltipDisabilityStatus is false when hasTooltip is true and error is missing', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTooltipDisabilityStatus({
        hasTooltip: true,
        errorMessage: undefined
      })
    ).toBe(false)
  })

  it('handleSearchChange removes all matching custom field names from quick filter payload', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      customFields: [{ name: 'cfA' }, { name: 'cfB' }],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }

    TrainingReportEnrollmentEmailsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'email', Value: 'a@a.com' },
              { FieldName: 'cfA', Value: 'x' },
              { FieldName: 'cfB', Value: 'y' },
              { FieldName: 'department', Value: 'IT' }
            ]
          }
        ]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email', Value: 'a@a.com' },
      { FieldName: 'department', Value: 'IT' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('callForData merges multiple custom fields into each row', async () => {
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'Jane',
              customFieldValues: [
                { name: 'Region', value: 'EMEA' },
                { name: 'Role', value: 'Manager' }
              ]
            }
          ],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      id: 'report-merge',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    TrainingReportEnrollmentEmailsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.tableData[0]).toMatchObject({
      firstName: 'Jane',
      Region: 'EMEA',
      Role: 'Manager'
    })
  })

  it('getEmptyTableTextMessage returns survey text branch when isSurvey is true', () => {
    const message = TrainingReportEnrollmentEmailsTable.methods.getEmptyTableTextMessage.call({
      isSurvey: true,
      trainingSummary: {}
    })
    expect(message).toBeTruthy()
  })

  it('getEmptyTableTextMessage returns poster/infographic/default branches', () => {
    const poster = TrainingReportEnrollmentEmailsTable.methods.getEmptyTableTextMessage.call({
      isSurvey: false,
      trainingSummary: { trainingTypeName: 'Poster' }
    })
    const infographic = TrainingReportEnrollmentEmailsTable.methods.getEmptyTableTextMessage.call({
      isSurvey: false,
      trainingSummary: { trainingTypeName: 'Infographic' }
    })
    const fallback = TrainingReportEnrollmentEmailsTable.methods.getEmptyTableTextMessage.call({
      isSurvey: false,
      trainingSummary: { trainingTypeName: 'Training' }
    })

    expect(poster).toBeTruthy()
    expect(infographic).toBeTruthy()
    expect(fallback).toBeTruthy()
  })

  it('callForData handles empty result set without crashing', async () => {
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      id: 'report-empty',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: false },
      serverSideProps: {},
      tableData: [{ firstName: 'old' }],
      setLoading: jest.fn()
    }

    TrainingReportEnrollmentEmailsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(0)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(0)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
  })

  it('getDeletedRowClassName returns class for lowercase deleted status', () => {
    const className = TrainingReportEnrollmentEmailsTable.methods.getDeletedRowClassName.call(
      TrainingReportEnrollmentEmailsTable.methods,
      {
        row: { targetUserStatus: 'deleted' }
      }
    )

    expect(className).toContain('deleted-row')
  })

  it('getEventReason prioritizes explicit reason over processed/delivered branches', () => {
    const reason = TrainingReportEnrollmentEmailsTable.methods.getEventReason.call(
      { extendedViewValue: [{ originatingIP: '1.1.1.1' }] },
      { event: 'processed', reason: 'manual reason' }
    )

    expect(reason).toBe('manual reason')
  })

  it('exportTrainingReportSendingReportTable forwards payload paging/order/reportAllPages fields', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:payload-check')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      id: 'report-payload',
      isSurvey: false,
      axiosPayload: { orderBy: 'lastSendDate', ascending: false, filter: { FilterGroups: [] } }
    }
    TrainingReportEnrollmentEmailsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['CSV'],
      pageNumber: 3,
      pageSize: 25,
      reportAllPages: true
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({
        pageNumber: 3,
        pageSize: 25,
        orderBy: 'lastSendDate',
        ascending: false,
        reportAllPages: true,
        exportType: 'CSV'
      }),
      'report-payload'
    )
    expect(link.download).toBe('Training-Sending-Report-Enrollment-Emails.csv')
    expect(link.click).toHaveBeenCalled()

    globalThis.URL.createObjectURL = oldCreateObjectURL
    document.createElement = oldCreateElement
  })

  it('callForData triggers setLoading in start and finally phases', async () => {
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValueOnce({
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
      id: 'report-loading',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading
    }

    TrainingReportEnrollmentEmailsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(setLoading).toHaveBeenCalledWith(true)
    expect(setLoading).toHaveBeenCalledTimes(2)
  })

  it('getNoEventMessage treats non-matching provider casing as SMTP fallback', () => {
    const message = TrainingReportEnrollmentEmailsTable.computed.getNoEventMessage.call({
      extendedViewValue: [{ serviceProvider: 'sendgrid' }]
    })
    expect(message).toBe('Event history is only available for SMTP')
  })

  it('getEvents capitalizes first character of event name', () => {
    const mapped = TrainingReportEnrollmentEmailsTable.computed.getEvents.call({
      extendedViewValue: [{ events: [{ event: 'processed', timestamp: 't-1' }] }],
      getEventReason: jest.fn(() => 'reason')
    })

    expect(mapped[0].status).toBe('Processed')
    expect(mapped[0].date).toBe('t-1')
    expect(mapped[0].reason).toBe('reason')
  })

  it('getTargetUserStatusDisplay returns raw status text without normalization', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTargetUserStatusDisplay({
        targetUserStatus: '  Active  '
      })
    ).toBe('  Active  ')
  })

  it('mounted triggers callForData through nextTick', () => {
    const callForData = jest.fn()
    TrainingReportEnrollmentEmailsTable.mounted.call({
      callForData,
      $nextTick: (cb) => cb()
    })
    expect(callForData).toHaveBeenCalled()
  })

  it('getBtnStatusColor delegates to helper without throwing', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getBtnStatusColor('Successful')
    ).toBeTruthy()
  })

  it('customFields watcher inserts generated fields after department when index is non-zero', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'firstName' }, { property: 'department' }, { property: 'email' }]
      }
    }

    TrainingReportEnrollmentEmailsTable.watch.customFields.handler.call(ctx, [
      { name: 'Custom1', fieldDataType: 'string' }
    ])

    expect(ctx.tableOptions.columns.map((x) => x.property)).toEqual([
      'firstName',
      'department',
      'Custom1',
      'email'
    ])
  })

  it('isScormProxy watcher removes only first matching resend action', () => {
    const ctx = {
      tableOptions: {
        rowActions: [{ name: 'Resend Survey' }, { name: 'Resend Training' }, { name: 'Details' }]
      }
    }

    TrainingReportEnrollmentEmailsTable.watch.isScormProxy.handler.call(ctx, true)

    expect(ctx.tableOptions.rowActions).toEqual([
      { name: 'Resend Training' },
      { name: 'Details' }
    ])
  })

  it('handleOnDetail sends enrollment and target user ids to service', async () => {
    AwarenessEducatorService.getTrainingReportSendingReportDetails.mockResolvedValueOnce({
      data: { data: {} }
    })
    const ctx = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }

    TrainingReportEnrollmentEmailsTable.methods.handleOnDetail.call(ctx, {
      enrollmentId: 'enr-42',
      targetUserResourceId: 'user-24'
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.getTrainingReportSendingReportDetails).toHaveBeenCalledWith(
      'enr-42',
      'user-24'
    )
  })

  it('handleSearchChange keeps filters when customFields is empty array', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      customFields: [],
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }

    TrainingReportEnrollmentEmailsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'email' }, { FieldName: 'department' }] }]
      }
    })

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email' },
      { FieldName: 'department' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('exportTrainingReportSendingReportTable maps uppercase XLS to Excel payload', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:xls-upper')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      id: 'report-xls-upper',
      isSurvey: false,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportEnrollmentEmailsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'report-xls-upper'
    )
    expect(link.download).toBe('Training-Sending-Report-Enrollment-Emails.xlsx')

    globalThis.URL.createObjectURL = oldCreateObjectURL
    document.createElement = oldCreateElement
  })

  it('exportTrainingReportSendingReportTable iterates all export types', async () => {
    AwarenessEducatorService.exportSendingReport
      .mockResolvedValueOnce({ data: new Blob(['a']) })
      .mockResolvedValueOnce({ data: new Blob(['b']) })
    const oldCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:multi')
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => ({ click: jest.fn(), download: '', href: '' }))

    const ctx = {
      id: 'report-multi-export',
      isSurvey: false,
      axiosPayload: { orderBy: 'email', ascending: false, filter: { FilterGroups: [] } }
    }
    TrainingReportEnrollmentEmailsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 2,
      pageSize: 15,
      reportAllPages: true
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledTimes(2)
    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' }),
      'report-multi-export'
    )
    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' }),
      'report-multi-export'
    )

    globalThis.URL.createObjectURL = oldCreateObjectURL
    document.createElement = oldCreateElement
  })

  it('handleOnResend emits undefined filter when axiosPayload.filter is missing', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: {},
      $emit: emit
    }

    TrainingReportEnrollmentEmailsTable.methods.handleOnResend.call(
      ctx,
      [{ id: 'u1' }],
      [],
      true
    )

    expect(emit).toHaveBeenCalledWith('on-resend', [{ id: 'u1' }], [], true, undefined)
  })

  it('getDeletedRowTooltipText supports lowercase deleted with spaces', () => {
    const text = TrainingReportEnrollmentEmailsTable.methods.getDeletedRowTooltipText.call(
      TrainingReportEnrollmentEmailsTable.methods,
      {
        row: { targetUserStatus: '  deleted  ' },
        column: { property: 'email' }
      }
    )
    expect(text).toBe('This user has been deleted')
  })

  it('getDeletedRowClassName returns empty for blank status', () => {
    const className = TrainingReportEnrollmentEmailsTable.methods.getDeletedRowClassName.call(
      TrainingReportEnrollmentEmailsTable.methods,
      {
        row: { targetUserStatus: '   ' }
      }
    )
    expect(className).toBe('')
  })

  it('callForData finally calls setLoading without explicit argument', async () => {
    const setLoading = jest.fn()
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      id: 'report-finally-arg',
      axiosPayload: { filter: {}, orderBy: 'email', ascending: true },
      serverSideProps: {},
      tableData: [],
      setLoading
    }

    TrainingReportEnrollmentEmailsTable.methods.callForData.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(setLoading).toHaveBeenNthCalledWith(1, true)
    expect(setLoading).toHaveBeenNthCalledWith(2)
  })
})

jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportEnrollmentEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportSendingReportDetails: jest.fn()
  }
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      orderBy: 'email',
      ascending: true,
      filter: {
        FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
      }
    })),
    getBtnStatusColor: jest.fn(() => '#abc')
  }
})

jest.mock('@/utils/helperFunctions', () => ({
  createCustomFieldColumns: jest.fn(() => [{ property: 'customA' }, { property: 'customB' }])
}))

import TrainingReportEnrollmentEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportEnrollmentEmailsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getBtnStatusColor } from '@/utils/functions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

describe('TrainingReportEnrollmentEmailsTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps events and no-event message from extended view data', () => {
    const mapped = TrainingReportEnrollmentEmailsTable.computed.getEvents.call({
      extendedViewValue: [
        {
          events: [{ event: 'processed', timestamp: '2026-01-01', mxServer: 'mx1' }]
        }
      ],
      getEventReason: jest.fn(() => 'reason')
    })
    expect(mapped).toEqual([
      { status: 'Processed', date: '2026-01-01', reason: 'reason', mxServer: 'mx1' }
    ])

    expect(
      TrainingReportEnrollmentEmailsTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'Sendgrid' }]
      })
    ).toContain('few minutes')
    expect(
      TrainingReportEnrollmentEmailsTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'SMTP' }]
      })
    ).toContain('SMTP')
  })

  it('returns error message, tooltip status and emits selection count', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getErrorMessage({ errorMessage: 'err', tooltipText: 'tip' })
    ).toBe('err')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getErrorMessage({ tooltipText: 'tip' })
    ).toBe('tip')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTooltipDisabilityStatus({
        hasTooltip: false,
        errorMessage: ''
      })
    ).toBe(true)
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getTooltipDisabilityStatus({
        hasTooltip: true,
        errorMessage: ''
      })
    ).toBe(false)

    const emit = jest.fn()
    TrainingReportEnrollmentEmailsTable.methods.handleSelectionChange.call({ $emit: emit }, 3)
    expect(emit).toHaveBeenCalledWith('on-selection-text-change', 3)
  })

  it('handleSearchChange filters custom fields and resets page before fetch', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      customFields: [{ name: 'customA' }],
      axiosPayload: {
        filter: {
          FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }]
        }
      },
      resetPageNumber,
      callForData
    }
    const searchFilter = {
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: 'email', Value: 'a@a.com' },
              { FieldName: 'customA', Value: 'x' }
            ]
          }
        ]
      }
    }

    TrainingReportEnrollmentEmailsTable.methods.handleSearchChange.call(ctx, searchFilter)

    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email', Value: 'a@a.com' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('returns empty table text by survey/type branches', () => {
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEmptyTableTextMessage.call({
        isSurvey: true,
        trainingSummary: {}
      })
    ).toBeTruthy()
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEmptyTableTextMessage.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: 'Poster' }
      })
    ).toBeTruthy()
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEmptyTableTextMessage.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: 'Infographic' }
      })
    ).toBeTruthy()
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEmptyTableTextMessage.call({
        isSurvey: false,
        trainingSummary: { trainingTypeName: 'Training' }
      })
    ).toBeTruthy()
  })

  it('forwards resend payload with current filter', () => {
    const emit = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [] } },
      $emit: emit
    }
    TrainingReportEnrollmentEmailsTable.methods.handleOnResend.call(
      ctx,
      [{ id: 1 }],
      ['x'],
      true
    )
    expect(emit).toHaveBeenCalledWith('on-resend', [{ id: 1 }], ['x'], true, {
      FilterGroups: []
    })
  })

  it('returns event reason for processed, delivered and explicit reason', () => {
    const ctx = { extendedViewValue: [{ originatingIP: '10.0.0.1' }] }
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEventReason.call(ctx, { reason: 'manual' })
    ).toBe('manual')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEventReason.call(ctx, { event: 'processed' })
    ).toContain('10.0.0.1')
    expect(
      TrainingReportEnrollmentEmailsTable.methods.getEventReason.call(ctx, { event: 'delivered' })
    ).toContain('delivered')
    expect(TrainingReportEnrollmentEmailsTable.methods.getEventReason.call(ctx, { event: 'open' })).toBe(
      ''
    )
  })

  it('delegates button status color helper', () => {
    expect(TrainingReportEnrollmentEmailsTable.methods.getBtnStatusColor('success')).toBe('#abc')
    expect(getBtnStatusColor).toHaveBeenCalledWith('success')
  })

  it('callForData populates table rows and server side props', async () => {
    AwarenessEducatorService.searchSendingReportEnrollmentEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'John',
              customFieldValues: [{ name: 'DeptCode', value: 'D-1' }]
            }
          ],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 2,
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

    expect(AwarenessEducatorService.searchSendingReportEnrollmentEmails).toHaveBeenCalledWith(
      ctx.axiosPayload,
      'report-1'
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(2)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.tableData[0].DeptCode).toBe('D-1')
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('exports report for each type and downloads with expected extension', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValue({ data: new Blob(['x']) })
    const createObjectURL = jest.fn(() => 'blob:report')
    const oldCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = createObjectURL
    const click = jest.fn()
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => ({ click }))

    const ctx = {
      id: 'report-1',
      isSurvey: false,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportEnrollmentEmailsTable.methods.exportTrainingReportSendingReportTable.call(ctx, {
      exportTypes: ['CSV', 'XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledTimes(2)
    expect(click).toHaveBeenCalledTimes(2)

    globalThis.URL.createObjectURL = oldCreateObjectURL
    document.createElement = oldCreateElement
  })

  it('exports survey xls with expected survey filename extension', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValue({ data: new Blob(['x']) })
    const oldCreateObjectURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:survey')
    const link = { click: jest.fn(), download: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      id: 'report-survey',
      isSurvey: true,
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

    expect(link.download).toBe('Survey-Sending-Report-Enrollment-Emails.xlsx')
    expect(link.click).toHaveBeenCalled()

    globalThis.URL.createObjectURL = oldCreateObjectURL
    document.createElement = oldCreateElement
  })

  it('loads detail view on success and sets error state on failure', async () => {
    AwarenessEducatorService.getTrainingReportSendingReportDetails.mockResolvedValueOnce({
      data: { data: { serviceProvider: 'SMTP', events: [] } }
    })
    const successCtx = {
      extendedViewOptions: { isErrorState: true },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: [],
      id: 'x'
    }
    TrainingReportEnrollmentEmailsTable.methods.handleOnDetail.call(successCtx, {
      enrollmentId: 'e1',
      targetUserResourceId: 'u1'
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(successCtx.extendedViewOptions.isErrorState).toBe(false)
    expect(successCtx.isShowExtendedView).toBe(true)
    expect(successCtx.extendedViewValue).toEqual([{ serviceProvider: 'SMTP', events: [] }])
    expect(successCtx.extendedViewLoading).toBe(false)

    AwarenessEducatorService.getTrainingReportSendingReportDetails.mockRejectedValueOnce(
      new Error('detail-fail')
    )
    const failCtx = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    TrainingReportEnrollmentEmailsTable.methods.handleOnDetail.call(failCtx, {
      enrollmentId: 'e2',
      targetUserResourceId: 'u2'
    })
    await Promise.resolve()
    await Promise.resolve()
    expect(failCtx.extendedViewValue).toEqual([{}])
    expect(failCtx.extendedViewOptions.isErrorState).toBe(true)
    expect(failCtx.extendedViewLoading).toBe(false)
  })

  it('watch handlers inject custom columns and remove resend action for scorm proxy', () => {
    const customCtx = {
      tableOptions: {
        columns: [
          { property: 'firstName' },
          { property: 'department' },
          { property: 'email' }
        ]
      }
    }
    TrainingReportEnrollmentEmailsTable.watch.customFields.handler.call(customCtx, [{ name: 'A' }])
    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'A' }], false)
    expect(customCtx.tableOptions.columns.map((c) => c.property)).toEqual([
      'firstName',
      'department',
      'customA',
      'customB',
      'email'
    ])

    const scormCtx = {
      tableOptions: {
        rowActions: [{ name: 'Resend Training' }, { name: 'Details' }]
      }
    }
    TrainingReportEnrollmentEmailsTable.watch.isScormProxy.handler.call(scormCtx, true)
    expect(scormCtx.tableOptions.rowActions).toEqual([{ name: 'Details' }])
  })

  it('customFields watcher does not insert when department index is 0', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'department' }, { property: 'email' }]
      }
    }
    TrainingReportEnrollmentEmailsTable.watch.customFields.handler.call(ctx, [{ name: 'A' }])
    expect(ctx.tableOptions.columns).toEqual([{ property: 'department' }, { property: 'email' }])
  })

  it('isScormProxy watcher leaves row actions intact when false', () => {
    const ctx = {
      tableOptions: {
        rowActions: [{ name: 'Resend Training' }, { name: 'Details' }]
      }
    }
    TrainingReportEnrollmentEmailsTable.watch.isScormProxy.handler.call(ctx, false)
    expect(ctx.tableOptions.rowActions).toEqual([{ name: 'Resend Training' }, { name: 'Details' }])
  })

  it('mounted triggers callForData on next tick', () => {
    const callForData = jest.fn()
    const ctx = {
      callForData,
      $nextTick: (cb) => cb()
    }
    TrainingReportEnrollmentEmailsTable.mounted.call(ctx)
    expect(callForData).toHaveBeenCalled()
  })
})

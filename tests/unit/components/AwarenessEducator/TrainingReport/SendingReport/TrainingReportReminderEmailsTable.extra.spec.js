jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportReminderEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportReminderEmailDetails: jest.fn()
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
    getBtnStatusColor: jest.fn(() => '#f70')
  }
})

jest.mock('@/utils/helperFunctions', () => ({
  createCustomFieldColumns: jest.fn(() => [{ property: 'cfR' }])
}))

import TrainingReportReminderEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportReminderEmailsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getBtnStatusColor } from '@/utils/functions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReportReminderEmailsTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed getEvents/getNoEventMessage branches work', () => {
    const events = TrainingReportReminderEmailsTable.computed.getEvents.call({
      extendedViewValue: [{ events: [{ event: 'processed', timestamp: 't', mxServer: 'mx' }] }],
      getEventReason: jest.fn(() => 'reason')
    })
    expect(events).toEqual([{ status: 'Processed', date: 't', reason: 'reason', mxServer: 'mx' }])

    expect(
      TrainingReportReminderEmailsTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'Sendgrid' }]
      })
    ).toContain('few minutes')
    expect(
      TrainingReportReminderEmailsTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'SMTP' }]
      })
    ).toContain('SMTP')
  })

  it('computed branches return empty events and SMTP text for missing provider', () => {
    const events = TrainingReportReminderEmailsTable.computed.getEvents.call({
      extendedViewValue: [{}],
      getEventReason: jest.fn()
    })
    expect(events).toEqual([])
    const message = TrainingReportReminderEmailsTable.computed.getNoEventMessage.call({
      extendedViewValue: []
    })
    expect(message).toBe('Event history is only available for SMTP')
  })

  it('tooltip/error and event reason helper branches are covered', () => {
    expect(
      TrainingReportReminderEmailsTable.methods.getTooltipDisabilityStatus({ hasTooltip: false, errorMessage: '' })
    ).toBe(true)
    expect(
      TrainingReportReminderEmailsTable.methods.getTooltipDisabilityStatus({ hasTooltip: true, errorMessage: '' })
    ).toBe(false)
    expect(
      TrainingReportReminderEmailsTable.methods.getErrorMessage({ errorMessage: 'err', tooltipText: 'tip' })
    ).toBe('err')
    expect(TrainingReportReminderEmailsTable.methods.getErrorMessage({ tooltipText: 'tip' })).toBe('tip')

    const ctx = { extendedViewValue: [{ originatingIP: '2.2.2.2' }] }
    expect(TrainingReportReminderEmailsTable.methods.getEventReason.call(ctx, { reason: 'x' })).toBe('x')
    expect(
      TrainingReportReminderEmailsTable.methods.getEventReason.call(ctx, { event: 'processed' })
    ).toContain('2.2.2.2')
    expect(
      TrainingReportReminderEmailsTable.methods.getEventReason.call(ctx, { event: 'delivered' })
    ).toContain('delivered')
    expect(TrainingReportReminderEmailsTable.methods.getEventReason.call(ctx, { event: 'open' })).toBe('')
  })

  it('handleSearchChange removes SmtpName and triggers reset/fetch', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }
    TrainingReportReminderEmailsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'SmtpName' }, { FieldName: 'email' }] }]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([{ FieldName: 'email' }])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('handleSearchChange keeps filters when SmtpName is not present', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }
    TrainingReportReminderEmailsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'email' }, { FieldName: 'status' }] }]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email' },
      { FieldName: 'status' }
    ])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('callForData maps rows and custom fields', async () => {
    AwarenessEducatorService.searchSendingReportReminderEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'cfX', value: '1' }] }],
          totalNumberOfRecords: 3,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      id: 'report-1',
      axiosPayload: {},
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }

    TrainingReportReminderEmailsTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.searchSendingReportReminderEmails).toHaveBeenCalledWith(
      {},
      'report-1'
    )
    expect(ctx.tableData[0].cfX).toBe('1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(3)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('export maps lowercase xls extension and survey/training filename prefix', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValue({ data: new Blob(['x']) })
    const oldURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:rem')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const surveyCtx = {
      id: 'r-survey',
      isSurvey: true,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportReminderEmailsTable.methods.exportTrainingReportSendingReportTable.call(surveyCtx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(link.download).toBe('Survey-Sending-Report-Reminder-Emails.xlsx')

    const trainingCtx = {
      id: 'r-training',
      isSurvey: false,
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportReminderEmailsTable.methods.exportTrainingReportSendingReportTable.call(trainingCtx, {
      exportTypes: ['CSV'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()
    expect(link.download).toBe('Training-Sending-Report-Reminder-Emails.csv')

    globalThis.URL.createObjectURL = oldURL
    document.createElement = oldCreateElement
  })

  it('handleOnDetail success/error branches and watcher branch are covered', async () => {
    AwarenessEducatorService.getTrainingReportReminderEmailDetails.mockResolvedValueOnce({
      data: { data: { serviceProvider: 'SMTP', events: [] } }
    })
    const successCtx = {
      id: 'r-1',
      extendedViewOptions: { isErrorState: true },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    TrainingReportReminderEmailsTable.methods.handleOnDetail.call(successCtx, { userEmailId: 'u1' })
    await flushPromises()
    expect(AwarenessEducatorService.getTrainingReportReminderEmailDetails).toHaveBeenCalledWith(
      'r-1',
      'u1'
    )
    expect(successCtx.extendedViewValue).toEqual([{ serviceProvider: 'SMTP', events: [] }])
    expect(successCtx.extendedViewLoading).toBe(false)

    AwarenessEducatorService.getTrainingReportReminderEmailDetails.mockRejectedValueOnce(
      new Error('x')
    )
    const errorCtx = {
      id: 'r-1',
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    TrainingReportReminderEmailsTable.methods.handleOnDetail.call(errorCtx, { userEmailId: 'u2' })
    await flushPromises()
    expect(errorCtx.extendedViewValue).toEqual([{}])
    expect(errorCtx.extendedViewOptions.isErrorState).toBe(true)
    expect(errorCtx.extendedViewLoading).toBe(false)

    const watchCtx = { tableOptions: { columns: [{ property: 'email' }, { property: 'status' }] } }
    TrainingReportReminderEmailsTable.watch.customFields.handler.call(watchCtx, [{ name: 'x' }])
    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'x' }])
    expect(watchCtx.tableOptions.columns.map((x) => x.property)).toEqual(['email', 'status'])

    const watchCtx2 = {
      tableOptions: { columns: [{ property: 'firstName' }, { property: 'email' }, { property: 'status' }] }
    }
    TrainingReportReminderEmailsTable.watch.customFields.handler.call(watchCtx2, [{ name: 'x' }])
    expect(watchCtx2.tableOptions.columns.map((x) => x.property)).toEqual([
      'firstName',
      'email',
      'cfR',
      'status'
    ])
  })

  it('getBtnStatusColor delegates to helper', () => {
    expect(TrainingReportReminderEmailsTable.methods.getBtnStatusColor('ok')).toBe('#f70')
    expect(getBtnStatusColor).toHaveBeenCalledWith('ok')
  })

  it('mounted triggers callForData via nextTick', () => {
    const callForData = jest.fn()
    TrainingReportReminderEmailsTable.mounted.call({
      callForData,
      $nextTick: (cb) => cb()
    })
    expect(callForData).toHaveBeenCalled()
  })
})

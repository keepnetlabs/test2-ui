jest.mock('@/api/awarenessEducator', () => ({
  __esModule: true,
  default: {
    searchSendingReportCertificateEmails: jest.fn(),
    exportSendingReport: jest.fn(),
    getTrainingReportCertificateEmailDetails: jest.fn()
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
    getBtnStatusColor: jest.fn(() => '#0aa')
  }
})

jest.mock('@/utils/helperFunctions', () => ({
  createCustomFieldColumns: jest.fn(() => [{ property: 'cfC' }])
}))

import TrainingReportCertificateEmailsTable from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportCertificateEmailsTable.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getBtnStatusColor } from '@/utils/functions'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrainingReportCertificateEmailsTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed getEvents/getNoEventMessage branches are covered', () => {
    const events = TrainingReportCertificateEmailsTable.computed.getEvents.call({
      extendedViewValue: [{ events: [{ event: 'delivered', timestamp: 't', mxServer: 'mx' }] }],
      getEventReason: jest.fn(() => 'r')
    })
    expect(events).toEqual([{ status: 'Delivered', date: 't', reason: 'r', mxServer: 'mx' }])

    expect(
      TrainingReportCertificateEmailsTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'Sendgrid' }]
      })
    ).toContain('few minutes')
    expect(
      TrainingReportCertificateEmailsTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'SMTP' }]
      })
    ).toContain('SMTP')
  })

  it('computed branches return empty events and SMTP fallback when provider missing', () => {
    const events = TrainingReportCertificateEmailsTable.computed.getEvents.call({
      extendedViewValue: [{}],
      getEventReason: jest.fn()
    })
    expect(events).toEqual([])
    const message = TrainingReportCertificateEmailsTable.computed.getNoEventMessage.call({
      extendedViewValue: []
    })
    expect(message).toBe('Event history is only available for SMTP')
  })

  it('handleSearchChange removes SmtpName filter and triggers pagination reset', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }
    TrainingReportCertificateEmailsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'SmtpName' }, { FieldName: 'email' }] }]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([{ FieldName: 'email' }])
    expect(resetPageNumber).toHaveBeenCalled()
    expect(callForData).toHaveBeenCalled()
  })

  it('handleSearchChange keeps filters when SmtpName does not exist', () => {
    const resetPageNumber = jest.fn()
    const callForData = jest.fn()
    const ctx = {
      axiosPayload: { filter: { FilterGroups: [{ FilterItems: [] }, { FilterItems: [] }] } },
      resetPageNumber,
      callForData
    }
    TrainingReportCertificateEmailsTable.methods.handleSearchChange.call(ctx, {
      filter: {
        FilterGroups: [{ FilterItems: [{ FieldName: 'email' }, { FieldName: 'status' }] }]
      }
    })
    expect(ctx.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: 'email' },
      { FieldName: 'status' }
    ])
  })

  it('getEventReason and getBtnStatusColor helper branches', () => {
    const ctx = { extendedViewValue: [{ originatingIP: '1.1.1.1' }] }
    expect(TrainingReportCertificateEmailsTable.methods.getEventReason.call(ctx, { reason: 'x' })).toBe('x')
    expect(
      TrainingReportCertificateEmailsTable.methods.getEventReason.call(ctx, { event: 'processed' })
    ).toContain('1.1.1.1')
    expect(
      TrainingReportCertificateEmailsTable.methods.getEventReason.call(ctx, { event: 'delivered' })
    ).toContain('delivered')
    expect(TrainingReportCertificateEmailsTable.methods.getEventReason.call(ctx, { event: 'open' })).toBe(
      ''
    )
    expect(TrainingReportCertificateEmailsTable.methods.getBtnStatusColor('ok')).toBe('#0aa')
    expect(getBtnStatusColor).toHaveBeenCalledWith('ok')
  })

  it('callForData uses learning path id when enabled and maps custom fields', async () => {
    AwarenessEducatorService.searchSendingReportCertificateEmails.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ customFieldValues: [{ name: 'cfZ', value: '1' }] }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
    const ctx = {
      isLearningPath: true,
      awardCertificateEnrollmentId: 'award-1',
      id: 'id-1',
      axiosPayload: {},
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportCertificateEmailsTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.searchSendingReportCertificateEmails).toHaveBeenCalledWith(
      {},
      'award-1'
    )
    expect(ctx.tableData[0].cfZ).toBe('1')
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(1)
    expect(ctx.serverSideProps.totalNumberOfPages).toBe(1)
    expect(ctx.serverSideProps.pageNumber).toBe(1)
    expect(ctx.setLoading).toHaveBeenCalledWith(true)
  })

  it('callForData uses report id when learning path is disabled', async () => {
    AwarenessEducatorService.searchSendingReportCertificateEmails.mockResolvedValueOnce({
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
      isLearningPath: false,
      awardCertificateEnrollmentId: 'award-x',
      id: 'id-x',
      axiosPayload: {},
      serverSideProps: {},
      tableData: [],
      setLoading: jest.fn()
    }
    TrainingReportCertificateEmailsTable.methods.callForData.call(ctx)
    await flushPromises()
    expect(AwarenessEducatorService.searchSendingReportCertificateEmails).toHaveBeenCalledWith(
      {},
      'id-x'
    )
  })

  it('export uses survey filename and learning path id for lowercase xls', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:cert')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      isSurvey: true,
      isLearningPath: true,
      awardCertificateEnrollmentId: 'award-2',
      id: 'id-2',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportCertificateEmailsTable.methods.exportTrainingReportCertificateEmailsTable.call(ctx, {
      exportTypes: ['xls'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'xls' }),
      'award-2'
    )
    expect(link.download).toBe('Survey-Sending-Report-Certificate-Emails.xlsx')

    globalThis.URL.createObjectURL = oldURL
    document.createElement = oldCreateElement
  })

  it('export maps uppercase XLS to Excel payload and xlsx filename', async () => {
    AwarenessEducatorService.exportSendingReport.mockResolvedValueOnce({ data: new Blob(['x']) })
    const oldURL = globalThis.URL.createObjectURL
    globalThis.URL.createObjectURL = jest.fn(() => 'blob:cert2')
    const link = { click: jest.fn(), download: '', href: '' }
    const oldCreateElement = document.createElement
    document.createElement = jest.fn(() => link)

    const ctx = {
      isSurvey: false,
      isLearningPath: false,
      id: 'id-3',
      axiosPayload: { orderBy: 'email', ascending: true, filter: {} }
    }
    TrainingReportCertificateEmailsTable.methods.exportTrainingReportCertificateEmailsTable.call(ctx, {
      exportTypes: ['XLS'],
      pageNumber: 1,
      pageSize: 10,
      reportAllPages: false
    })
    await flushPromises()

    expect(AwarenessEducatorService.exportSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ exportType: 'Excel' }),
      'id-3'
    )
    expect(link.download).toBe('Training-Sending-Report-Certificate-Emails.xlsx')

    globalThis.URL.createObjectURL = oldURL
    document.createElement = oldCreateElement
  })

  it('handleOnDetail success and error branches are covered', async () => {
    AwarenessEducatorService.getTrainingReportCertificateEmailDetails.mockResolvedValueOnce({
      data: { data: { serviceProvider: 'SMTP', events: [] } }
    })
    const successCtx = {
      isLearningPath: false,
      id: 't-1',
      extendedViewOptions: { isErrorState: true },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    TrainingReportCertificateEmailsTable.methods.handleOnDetail.call(successCtx, { userEmailId: 'u1' })
    await flushPromises()
    expect(successCtx.extendedViewValue).toEqual([{ serviceProvider: 'SMTP', events: [] }])
    expect(successCtx.extendedViewLoading).toBe(false)

    AwarenessEducatorService.getTrainingReportCertificateEmailDetails.mockRejectedValueOnce(
      new Error('x')
    )
    const errorCtx = {
      isLearningPath: false,
      id: 't-1',
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    TrainingReportCertificateEmailsTable.methods.handleOnDetail.call(errorCtx, { userEmailId: 'u2' })
    await flushPromises()
    expect(errorCtx.extendedViewValue).toEqual([{}])
    expect(errorCtx.extendedViewOptions.isErrorState).toBe(true)
    expect(errorCtx.extendedViewLoading).toBe(false)
  })

  it('handleOnDetail uses learning path identifier when enabled', async () => {
    AwarenessEducatorService.getTrainingReportCertificateEmailDetails.mockResolvedValueOnce({
      data: { data: { serviceProvider: 'SMTP', events: [] } }
    })
    const ctx = {
      isLearningPath: true,
      awardCertificateEnrollmentId: 'award-lp',
      id: 'id-should-not-be-used',
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    TrainingReportCertificateEmailsTable.methods.handleOnDetail.call(ctx, { userEmailId: 'u-lp' })
    await flushPromises()

    expect(AwarenessEducatorService.getTrainingReportCertificateEmailDetails).toHaveBeenCalledWith(
      'award-lp',
      'u-lp'
    )
  })

  it('handleOnResend emits and watcher inserts custom columns when possible', () => {
    const emit = jest.fn()
    const selectionCtx = { $emit: emit, handleSelectionChange: jest.fn() }
    TrainingReportCertificateEmailsTable.methods.handleOnResend.call(
      selectionCtx,
      [{ id: 1 }, { id: 2 }],
      ['x'],
      true,
      { FilterGroups: [] }
    )
    expect(selectionCtx.handleSelectionChange).toHaveBeenCalledWith(2)
    expect(emit).toHaveBeenCalledWith(
      'on-resend',
      [{ id: 1 }, { id: 2 }],
      ['x'],
      true,
      { FilterGroups: [] }
    )

    const watchCtx = { tableOptions: { columns: [{ property: 'email' }, { property: 'status' }] } }
    TrainingReportCertificateEmailsTable.watch.customFields.handler.call(watchCtx, [{ name: 'a' }])
    expect(createCustomFieldColumns).toHaveBeenCalledWith([{ name: 'a' }])
    expect(watchCtx.tableOptions.columns.map((x) => x.property)).toEqual(['email', 'status'])

    const watchCtx2 = {
      tableOptions: { columns: [{ property: 'userEmail' }, { property: 'email' }, { property: 'status' }] }
    }
    TrainingReportCertificateEmailsTable.watch.customFields.handler.call(watchCtx2, [{ name: 'a' }])
    expect(watchCtx2.tableOptions.columns.map((x) => x.property)).toEqual([
      'userEmail',
      'email',
      'cfC',
      'status'
    ])
  })

  it('mounted triggers callForData via nextTick', () => {
    const callForData = jest.fn()
    TrainingReportCertificateEmailsTable.mounted.call({
      callForData,
      $nextTick: (cb) => cb()
    })
    expect(callForData).toHaveBeenCalled()
  })

  it('getEvents returns empty list when events is null and provider check is case-sensitive', () => {
    const events = TrainingReportCertificateEmailsTable.computed.getEvents.call({
      extendedViewValue: [{ events: null }],
      getEventReason: jest.fn()
    })
    expect(events).toEqual([])

    const lowerCaseProviderMessage =
      TrainingReportCertificateEmailsTable.computed.getNoEventMessage.call({
        extendedViewValue: [{ serviceProvider: 'sendgrid' }]
      })
    expect(lowerCaseProviderMessage).toBe('Event history is only available for SMTP')
  })

  it('callForData triggers loading start/finally on empty result payload', async () => {
    AwarenessEducatorService.searchSendingReportCertificateEmails.mockResolvedValueOnce({
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
      isLearningPath: false,
      id: 'cert-empty',
      axiosPayload: {},
      serverSideProps: {},
      tableData: [{ id: 'old' }],
      setLoading
    }

    TrainingReportCertificateEmailsTable.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.tableData).toEqual([])
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(0)
    expect(setLoading).toHaveBeenCalledWith(true)
    expect(setLoading).toHaveBeenCalledTimes(2)
  })

  it('handleOnDetail maps malformed success response into empty-array view value', async () => {
    AwarenessEducatorService.getTrainingReportCertificateEmailDetails.mockResolvedValueOnce({})
    const ctx = {
      isLearningPath: false,
      id: 'cert-malformed',
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }

    TrainingReportCertificateEmailsTable.methods.handleOnDetail.call(ctx, { userEmailId: 'u-mal' })
    await flushPromises()

    expect(ctx.extendedViewValue).toEqual([[]])
    expect(ctx.extendedViewOptions.isErrorState).toBe(false)
    expect(ctx.extendedViewLoading).toBe(false)
  })

  it('handleOnResend supports empty selections and still emits payload', () => {
    const emit = jest.fn()
    const ctx = {
      handleSelectionChange: jest.fn(),
      $emit: emit
    }
    const items = []
    const excluded = ['a']
    const filter = { FilterGroups: [{ FilterItems: [] }] }

    TrainingReportCertificateEmailsTable.methods.handleOnResend.call(
      ctx,
      items,
      excluded,
      false,
      filter
    )

    expect(ctx.handleSelectionChange).toHaveBeenCalledWith(0)
    expect(emit).toHaveBeenCalledWith('on-resend', items, excluded, false, filter)
  })

  it('customFields watcher does not insert when email column index is zero', () => {
    const ctx = {
      tableOptions: {
        columns: [{ property: 'email' }, { property: 'status' }]
      }
    }

    TrainingReportCertificateEmailsTable.watch.customFields.handler.call(ctx, [{ name: 'cf0' }])

    expect(ctx.tableOptions.columns.map((x) => x.property)).toEqual(['email', 'status'])
  })
})

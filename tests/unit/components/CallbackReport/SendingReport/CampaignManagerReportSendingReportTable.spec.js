import CallbackService from '@/api/callback'
import CampaignManagerReportSendingReportTable from '@/components/CallbackReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import { REPORT_TABS } from '@/components/CallbackReport/Opened/utils'

jest.mock('@/api/callback', () => ({
  getCampaignTabUsers: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  exportCampaignTabUsers: jest.fn(() => Promise.resolve({ data: {} })),
  getUserEmailActivity: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

describe('CampaignManagerReportSendingReportTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getNoEventMessage returns sendgrid and smtp messages', () => {
    const sendgridCtx = { extendedViewValue: [{ serviceProvider: 'Sendgrid' }] }
    const smtpCtx = { extendedViewValue: [{ serviceProvider: 'SMTP' }] }

    expect(CampaignManagerReportSendingReportTable.computed.getNoEventMessage.call(sendgridCtx)).toBe(
      'Activity details will be available in a few minutes...'
    )
    expect(CampaignManagerReportSendingReportTable.computed.getNoEventMessage.call(smtpCtx)).toBe(
      'Event history is only available for SMTP'
    )
  })

  it('getEvents maps event list to display model', () => {
    const ctx = {
      extendedViewValue: [
        {
          events: [
            { event: 'processed', timestamp: 't1', reason: 'r1', mxServer: 'mx-a' },
            { event: 'delivered', timestamp: 't2', eventName: 'delivered', mxServer: 'mx-b' }
          ]
        }
      ],
      getEventReason: jest.fn((event) => event.reason || 'fallback')
    }

    const events = CampaignManagerReportSendingReportTable.computed.getEvents.call(ctx)

    expect(events).toEqual([
      { status: 'Processed', date: 't1', reason: 'r1', mxServer: 'mx-a' },
      { status: 'Delivered', date: 't2', reason: 'fallback', mxServer: 'mx-b' }
    ])
  })

  it('getEventReason returns reason, processed message, delivered message and empty default', () => {
    const ctx = { extendedViewValue: [{ originatingIP: '1.2.3.4' }] }

    expect(CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { reason: 'explicit' })).toBe(
      'explicit'
    )
    expect(CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { eventName: 'processed' })).toContain(
      '1.2.3.4'
    )
    expect(CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { eventName: 'delivered' })).toBe(
      'This email was delivered'
    )
    expect(CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { eventName: 'other' })).toBe('')
  })

  it('callForData maps API result and custom fields', async () => {
    CallbackService.getCampaignTabUsers.mockResolvedValueOnce({
      data: {
        data: {
          results: [
            {
              firstName: 'A',
              customFieldValues: [{ name: 'Segment', value: 'VIP' }]
            }
          ],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 3,
          pageNumber: 2
        }
      }
    })

    const ctx = {
      id: 'cmp-1',
      instanceGroup: 2,
      axiosPayload: { orderBy: 'lastSendingTime', ascending: true, filter: {} },
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    await CampaignManagerReportSendingReportTable.methods.callForData.call(ctx)

    expect(CallbackService.getCampaignTabUsers).toHaveBeenCalledWith(
      REPORT_TABS.ALL,
      'cmp-1',
      2,
      expect.objectContaining({ orderBy: 'lastSendingTime' })
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.tableData[0]).toEqual(expect.objectContaining({ Segment: 'VIP' }))
  })

  it('handleOnDetail sets success state and maps response', async () => {
    CallbackService.getUserEmailActivity.mockResolvedValueOnce({ data: { data: { subject: 'S' } } })

    const ctx = {
      extendedViewOptions: { isErrorState: true },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }

    CampaignManagerReportSendingReportTable.methods.handleOnDetail.call(ctx, { resourceId: 'u1' })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(ctx.isShowExtendedView).toBe(true)
    expect(ctx.extendedViewOptions.isErrorState).toBe(false)
    expect(ctx.extendedViewValue).toEqual([{ subject: 'S' }])
    expect(ctx.extendedViewLoading).toBe(false)
  })

  it('handleOnDetail sets error state when api fails', async () => {
    CallbackService.getUserEmailActivity.mockRejectedValueOnce(new Error('fail'))

    const ctx = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }

    CampaignManagerReportSendingReportTable.methods.handleOnDetail.call(ctx, { resourceId: 'u2' })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(ctx.extendedViewOptions.isErrorState).toBe(true)
    expect(ctx.extendedViewValue).toEqual([{}])
    expect(ctx.extendedViewLoading).toBe(false)
  })

  it('exportCampaignManagerReportSendingReportTable maps XLS and triggers link click', async () => {
    const click = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'a') return { click }
      return originalCreateElement(tagName)
    })

    if (!globalThis.URL) globalThis.URL = {}
    if (!globalThis.URL.createObjectURL) globalThis.URL.createObjectURL = jest.fn(() => 'blob:test')
    const createObjectURLSpy = jest.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:test')

    const ctx = {
      id: 'cmp-9',
      instanceGroup: 4,
      axiosPayload: {
        orderBy: 'lastSendingTime',
        ascending: false,
        filter: { Condition: 'AND' }
      }
    }

    CampaignManagerReportSendingReportTable.methods.exportCampaignManagerReportSendingReportTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 50,
      reportAllPages: true
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(CallbackService.exportCampaignTabUsers).toHaveBeenNthCalledWith(
      1,
      REPORT_TABS.ALL,
      'cmp-9',
      4,
      expect.objectContaining({ exportType: 'Excel' })
    )
    expect(CallbackService.exportCampaignTabUsers).toHaveBeenNthCalledWith(
      2,
      REPORT_TABS.ALL,
      'cmp-9',
      4,
      expect.objectContaining({ exportType: 'CSV' })
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('status helpers return expected values', () => {
    const errorRow = { status: 'Error', jobResultMessage: 'SMTP failed' }
    const okRow = { status: 'Delivered' }

    expect(CampaignManagerReportSendingReportTable.methods.getErrorMessage(errorRow)).toBe('SMTP failed')
    expect(CampaignManagerReportSendingReportTable.methods.getErrorMessage(okRow)).toBe('')
    expect(CampaignManagerReportSendingReportTable.methods.getTooltipDisabilityStatus(errorRow)).toBe(false)
    expect(CampaignManagerReportSendingReportTable.methods.getTooltipDisabilityStatus(okRow)).toBe(true)
  })

  it('handleOnResend emits expected payload', () => {
    const ctx = {
      axiosPayload: { filter: { Condition: 'AND' } },
      $emit: jest.fn()
    }

    CampaignManagerReportSendingReportTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['x'],
      true
    )

    expect(ctx.$emit).toHaveBeenCalledWith('on-resend', {
      Types: [REPORT_TABS.ALL],
      items: ['a', 'b'],
      excludedItems: ['x'],
      selectAll: true,
      filter: { Condition: 'AND' }
    })
  })
})

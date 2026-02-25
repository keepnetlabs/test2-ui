import QuishingService from '@/api/quishing'
import CampaignManagerReportSendingReportTable from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable.vue'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserSendingReport: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    searchCampaignJobPrintoutUserSendingReport: jest.fn(() =>
      Promise.resolve({ data: { data: {} } })
    ),
    exportCampaignJobUserSendingReport: jest.fn(() => Promise.resolve({ data: {} })),
    getCampaignJobEmailActivity: jest.fn(() => Promise.resolve({ data: { data: {} } }))
  }
}))

describe('CampaignManagerReportSendingReportTable.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('has expected component name', () => {
    expect(CampaignManagerReportSendingReportTable.name).toBe('CampaignManagerReportSendingReportTable')
  })

  it('getNoEventMessage returns provider-based messages', () => {
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

  it('getEventReason covers explicit, processed, delivered and default branches', () => {
    const ctx = { extendedViewValue: [{ originatingIP: '1.2.3.4' }] }

    expect(CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, { reason: 'explicit' })).toBe(
      'explicit'
    )
    expect(
      CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, {
        eventName: 'processed'
      })
    ).toContain('1.2.3.4')
    expect(
      CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, {
        eventName: 'delivered'
      })
    ).toBe('This email was delivered')
    expect(
      CampaignManagerReportSendingReportTable.methods.getEventReason.call(ctx, {
        eventName: 'other'
      })
    ).toBe('')
  })

  it('callForData (non-printout) maps custom fields and pagination', async () => {
    QuishingService.searchCampaignJobUserSendingReport.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ firstName: 'A', customFieldValues: [{ name: 'Segment', value: 'VIP' }] }],
          totalNumberOfRecords: 10,
          totalNumberOfPages: 3,
          pageNumber: 2
        }
      }
    })

    const ctx = {
      id: 'cmp-1',
      instanceGroup: 2,
      isQuishingTypePrintout: false,
      axiosPayload: { orderBy: 'lastSendingTime', ascending: true, filter: {} },
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportSendingReportTable.methods.callForData.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(QuishingService.searchCampaignJobUserSendingReport).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: 'lastSendingTime' }),
      'cmp-1',
      2
    )
    expect(ctx.serverSideProps.totalNumberOfRecords).toBe(10)
    expect(ctx.tableData[0]).toEqual(expect.objectContaining({ Segment: 'VIP' }))
  })

  it('callForData (printout) switches orderBy to email and keeps raw result rows', async () => {
    QuishingService.searchCampaignJobPrintoutUserSendingReport.mockResolvedValueOnce({
      data: {
        data: {
          results: [{ email: 'a@b.com' }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })

    const ctx = {
      id: 'cmp-p',
      instanceGroup: 1,
      isQuishingTypePrintout: true,
      axiosPayload: { orderBy: 'lastSendingTime', ascending: true, filter: {} },
      setLoading: jest.fn(),
      serverSideProps: {},
      tableData: []
    }

    CampaignManagerReportSendingReportTable.methods.callForData.call(ctx)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(ctx.axiosPayload.orderBy).toBe('email')
    expect(QuishingService.searchCampaignJobPrintoutUserSendingReport).toHaveBeenCalled()
    expect(ctx.tableData).toEqual([{ email: 'a@b.com' }])
  })

  it('setLastSendingStatusItems maps filter values and rerenders filters', () => {
    const statusCol = { property: 'status' }
    const ctx = {
      lastSendingStatusItems: [{ text: 'Delivered' }, { text: 'Error' }],
      tableOptions: { columns: [statusCol] },
      $set: jest.fn((obj, key, value) => {
        obj[key] = value
      }),
      $refs: { refTable: { reRenderFilters: jest.fn() } }
    }
    CampaignManagerReportSendingReportTable.methods.setLastSendingStatusItems.call(ctx)
    expect(ctx.$set).toHaveBeenCalled()
    expect(statusCol.filterableItems).toEqual([
      { text: 'Delivered', value: 'Delivered' },
      { text: 'Error', value: 'Error' }
    ])
    expect(ctx.$refs.refTable.reRenderFilters).toHaveBeenCalled()
  })

  it('handleOnDetail success and error branches set extended view state', async () => {
    QuishingService.getCampaignJobEmailActivity.mockResolvedValueOnce({ data: { data: { subject: 'S' } } })
    const successCtx = {
      extendedViewOptions: { isErrorState: true },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    CampaignManagerReportSendingReportTable.methods.handleOnDetail.call(successCtx, { resourceId: 'u1' })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(successCtx.isShowExtendedView).toBe(true)
    expect(successCtx.extendedViewOptions.isErrorState).toBe(false)
    expect(successCtx.extendedViewValue).toEqual([{ subject: 'S' }])
    expect(successCtx.extendedViewLoading).toBe(false)

    QuishingService.getCampaignJobEmailActivity.mockRejectedValueOnce(new Error('fail'))
    const errorCtx = {
      extendedViewOptions: { isErrorState: false },
      extendedViewLoading: false,
      isShowExtendedView: false,
      extendedViewValue: []
    }
    CampaignManagerReportSendingReportTable.methods.handleOnDetail.call(errorCtx, { resourceId: 'u2' })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(errorCtx.extendedViewOptions.isErrorState).toBe(true)
    expect(errorCtx.extendedViewValue).toEqual([{}])
    expect(errorCtx.extendedViewLoading).toBe(false)
  })

  it('export maps XLS and triggers browser link click', async () => {
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
      axiosPayload: { orderBy: 'lastSendingTime', ascending: false, filter: { Condition: 'AND' } }
    }

    CampaignManagerReportSendingReportTable.methods.exportCampaignManagerReportSendingReportTable.call(ctx, {
      exportTypes: ['XLS', 'CSV'],
      pageNumber: 1,
      pageSize: 50,
      reportAllPages: true
    })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(QuishingService.exportCampaignJobUserSendingReport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ exportType: 'Excel' }),
      'cmp-9',
      4
    )
    expect(QuishingService.exportCampaignJobUserSendingReport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ exportType: 'CSV' }),
      'cmp-9',
      4
    )
    expect(createObjectURLSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(click).toHaveBeenCalledTimes(2)

    createElementSpy.mockRestore()
    createObjectURLSpy.mockRestore()
  })

  it('status/tooltip helpers and resend payload are correct', () => {
    const errorRow = { status: 'Error', jobResultMessage: 'SMTP failed' }
    const okRow = { status: 'Delivered' }
    expect(CampaignManagerReportSendingReportTable.methods.getErrorMessage(errorRow)).toBe('SMTP failed')
    expect(CampaignManagerReportSendingReportTable.methods.getErrorMessage(okRow)).toBe('')
    expect(CampaignManagerReportSendingReportTable.methods.getTooltipDisabilityStatus(errorRow)).toBe(false)
    expect(CampaignManagerReportSendingReportTable.methods.getTooltipDisabilityStatus(okRow)).toBe(true)

    const ctx = { axiosPayload: { filter: { Condition: 'AND' } }, $emit: jest.fn() }
    CampaignManagerReportSendingReportTable.methods.handleOnResend.call(
      ctx,
      [{ resourceId: 'a' }, { resourceId: 'b' }],
      ['x'],
      true
    )
    expect(ctx.$emit).toHaveBeenCalledWith('on-resend', {
      Types: [0],
      items: ['a', 'b'],
      excludedItems: ['x'],
      selectAll: true,
      filter: { Condition: 'AND' }
    })
  })
})

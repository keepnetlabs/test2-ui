import CampaignManagerReportSendingReportTable from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReportTable.vue'
import QuishingService from '@/api/quishing'
import { createCustomFieldColumns } from '@/utils/helperFunctions'

jest.mock('@/api/quishing', () => ({
  __esModule: true,
  default: {
    searchCampaignJobUserSendingReport: jest.fn(),
    searchCampaignJobPrintoutUserSendingReport: jest.fn(),
    exportCampaignJobUserSendingReport: jest.fn(),
    getCampaignJobEmailActivity: jest.fn()
  }
}))

jest.mock('@/utils/helperFunctions', () => ({
  __esModule: true,
  createCustomFieldColumns: jest.fn(() => [{ property: 'customSR', label: 'Custom SR' }])
}))

describe('CampaignManagerReportSendingReportTable.vue (extra)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('watchers early return for printout mode without mutating state', () => {
    const ctx = {
      isQuishingTypePrintout: true,
      setLastSendingStatusItems: jest.fn(),
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    CampaignManagerReportSendingReportTable.watch.lastSendingStatusItems.handler.call(ctx)
    CampaignManagerReportSendingReportTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(ctx.setLastSendingStatusItems).not.toHaveBeenCalled()
    expect(createCustomFieldColumns).not.toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('customFields watcher skips insertion when department index is 0', () => {
    const ctx = {
      isQuishingTypePrintout: false,
      tableOptions: { columns: [{ property: 'department' }, { property: 'email' }] }
    }

    CampaignManagerReportSendingReportTable.watch.customFields.handler.call(ctx, [{ name: 'x' }])

    expect(createCustomFieldColumns).toHaveBeenCalled()
    expect(ctx.tableOptions.columns.map((c) => c.property)).toEqual(['department', 'email'])
  })

  it('getTooltipDisabilityStatus is true for Error rows without jobResultMessage', () => {
    const result = CampaignManagerReportSendingReportTable.methods.getTooltipDisabilityStatus({
      status: 'Error'
    })
    expect(result).toBe(true)
  })

  it('getEvents returns empty array when events payload is missing', () => {
    const result = CampaignManagerReportSendingReportTable.computed.getEvents.call({
      extendedViewValue: [{}],
      getEventReason: jest.fn()
    })
    expect(result).toEqual([])
  })

  it('getNoEventMessage falls back to SMTP message when provider is empty', () => {
    const result = CampaignManagerReportSendingReportTable.computed.getNoEventMessage.call({
      extendedViewValue: [{}]
    })
    expect(result).toBe('Event history is only available for SMTP')
  })
})

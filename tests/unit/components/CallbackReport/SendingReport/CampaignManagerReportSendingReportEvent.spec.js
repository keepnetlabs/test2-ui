import CampaignManagerReportSendingReportEvent from '@/components/CallbackReport/SendingReport/CampaignManagerReportSendingReportEvent.vue'
import { getBtnStatusColor } from '@/utils/functions'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => 'mock-color')
}))

describe('CampaignManagerReportSendingReportEvent.vue', () => {
  it('has expected component name', () => {
    expect(CampaignManagerReportSendingReportEvent.name).toBe('CampaignManagerReportSendingReportEvent')
  })

  it('getBadgeText and getBadgeColor map status', () => {
    const ctx = { item: { status: 'Delivered' } }

    expect(CampaignManagerReportSendingReportEvent.computed.getBadgeText.call(ctx)).toBe('Delivered')
    expect(CampaignManagerReportSendingReportEvent.computed.getBadgeColor.call(ctx)).toBe('mock-color')
    expect(getBtnStatusColor).toHaveBeenCalledWith('Delivered')
  })

  it('getIconName changes with showDetail state', () => {
    expect(CampaignManagerReportSendingReportEvent.computed.getIconName.call({ showDetail: false })).toBe(
      'mdi-chevron-down'
    )
    expect(CampaignManagerReportSendingReportEvent.computed.getIconName.call({ showDetail: true })).toBe(
      'mdi-chevron-up'
    )
  })

  it('getDate returns deferred format with attempt and plain date otherwise', () => {
    const deferredCtx = { item: { status: 'deferred', date: '2026-01-01', attemptNum: 3 } }
    const normalCtx = { item: { status: 'delivered', date: '2026-01-01' } }

    expect(CampaignManagerReportSendingReportEvent.computed.getDate.call(deferredCtx)).toBe(
      '2026-01-01 - Attempt #3'
    )
    expect(CampaignManagerReportSendingReportEvent.computed.getDate.call(normalCtx)).toBe('2026-01-01')
  })

  it('toggleDetail flips detail visibility', () => {
    const ctx = { showDetail: false }

    CampaignManagerReportSendingReportEvent.methods.toggleDetail.call(ctx)
    expect(ctx.showDetail).toBe(true)

    CampaignManagerReportSendingReportEvent.methods.toggleDetail.call(ctx)
    expect(ctx.showDetail).toBe(false)
  })
})

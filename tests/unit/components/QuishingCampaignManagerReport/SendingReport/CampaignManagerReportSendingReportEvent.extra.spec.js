import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReportEvent from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReportEvent.vue'
import { getBtnStatusColor } from '@/utils/functions'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => '#000000')
}))

describe('CampaignManagerReportSendingReportEvent.vue (extra)', () => {
  it('getBadgeColor delegates to getBtnStatusColor', () => {
    const wrapper = shallowMount(CampaignManagerReportSendingReportEvent, {
      propsData: { item: { status: 'processed' } },
      stubs: { Badge: true }
    })

    expect(wrapper.vm.getBadgeColor).toBe('#000000')
    expect(getBtnStatusColor).toHaveBeenCalledWith('processed')
  })

  it('getDate returns raw date when status is not deferred and date is missing', () => {
    const wrapper = shallowMount(CampaignManagerReportSendingReportEvent, {
      propsData: { item: { status: 'delivered' } },
      stubs: { Badge: true }
    })

    expect(wrapper.vm.getDate).toBeUndefined()
  })
})

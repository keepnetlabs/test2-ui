import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReportEvent from '@/components/SmishingReport/SendingReport/CampaignManagerReportSendingReportEvent.vue'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => '#43A047')
}))

describe('SmishingReport SendingReport CampaignManagerReportSendingReportEvent.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(CampaignManagerReportSendingReportEvent, {
      propsData: {
        item: { title: 'Event', status: 'delivered', date: '2024-01-01' },
        ...propsData
      },
      stubs: { Badge: true }
    })
  }

  it('renders', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  describe('getBadgeText', () => {
    it('returns status from item', () => {
      const wrapper = createWrapper({ item: { status: 'bounced' } })
      expect(wrapper.vm.getBadgeText).toBe('bounced')
    })
  })

  describe('getDate', () => {
    it('returns date with attempt when status is deferred', () => {
      const wrapper = createWrapper({
        item: { status: 'deferred', date: '2024-01-15', attemptNum: 3 }
      })
      expect(wrapper.vm.getDate).toBe('2024-01-15 - Attempt #3')
    })

    it('returns date only when status is not deferred', () => {
      const wrapper = createWrapper({
        item: { status: 'delivered', date: '2024-01-15' }
      })
      expect(wrapper.vm.getDate).toBe('2024-01-15')
    })
  })

  describe('toggleDetail', () => {
    it('toggles showDetail', () => {
      const wrapper = createWrapper()
      wrapper.vm.toggleDetail()
      expect(wrapper.vm.showDetail).toBe(true)
    })
  })
})

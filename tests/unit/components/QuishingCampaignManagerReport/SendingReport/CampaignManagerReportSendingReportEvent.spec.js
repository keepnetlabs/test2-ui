import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReportEvent from '@/components/QuishingCampaignManagerReport/SendingReport/CampaignManagerReportSendingReportEvent.vue'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => '#43A047')
}))

describe('QuishingCampaignManagerReport SendingReport CampaignManagerReportSendingReportEvent.vue', () => {
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
      const wrapper = createWrapper({ item: { status: 'delivered' } })
      expect(wrapper.vm.getBadgeText).toBe('delivered')
    })
  })

  describe('getIconName', () => {
    it('returns mdi-chevron-up when showDetail is true', () => {
      const wrapper = createWrapper()
      wrapper.vm.showDetail = true
      expect(wrapper.vm.getIconName).toBe('mdi-chevron-up')
    })

    it('returns mdi-chevron-down when showDetail is false', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.getIconName).toBe('mdi-chevron-down')
    })
  })

  describe('getDate', () => {
    it('returns date with attempt when status is deferred', () => {
      const wrapper = createWrapper({
        item: { status: 'deferred', date: '2024-01-01', attemptNum: 2 }
      })
      expect(wrapper.vm.getDate).toBe('2024-01-01 - Attempt #2')
    })

    it('returns date only when status is not deferred', () => {
      const wrapper = createWrapper({
        item: { status: 'delivered', date: '2024-01-01' }
      })
      expect(wrapper.vm.getDate).toBe('2024-01-01')
    })
  })

  describe('toggleDetail', () => {
    it('toggles showDetail', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.showDetail).toBe(false)
      wrapper.vm.toggleDetail()
      expect(wrapper.vm.showDetail).toBe(true)
      wrapper.vm.toggleDetail()
      expect(wrapper.vm.showDetail).toBe(false)
    })
  })
})

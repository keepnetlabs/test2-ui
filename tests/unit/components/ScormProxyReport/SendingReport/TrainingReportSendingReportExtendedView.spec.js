import { shallowMount } from '@vue/test-utils'
import TrainingReportSendingReportExtendedView from '@/components/ScormProxyReport/SendingReport/TrainingReportSendingReportExtendedView.vue'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => '#43A047')
}))

describe('ScormProxyReport SendingReport TrainingReportSendingReportExtendedView.vue', () => {
  const createWrapper = (propsData = {}) => {
    return shallowMount(TrainingReportSendingReportExtendedView, {
      propsData: {
        item: { title: 'Received By Server', status: 'delivered', date: '2024-01-01' },
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
      const wrapper = createWrapper({ item: { status: 'processed' } })
      expect(wrapper.vm.getBadgeText).toBe('processed')
    })
  })

  describe('getDate', () => {
    it('returns date with attempt when status is deferred', () => {
      const wrapper = createWrapper({
        item: { status: 'deferred', date: '2024-01-01', attemptNum: 1 }
      })
      expect(wrapper.vm.getDate).toBe('2024-01-01 - Attempt #1')
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
      wrapper.vm.toggleDetail()
      expect(wrapper.vm.showDetail).toBe(true)
    })
  })
})

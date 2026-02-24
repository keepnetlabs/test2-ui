import { shallowMount } from '@vue/test-utils'
import TrainingReportSendingReportExtendedView from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportSendingReportExtendedView.vue'

jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => '#1173C1')
}))

describe('TrainingReportSendingReportExtendedView.vue', () => {
  const defaultItem = {
    title: 'Received By Sendgrid',
    status: 'Delivered',
    date: '2024-01-15 10:00',
    reason: 'Email delivered successfully'
  }

  const createWrapper = (propsData = {}) =>
    shallowMount(TrainingReportSendingReportExtendedView, {
      propsData: {
        item: { ...defaultItem },
        ...propsData
      },
      stubs: { Badge: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays item title', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Received By Sendgrid')
  })

  it('displays date', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('2024-01-15 10:00')
  })

  it('getDate returns deferred format when status is deferred', () => {
    const wrapper = createWrapper({
      item: { status: 'deferred', date: '2024-01-01', attemptNum: 2 }
    })
    expect(wrapper.vm.getDate).toContain('Attempt #2')
    expect(wrapper.vm.getDate).toContain('2024-01-01')
  })

  it('getDate returns date when status is not deferred', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getDate).toBe('2024-01-15 10:00')
  })

  it('toggleDetail toggles showDetail', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.showDetail).toBe(false)
    wrapper.vm.toggleDetail()
    expect(wrapper.vm.showDetail).toBe(true)
    wrapper.vm.toggleDetail()
    expect(wrapper.vm.showDetail).toBe(false)
  })

  it('getIconName returns chevron-down when showDetail false', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getIconName).toBe('mdi-chevron-down')
  })

  it('getIconName returns chevron-up when showDetail true', () => {
    const wrapper = createWrapper()
    wrapper.vm.showDetail = true
    expect(wrapper.vm.getIconName).toBe('mdi-chevron-up')
  })

  it('shows reason in detail when showDetail true', async () => {
    const wrapper = createWrapper()
    wrapper.vm.showDetail = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.campaign-manager-sending-report-event__content-detail').exists()).toBe(true)
    expect(wrapper.find('.campaign-manager-sending-report-event__content-detail').text()).toContain(
      'Email delivered successfully'
    )
  })
})

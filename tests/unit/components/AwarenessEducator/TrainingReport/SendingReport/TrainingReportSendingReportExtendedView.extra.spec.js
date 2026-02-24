jest.mock('@/utils/functions', () => ({
  getBtnStatusColor: jest.fn(() => '#09c')
}))

import { shallowMount } from '@vue/test-utils'
import TrainingReportSendingReportExtendedView from '@/components/AwarenessEducator/TrainingReport/SendingReport/TrainingReportSendingReportExtendedView.vue'
import { getBtnStatusColor } from '@/utils/functions'

describe('TrainingReportSendingReportExtendedView.vue (extra)', () => {
  const createWrapper = (item = {}) =>
    shallowMount(TrainingReportSendingReportExtendedView, {
      propsData: {
        item: {
          title: 'Received By mx',
          status: 'processed',
          date: '2026-01-01',
          reason: 'accepted',
          ...item
        }
      },
      stubs: ['v-btn', 'badge', 'v-icon']
    })

  it('computed fields map status/date/color and icon state', async () => {
    const wrapper = createWrapper({ status: 'delivered', date: '2026-02-01' })
    expect(wrapper.vm.getBadgeText).toBe('delivered')
    expect(wrapper.vm.getBadgeColor).toBe('#09c')
    expect(getBtnStatusColor).toHaveBeenCalledWith('delivered')
    expect(wrapper.vm.getDate).toBe('2026-02-01')
    expect(wrapper.vm.getIconName).toBe('mdi-chevron-down')

    wrapper.vm.toggleDetail()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.getIconName).toBe('mdi-chevron-up')
  })

  it('getDate includes attempt number for deferred status', () => {
    const wrapper = createWrapper({
      status: 'deferred',
      date: '2026-03-03',
      attemptNum: 4
    })
    expect(wrapper.vm.getDate).toBe('2026-03-03 - Attempt #4')
  })

  it('toggleDetail flips showDetail state', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.showDetail).toBe(false)
    wrapper.vm.toggleDetail()
    expect(wrapper.vm.showDetail).toBe(true)
    wrapper.vm.toggleDetail()
    expect(wrapper.vm.showDetail).toBe(false)
  })

  it('handles missing reason/status/date values safely', () => {
    const wrapper = createWrapper({ reason: '', status: '', date: '' })
    expect(wrapper.vm.getBadgeText).toBe('')
    expect(wrapper.vm.getBadgeColor).toBe('#09c')
    expect(getBtnStatusColor).toHaveBeenCalledWith('')
    expect(wrapper.vm.getDate).toBe('')
    expect(() => wrapper.vm.toggleDetail()).not.toThrow()
  })

  it('deferred date branch handles missing attempt number value', () => {
    const wrapper = createWrapper({
      status: 'deferred',
      date: '2026-04-04'
    })
    expect(wrapper.vm.getDate).toBe('2026-04-04 - Attempt #undefined')
  })
})

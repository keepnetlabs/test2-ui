jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getBtnStatusColor: jest.fn(() => '#2196f3')
  }
})

import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSendingReportEvent from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReportEvent.vue'
import { getBtnStatusColor } from '@/utils/functions'

describe('CampaignManagerReportSendingReportEvent.vue', () => {
  const mountComponent = (item = {}) =>
    shallowMount(CampaignManagerReportSendingReportEvent, {
      propsData: {
        item: {
          title: 'Event title',
          status: 'deferred',
          date: '2026-02-23',
          attemptNum: 2,
          reason: 'Mailbox full',
          localTime: '10:00',
          ...item
        }
      },
      stubs: { Badge: true, VBtn: true, VIcon: true }
    })

  it('computes badge text/color and date fields', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getBadgeText).toBe('deferred')
    expect(wrapper.vm.getBadgeColor).toBe('#2196f3')
    expect(getBtnStatusColor).toHaveBeenCalledWith('deferred')
    expect(wrapper.vm.getDate).toBe('2026-02-23 - Attempt #2')
    expect(wrapper.vm.getLocalTime).toBe('10:00')
  })

  it('getDate returns plain date when status is not deferred', () => {
    const wrapper = mountComponent({ status: 'successful' })
    expect(wrapper.vm.getDate).toBe('2026-02-23')
  })

  it('toggles detail state and icon name', async () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.showDetail).toBe(true)
    expect(wrapper.vm.getIconName).toBe('mdi-chevron-up')

    wrapper.vm.toggleDetail()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showDetail).toBe(false)
    expect(wrapper.vm.getIconName).toBe('mdi-chevron-down')
  })

  it('initializes detail as hidden when reason is empty', () => {
    const wrapper = mountComponent({ reason: '' })
    expect(wrapper.vm.showDetail).toBe(false)
  })
})

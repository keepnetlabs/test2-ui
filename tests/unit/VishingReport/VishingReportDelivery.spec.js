import { shallowMount } from '@vue/test-utils'
import VishingReportDelivery from '@/components/VishingReport/VishingReportDelivery.vue'

describe('VishingReportDelivery.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportDelivery, {
      propsData: {
        items: {},
        helperData: {
          emailDeliveredUserCount: 8,
          totalTargetUserCount: 10,
          emailErrorUserCount: 2
        },
        ...propsData
      },
      stubs: { CampaignManagerSummaryCard: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('isNotDelivered is true when emailErrorUserCount > 0', () => {
    const wrapper = mountComponent({
      helperData: { emailErrorUserCount: 5 }
    })
    expect(wrapper.vm.isNotDelivered).toBe(true)
  })

  it('isNotDelivered is false when emailErrorUserCount is 0', () => {
    const wrapper = mountComponent({
      helperData: { emailErrorUserCount: 0 }
    })
    expect(wrapper.vm.isNotDelivered).toBe(false)
  })

  it('isNotDelivered is false when helperData undefined', () => {
    const wrapper = mountComponent({ helperData: undefined })
    expect(wrapper.vm.isNotDelivered).toBe(false)
  })

  it('getDeliveryValue formats called count', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getDeliveryValue).toBe('8 / 10 called')
  })

  it('getDeliveryValue uses defaults when helperData empty', () => {
    const wrapper = mountComponent({ helperData: {} })
    expect(wrapper.vm.getDeliveryValue).toBe('0 / 0 called')
  })

  it('getNotDeliveredValue formats error count', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getNotDeliveredValue).toBe('2 not delivered')
  })
})

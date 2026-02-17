import { shallowMount } from '@vue/test-utils'
import Gauge from '@/components/Common/Charts/Gauge.vue'

describe('Common/Charts/Gauge.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(Gauge, {
      propsData,
      stubs: {
        VueGauge: {
          name: 'VueGauge',
          props: ['refid', 'options'],
          template: '<div class="vue-gauge-stub" />'
        }
      }
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('Gauge')
  })

  it('uses generated refId default and default options shape', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.refId.startsWith('gauge-key-')).toBe(true)
    expect(wrapper.vm.options).toEqual(
      expect.objectContaining({
        hasNeedle: true,
        needleColor: '#757575',
        chartWidth: 600
      })
    )
  })

  it('passes props to VueGauge', () => {
    const options = { hasNeedle: false, chartWidth: 320 }
    const wrapper = mountComponent({
      refId: 'gauge-custom-id',
      options
    })
    const gauge = wrapper.findComponent({ name: 'VueGauge' })

    expect(gauge.exists()).toBe(true)
    expect(gauge.props('refid')).toBe('gauge-custom-id')
    expect(gauge.props('options')).toEqual(options)
  })
})


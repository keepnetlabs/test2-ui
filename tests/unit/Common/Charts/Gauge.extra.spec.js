import { shallowMount } from '@vue/test-utils'
import Gauge from '@/components/Common/Charts/Gauge.vue'

describe('Common/Charts/Gauge.vue (extra branch coverage)', () => {
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

  it('uses default refId when not provided', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.refId).toMatch(/^gauge-key-\d+$/)
  })

  it('uses provided refId', () => {
    const wrapper = mountComponent({ refId: 'custom-gauge-id' })
    expect(wrapper.vm.refId).toBe('custom-gauge-id')
  })

  it('uses default options when not provided', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.options).toEqual(
      expect.objectContaining({
        hasNeedle: true,
        needleColor: '#757575',
        arcColors: ['#43A047', '#FBF280', '#E6A23C', '#B6791D', '#B83A3A'],
        arcDelimiters: [20, 40, 60, 80],
        arcPadding: 0,
        arcPaddingColor: 'white',
        arcLabels: ['0', '20', '40', '60', '80', '100'],
        arcLabelFontSize: true,
        arcOverEffect: false,
        rangeLabelFontSize: false,
        chartWidth: 600,
        labelsFont: 'Open Sans'
      })
    )
  })

  it('uses provided options and overrides defaults', () => {
    const customOptions = {
      hasNeedle: false,
      chartWidth: 320,
      needleColor: '#ff0000'
    }
    const wrapper = mountComponent({ options: customOptions })
    expect(wrapper.vm.options).toEqual(customOptions)
  })

  it('refId default function generates unique id when not provided', () => {
    const wrapper1 = mountComponent()
    const wrapper2 = mountComponent()
    expect(wrapper1.vm.refId).toMatch(/^gauge-key-\d+$/)
    expect(wrapper2.vm.refId).toMatch(/^gauge-key-\d+$/)
    expect(wrapper1.vm.refId).not.toBe(wrapper2.vm.refId)
  })

  it('options default function returns full default object when not provided', () => {
    const wrapper = mountComponent()
    const opts = wrapper.vm.options
    expect(opts.arcOverEffect).toBe(false)
    expect(opts.rangeLabelFontSize).toBe(false)
    expect(opts.arcLabelFontSize).toBe(true)
  })

  it('passes refId and options to VueGauge', () => {
    const wrapper = mountComponent({
      refId: 'gauge-123',
      options: { chartWidth: 400 }
    })
    const gauge = wrapper.findComponent({ name: 'VueGauge' })
    expect(gauge.props('refid')).toBe('gauge-123')
    expect(gauge.props('options')).toEqual({ chartWidth: 400 })
  })
})

import { shallowMount } from '@vue/test-utils'
import Gauge from '@/components/Common/Charts/Gauge.vue'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '12345')
}))

describe('Gauge.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(Gauge, {
      propsData: {
        ...propsData
      },
      stubs: { VueGauge: true }
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('Gauge')
  })

  it('uses default refId when not provided', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.refId).toContain('gauge-key-')
  })

  it('uses custom refId when provided', () => {
    const wrapper = createWrapper({ refId: 'my-gauge' })
    expect(wrapper.vm.refId).toBe('my-gauge')
  })

  it('has default options with expected structure', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.options).toHaveProperty('hasNeedle', true)
    expect(wrapper.vm.options).toHaveProperty('needleColor', '#757575')
    expect(wrapper.vm.options.arcColors).toHaveLength(5)
  })
})

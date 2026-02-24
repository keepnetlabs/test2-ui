import { shallowMount } from '@vue/test-utils'
import Pie from '@/components/Common/Charts/Pie.vue'

describe('Pie.vue', () => {
  const createWrapper = (propsData = {}, methods = {}) =>
    shallowMount(Pie, {
      propsData: {
        chartOptions: {},
        data: [10, 20, 30],
        addDataLabelPlugin: false,
        customPlugins: [],
        ...propsData
      },
      methods
    })

  it('renders as Vue component', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('Pie')
  })

  it('attachToDom renders chart with data', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const wrapper = createWrapper(
      { data: [1, 2, 3], chartOptions: {} },
      { addPlugin, renderChart }
    )
    wrapper.vm.attachToDom()
    expect(renderChart).toHaveBeenCalled()
  })
})

import { shallowMount } from '@vue/test-utils'
import Bar from '@/components/Common/Charts/Bar.vue'

describe('Bar.vue', () => {
  const chartData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
  const chartOptions = { responsive: true }

  const createWrapper = (propsData = {}, methods = {}) =>
    shallowMount(Bar, {
      propsData: {
        chartData: null,
        chartOptions: {},
        addDataPlugin: true,
        addCustomLegendLabelHeight: 4,
        customPlugin: [],
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
    expect(wrapper.vm.$options.name).toBe('Bar')
  })

  it('adds plugins and renders chart when chartData provided', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    createWrapper({ chartData, chartOptions }, { addPlugin, renderChart })
    expect(addPlugin).toHaveBeenCalled()
    expect(renderChart).toHaveBeenCalledWith(chartData, chartOptions)
  })

  it('does not render chart when chartData is null', () => {
    const renderChart = jest.fn()
    createWrapper({ chartData: null }, { addPlugin: jest.fn(), renderChart })
    expect(renderChart).not.toHaveBeenCalled()
  })

  it('re-renders when chartData changes', async () => {
    const renderChart = jest.fn()
    const wrapper = createWrapper({ chartData: null }, { addPlugin: jest.fn(), renderChart })
    await wrapper.setProps({ chartData })
    expect(renderChart).toHaveBeenCalledWith(chartData, {})
  })
})

import { shallowMount } from '@vue/test-utils'
import HorizontalBar from '@/components/Common/Charts/HorizontalBar.vue'

describe('HorizontalBar.vue', () => {
  const chartData = { labels: ['X', 'Y'], datasets: [{ data: [15, 25] }] }
  const chartOptions = {}

  const createWrapper = (propsData = {}, methods = {}) =>
    shallowMount(HorizontalBar, {
      propsData: {
        chartData: null,
        chartOptions: {},
        customPlugin: null,
        anotherCustomPlugin: null,
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
    expect(wrapper.vm.$options.name).toBe('HorizontalBar')
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
})

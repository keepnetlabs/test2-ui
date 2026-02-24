import { shallowMount } from '@vue/test-utils'
import Line from '@/components/Common/Charts/Line.vue'

describe('Line.vue', () => {
  const chartData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
  const chartOptions = {}

  const createWrapper = (propsData = {}, methods = {}) =>
    shallowMount(Line, {
      propsData: {
        chartData: null,
        chartOptions: {},
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
    expect(wrapper.vm.$options.name).toBe('Line')
  })

  it('renders chart when chartData provided', () => {
    const renderChart = jest.fn()
    createWrapper({ chartData, chartOptions }, { renderChart })
    expect(renderChart).toHaveBeenCalledWith(chartData, chartOptions)
  })

  it('does not render when chartData null', () => {
    const renderChart = jest.fn()
    createWrapper({ chartData: null }, { renderChart })
    expect(renderChart).not.toHaveBeenCalled()
  })

  it('re-renders when chartData changes', async () => {
    const renderChart = jest.fn()
    const wrapper = createWrapper({ chartData: null }, { renderChart })
    await wrapper.setProps({ chartData })
    expect(renderChart).toHaveBeenCalledWith(chartData, {})
  })
})

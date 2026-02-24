import { shallowMount } from '@vue/test-utils'
import Doughnut from '@/components/Common/Charts/Doughnut.vue'

describe('Common/Charts/Doughnut.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}, methods = {}) =>
    shallowMount(Doughnut, {
      propsData: {
        chartData: null,
        chartOptions: { cutoutPercentage: 80 },
        addDataLabelPlugin: false,
        customPlugins: [],
        ...propsData
      },
      methods
    })

  it('does not add datalabel plugin when addDataLabelPlugin is false', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    mountComponent({ addDataLabelPlugin: false }, { addPlugin, renderChart })
    expect(addPlugin).not.toHaveBeenCalled()
  })

  it('adds single custom plugin when customPlugins has one item', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const plugin = { id: 'single' }
    const chartData = { labels: ['A'], datasets: [{ data: [25] }] }
    mountComponent(
      { chartData, addDataLabelPlugin: false, customPlugins: [plugin] },
      { addPlugin, renderChart }
    )
    expect(addPlugin).toHaveBeenCalledWith(plugin)
    expect(renderChart).toHaveBeenCalledWith(chartData, { cutoutPercentage: 80 })
  })

  it('does not add custom plugins when customPlugins is empty', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const chartData = { labels: ['A'], datasets: [{ data: [25] }] }
    mountComponent(
      { chartData, addDataLabelPlugin: true, customPlugins: [] },
      { addPlugin, renderChart }
    )
    expect(addPlugin).toHaveBeenCalledTimes(1)
    expect(renderChart).toHaveBeenCalledWith(chartData, { cutoutPercentage: 80 })
  })
})

import { shallowMount } from '@vue/test-utils'
import Pie from '@/components/Common/Charts/Pie.vue'

describe('Common/Charts/Pie.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}, methods = {}) =>
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

  it('does not add datalabel plugin when addDataLabelPlugin is false', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    mountComponent({ addDataLabelPlugin: false }, { addPlugin, renderChart })
    expect(addPlugin).not.toHaveBeenCalled()
  })

  it('adds datalabel plugin when addDataLabelPlugin is true', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    mountComponent({ addDataLabelPlugin: true }, { addPlugin, renderChart })
    expect(addPlugin).toHaveBeenCalledTimes(1)
  })

  it('uses showLabels and labels when chartOptions.showLabels is true', () => {
    const renderChart = jest.fn()
    mountComponent(
      {
        chartOptions: {
          showLabels: true,
          labels: ['A', 'B', 'C'],
          backgroundColor: ['#ff0000', '#00ff00', '#0000ff']
        }
      },
      { addPlugin: jest.fn(), renderChart }
    )
    const chartData = renderChart.mock.calls[0][0]
    expect(chartData.labels).toEqual(['A', 'B', 'C'])
    expect(chartData.datasets[0].backgroundColor).toEqual([
      '#ff0000',
      '#00ff00',
      '#0000ff'
    ])
  })

  it('uses undefined labels when chartOptions.showLabels is false', () => {
    const renderChart = jest.fn()
    mountComponent(
      {
        chartOptions: {
          showLabels: false,
          labels: ['A', 'B', 'C']
        }
      },
      { addPlugin: jest.fn(), renderChart }
    )
    const chartData = renderChart.mock.calls[0][0]
    expect(chartData.labels).toBeUndefined()
  })

  it('uses undefined backgroundColor when not in chartOptions', () => {
    const renderChart = jest.fn()
    mountComponent(
      {
        chartOptions: {}
      },
      { addPlugin: jest.fn(), renderChart }
    )
    const chartData = renderChart.mock.calls[0][0]
    expect(chartData.datasets[0].backgroundColor).toBeUndefined()
  })

  it('adds custom plugins via forEach', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const pluginA = { id: 'a' }
    const pluginB = { id: 'b' }
    mountComponent(
      { addDataLabelPlugin: true, customPlugins: [pluginA, pluginB] },
      { addPlugin, renderChart }
    )
    expect(addPlugin).toHaveBeenCalledWith(pluginA)
    expect(addPlugin).toHaveBeenCalledWith(pluginB)
  })
})

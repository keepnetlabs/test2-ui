import { shallowMount } from '@vue/test-utils'
import BarChart from '@/components/Common/Charts/Bar.vue'

describe('Common/Charts/Bar.vue (extra branch coverage)', () => {
  it('does not add ChartDataLabels when addDataPlugin is false', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    shallowMount(BarChart, {
      propsData: {
        chartData: { labels: ['A'], datasets: [{ data: [1] }] },
        chartOptions: {},
        addDataPlugin: false
      },
      methods: { addPlugin, renderChart }
    })
    const pluginCalls = addPlugin.mock.calls.map((c) => c[0])
    expect(pluginCalls).not.toContainEqual(
      expect.objectContaining({ id: expect.any(String) })
    )
    expect(pluginCalls).toHaveLength(1)
    expect(pluginCalls[0]).toHaveProperty('beforeInit')
  })

  it('does not add custom plugins when customPlugin is empty', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    shallowMount(BarChart, {
      propsData: {
        chartData: { labels: ['A'], datasets: [{ data: [1] }] },
        chartOptions: {},
        customPlugin: []
      },
      methods: { addPlugin, renderChart }
    })
    const pluginCalls = addPlugin.mock.calls.map((c) => c[0])
    expect(pluginCalls).toHaveLength(2)
  })

  it('does not render chart when chartData is null', () => {
    const renderChart = jest.fn()
    shallowMount(BarChart, {
      propsData: {
        chartData: null,
        chartOptions: { responsive: true }
      },
      methods: { addPlugin: jest.fn(), renderChart }
    })
    expect(renderChart).not.toHaveBeenCalled()
  })

  it('uses addCustomLegendLabelHeight in plugin', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    shallowMount(BarChart, {
      propsData: {
        chartData: { labels: ['A'], datasets: [{ data: [1] }] },
        chartOptions: {},
        addCustomLegendLabelHeight: 10
      },
      methods: { addPlugin, renderChart }
    })
    const legendHeightPlugin = addPlugin.mock.calls.find(
      (c) => typeof c[0] === 'object' && c[0].beforeInit && !c[0].id
    )?.[0]
    expect(legendHeightPlugin).toBeDefined()
    const mockChart = { legend: { height: 5 } }
    legendHeightPlugin.beforeInit(mockChart, {})
    mockChart.legend.afterFit()
    expect(mockChart.legend.height).toBe(15)
  })
})

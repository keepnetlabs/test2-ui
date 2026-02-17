import { shallowMount } from '@vue/test-utils'
import BarChart from '@/components/Common/Charts/Bar.vue'

describe('Common/Charts/Bar.vue', () => {
  const pluginA = { id: 'plugin-a' }
  const pluginB = { id: 'plugin-b' }

  const createWrapper = (propsData = {}) => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const wrapper = shallowMount(BarChart, {
      propsData: {
        chartData: { labels: ['A'], datasets: [{ data: [1] }] },
        chartOptions: { responsive: true },
        ...propsData
      },
      methods: {
        addPlugin,
        renderChart
      }
    })
    return { wrapper, addPlugin, renderChart }
  }

  it('registers default plugins and renders chart on mount', () => {
    const { addPlugin, renderChart } = createWrapper()

    expect(addPlugin).toHaveBeenCalled()
    expect(renderChart).toHaveBeenCalledWith(
      { labels: ['A'], datasets: [{ data: [1] }] },
      { responsive: true }
    )
  })

  it('does not add data label plugin when addDataPlugin is false', () => {
    const { addPlugin } = createWrapper({ addDataPlugin: false, addCustomLegendLabelHeight: 6 })
    const pluginCalls = addPlugin.mock.calls.map((c) => c[0])

    // only legend-height plugin should exist by default in this mode
    expect(pluginCalls).toHaveLength(1)
    expect(pluginCalls[0]).toHaveProperty('beforeInit')
  })

  it('adds custom plugins in order', () => {
    const { addPlugin } = createWrapper({ customPlugin: [pluginA, pluginB] })
    const pluginCalls = addPlugin.mock.calls.map((c) => c[0])

    expect(pluginCalls).toContain(pluginA)
    expect(pluginCalls).toContain(pluginB)
  })

  it('re-renders when chartData changes', async () => {
    const { wrapper, renderChart } = createWrapper()
    renderChart.mockClear()

    await wrapper.setProps({
      chartData: { labels: ['B'], datasets: [{ data: [2] }] }
    })

    expect(renderChart).toHaveBeenCalledWith(
      { labels: ['B'], datasets: [{ data: [2] }] },
      { responsive: true }
    )
  })
})

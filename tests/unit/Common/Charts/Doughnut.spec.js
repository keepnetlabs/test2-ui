import { shallowMount } from '@vue/test-utils'
import Doughnut from '@/components/Common/Charts/Doughnut.vue'

describe('Common/Charts/Doughnut.vue', () => {
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

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('Doughnut')
  })

  it('adds datalabel and custom plugins, then renders chart on mount', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const chartData = { labels: ['A'], datasets: [{ data: [25] }] }
    const customA = { id: 'plugin-a' }
    const customB = { id: 'plugin-b' }

    mountComponent(
      {
        chartData,
        addDataLabelPlugin: true,
        customPlugins: [customA, customB]
      },
      { addPlugin, renderChart }
    )

    expect(addPlugin).toHaveBeenCalledTimes(3)
    expect(addPlugin).toHaveBeenCalledWith(customA)
    expect(addPlugin).toHaveBeenCalledWith(customB)
    expect(renderChart).toHaveBeenCalledWith(chartData, { cutoutPercentage: 80 })
  })

  it('does not render chart on mount when chartData is missing', () => {
    const renderChart = jest.fn()

    mountComponent({ chartData: null }, { addPlugin: jest.fn(), renderChart })

    expect(renderChart).not.toHaveBeenCalled()
  })

  it('re-renders when chartData changes', async () => {
    const renderChart = jest.fn()
    const wrapper = mountComponent({ chartData: null }, { addPlugin: jest.fn(), renderChart })
    const nextData = { labels: ['B'], datasets: [{ data: [50] }] }

    await wrapper.setProps({ chartData: nextData })

    expect(renderChart).toHaveBeenCalledWith(nextData, { cutoutPercentage: 80 })
  })
})


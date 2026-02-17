import { shallowMount } from '@vue/test-utils'
import Line from '@/components/Common/Charts/Line.vue'

describe('Common/Charts/Line.vue', () => {
  const mountComponent = (propsData = {}, methods = {}) =>
    shallowMount(Line, {
      propsData: {
        chartData: null,
        chartOptions: { responsive: true },
        ...propsData
      },
      methods
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('Line')
  })

  it('renders chart on mount when chartData exists', () => {
    const renderChart = jest.fn()
    const chartData = { labels: ['A'], datasets: [{ data: [10] }] }

    mountComponent({ chartData }, { renderChart })

    expect(renderChart).toHaveBeenCalledWith(chartData, { responsive: true })
  })

  it('does not render chart on mount when chartData is missing', () => {
    const renderChart = jest.fn()

    mountComponent({ chartData: null }, { renderChart })

    expect(renderChart).not.toHaveBeenCalled()
  })

  it('re-renders when chartData changes', async () => {
    const renderChart = jest.fn()
    const wrapper = mountComponent({ chartData: null }, { renderChart })
    const newChartData = { labels: ['B'], datasets: [{ data: [20] }] }

    await wrapper.setProps({ chartData: newChartData })

    expect(renderChart).toHaveBeenCalledWith(newChartData, { responsive: true })
  })
})


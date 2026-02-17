import { shallowMount } from '@vue/test-utils'
import Bubble from '@/components/Common/Charts/Bubble.vue'

describe('Common/Charts/Bubble.vue', () => {
  const mountComponent = (propsData = {}, methods = {}) =>
    shallowMount(Bubble, {
      propsData: {
        chartOptions: { maintainAspectRatio: true },
        data: [{ data: [{ x: 10, y: 20, r: 5 }] }],
        ...propsData
      },
      methods
    })

  it('has expected component name', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('Bubble')
  })

  it('adds datalabel plugin and renders datasets on mount', () => {
    const addPlugin = jest.fn()
    const renderChart = jest.fn()
    const datasets = [{ data: [{ x: 1, y: 2, r: 7 }] }]

    mountComponent({ data: datasets }, { addPlugin, renderChart })

    expect(addPlugin).toHaveBeenCalledTimes(1)
    expect(renderChart).toHaveBeenCalledWith(
      { datasets },
      expect.objectContaining({
        responsive: true,
        maintainAspectRatio: true
      })
    )
  })

  it('keeps datalabel formatter that rounds bubble radius', () => {
    const renderChart = jest.fn()
    mountComponent({}, { addPlugin: jest.fn(), renderChart })
    const options = renderChart.mock.calls[0][1]

    expect(options.plugins.datalabels.formatter({ r: 4.6 })).toBe(5)
    expect(options.plugins.datalabels.color).toBe('#575757')
  })
})


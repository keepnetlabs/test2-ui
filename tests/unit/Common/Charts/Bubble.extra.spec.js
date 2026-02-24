import { shallowMount } from '@vue/test-utils'
import Bubble from '@/components/Common/Charts/Bubble.vue'

describe('Common/Charts/Bubble.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}, methods = {}) =>
    shallowMount(Bubble, {
      propsData: {
        chartOptions: {},
        data: [{ data: [{ x: 10, y: 20, r: 5 }] }],
        ...propsData
      },
      methods
    })

  it('datalabel formatter rounds down', () => {
    const renderChart = jest.fn()
    mountComponent({}, { addPlugin: jest.fn(), renderChart })
    const formatter = renderChart.mock.calls[0][1].plugins.datalabels.formatter
    expect(formatter({ r: 4.2 })).toBe(4)
  })

  it('datalabel formatter rounds up', () => {
    const renderChart = jest.fn()
    mountComponent({}, { addPlugin: jest.fn(), renderChart })
    const formatter = renderChart.mock.calls[0][1].plugins.datalabels.formatter
    expect(formatter({ r: 4.8 })).toBe(5)
  })

  it('merges chartOptions into options', () => {
    const renderChart = jest.fn()
    mountComponent(
      { chartOptions: { maintainAspectRatio: false, customOption: true } },
      { addPlugin: jest.fn(), renderChart }
    )
    const options = renderChart.mock.calls[0][1]
    expect(options.maintainAspectRatio).toBe(false)
    expect(options.customOption).toBe(true)
    expect(options.responsive).toBe(true)
  })
})

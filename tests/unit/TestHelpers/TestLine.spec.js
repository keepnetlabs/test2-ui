import { shallowMount } from '@vue/test-utils'
import TestLine from '@/components/TestHelpers/TestLine.vue'

describe('TestLine.vue', () => {
  it('renders line chart component with chart props', () => {
    const wrapper = shallowMount(TestLine, {
      stubs: {
        'line-chart': {
          name: 'line-chart',
          props: ['chartData', 'chartOptions'],
          template: '<div class="line-chart-stub"></div>'
        }
      }
    })

    expect(wrapper.vm.$options.name).toBe('TestLine')
    const lineChart = wrapper.findComponent({ name: 'line-chart' })
    expect(lineChart.exists()).toBe(true)
    expect(lineChart.props('chartData')).toEqual({})
    expect(lineChart.props('chartOptions')).toEqual({})
  })
})

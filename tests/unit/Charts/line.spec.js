import { createLocalVue, mount } from '@vue/test-utils'
import TestLine from '@/components/TestHelpers/TestLine'
import 'jest-canvas-mock'

describe('Line component', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const wrapper = mount(TestLine, { localVue })
    //checking component rendered
    expect(wrapper.find('#line-chart').exists()).toBe(true)
    //checking subclass
    expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
  })

  it('Check props', () => {
    const wrapper = mount(TestLine, { localVue })

    //checking props

    expect(wrapper.vm['chartOptions']).toBeTruthy()

    expect(wrapper.vm['chartData']).toBeTruthy()
  })
})

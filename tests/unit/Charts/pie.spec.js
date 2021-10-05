import { createLocalVue, mount } from '@vue/test-utils'
import TestPie from '@/components/TestHelpers/TestPie'
import 'jest-canvas-mock'

describe('Pie component', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const wrapper = mount(TestPie, { localVue })
    //checking component rendered
    expect(wrapper.find('#pie-chart').exists()).toBe(true)
    //checking subclass
    expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
  })

  it('Check props', () => {
    const wrapper = mount(TestPie, { localVue })

    //checking props

    expect(wrapper.vm['chartOptions']).toBeTruthy()

    expect(wrapper.vm['series']).toBeTruthy()
  })
})

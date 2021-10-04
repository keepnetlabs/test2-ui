import { createLocalVue, mount } from '@vue/test-utils'
import TestBubble from '@/components/TestHelpers/TestBubble'
import 'jest-canvas-mock'

describe('MFA Login component', () => {
  const localVue = createLocalVue()
  it('Check render', () => {
    const wrapper = mount(TestBubble, { localVue })
    //checking component rendered
    expect(wrapper.find('#bubble-chart').exists()).toBe(true)
    //checking subclass
    expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
  })

  it('Check props', () => {
    const wrapper = mount(TestBubble, { localVue })

    //checking props

    expect(wrapper.vm['chartOptions']).toBeTruthy()

    expect(wrapper.vm['chartData']).toBeTruthy()
  })
})

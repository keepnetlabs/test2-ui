import { createLocalVue, mount } from '@vue/test-utils'
import TestBubble from '@/components/TestHelpers/TestBubble'
import 'jest-canvas-mock'

describe('Bubble component', () => {
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

  it('Chart has correct data structure', () => {
    const wrapper = mount(TestBubble, { localVue })
    expect(wrapper.vm.chartOptions).toHaveProperty('responsive')
    expect(wrapper.vm.chartData).toBeInstanceOf(Object)
  })

  it('Chart element renders with correct ID', () => {
    const wrapper = mount(TestBubble, { localVue })
    const chartElement = wrapper.find('#bubble-chart')
    expect(chartElement.exists()).toBe(true)
    expect(chartElement.element.id).toBe('bubble-chart')
  })

  it('Canvas rendering monitor is present', () => {
    const wrapper = mount(TestBubble, { localVue })
    expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('chartOptions has responsive setting', () => {
    const wrapper = mount(TestBubble, { localVue })
    expect(wrapper.vm.chartOptions).toHaveProperty('responsive')
    expect(typeof wrapper.vm.chartOptions.responsive).toBe('boolean')
  })

  it('chartData is properly structured', () => {
    const wrapper = mount(TestBubble, { localVue })
    expect(wrapper.vm.chartData).toBeInstanceOf(Object)
    expect(Object.keys(wrapper.vm.chartData).length).toBeGreaterThan(0)
  })

  it('canvas element is rendered and visible', () => {
    const wrapper = mount(TestBubble, { localVue })
    const canvas = wrapper.find('canvas')
    expect(canvas.exists()).toBe(true)
    expect(canvas.element).toBeDefined()
  })

  it('chart container has correct class names', () => {
    const wrapper = mount(TestBubble, { localVue })
    const chartElement = wrapper.find('#bubble-chart')
    const classes = chartElement.classes()
    expect(classes).toContain('chartjs-render-monitor')
  })
})

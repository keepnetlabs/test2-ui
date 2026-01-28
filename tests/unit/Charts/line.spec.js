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

  it('Chart has correct data structure', () => {
    const wrapper = mount(TestLine, { localVue })
    expect(wrapper.vm.chartOptions).toHaveProperty('responsive')
    expect(wrapper.vm.chartData).toBeInstanceOf(Object)
  })

  it('Chart canvas element exists', () => {
    const wrapper = mount(TestLine, { localVue })
    expect(wrapper.find('canvas').exists()).toBe(true)
    expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
  })

  it('Chart container is properly initialized', () => {
    const wrapper = mount(TestLine, { localVue })
    const chartElement = wrapper.find('#line-chart')
    expect(chartElement.element).toBeDefined()
    expect(chartElement.element.className).toContain('chartjs-render-monitor')
  })

  it('chartOptions contains responsive configuration', () => {
    const wrapper = mount(TestLine, { localVue })
    expect(wrapper.vm.chartOptions).toHaveProperty('responsive')
    expect(wrapper.vm.chartOptions.responsive).toBe(true)
  })

  it('chartData is valid object structure', () => {
    const wrapper = mount(TestLine, { localVue })
    expect(wrapper.vm.chartData).toBeInstanceOf(Object)
    expect(Object.keys(wrapper.vm.chartData).length).toBeGreaterThan(0)
  })

  it('chart element exists with correct ID', () => {
    const wrapper = mount(TestLine, { localVue })
    const chartElement = wrapper.find('#line-chart')
    expect(chartElement.exists()).toBe(true)
    expect(chartElement.element.id).toBe('line-chart')
  })

  it('chartjs render monitor is visible', () => {
    const wrapper = mount(TestLine, { localVue })
    const monitor = wrapper.find('.chartjs-render-monitor')
    expect(monitor.exists()).toBe(true)
    expect(monitor.isVisible()).toBe(true)
  })
})

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

  it('Chart has correct data structure', () => {
    const wrapper = mount(TestPie, { localVue })
    expect(wrapper.vm.chartOptions).toHaveProperty('responsive')
    expect(wrapper.vm.series).toBeInstanceOf(Array)
  })

  it('Chart is mounted and visible', () => {
    const wrapper = mount(TestPie, { localVue })
    expect(wrapper.find('canvas').exists()).toBe(true)
    expect(wrapper.find('.chartjs-render-monitor').isVisible()).toBe(true)
  })

  it('Component has required chart container', () => {
    const wrapper = mount(TestPie, { localVue })
    const chartElement = wrapper.find('#pie-chart')
    expect(chartElement.element).toBeDefined()
    expect(chartElement.element.tagName).toBe('DIV')
  })

  it('chartOptions has responsive property', () => {
    const wrapper = mount(TestPie, { localVue })
    expect(wrapper.vm.chartOptions).toHaveProperty('responsive')
    expect(typeof wrapper.vm.chartOptions.responsive).toBe('boolean')
  })

  it('series data is array format', () => {
    const wrapper = mount(TestPie, { localVue })
    expect(Array.isArray(wrapper.vm.series)).toBe(true)
    expect(wrapper.vm.series.length).toBeGreaterThanOrEqual(0)
  })

  it('chart element has correct ID attribute', () => {
    const wrapper = mount(TestPie, { localVue })
    const chartElement = wrapper.find('#pie-chart')
    expect(chartElement.attributes('id')).toBe('pie-chart')
  })

  it('chartjs render monitor class is present', () => {
    const wrapper = mount(TestPie, { localVue })
    const monitor = wrapper.find('.chartjs-render-monitor')
    expect(monitor.exists()).toBe(true)
    expect(monitor.classes()).toContain('chartjs-render-monitor')
  })
})

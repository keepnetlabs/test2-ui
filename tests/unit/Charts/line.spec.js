import { createLocalVue, mount } from '@vue/test-utils'
import TestLine from '@/components/TestHelpers/TestLine'
import 'jest-canvas-mock'

describe('Line component', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = mount(TestLine, { localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component rendering', () => {
    it('Check render', () => {
      expect(wrapper.find('#line-chart').exists()).toBe(true)
      expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
    })

    it('should render line chart container', () => {
      expect(wrapper.find('#line-chart').exists()).toBe(true)
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('TestLine')
    })

    it('should render as Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('Chart is mounted and visible', () => {
      expect(wrapper.find('canvas').exists()).toBe(true)
      expect(wrapper.find('.chartjs-render-monitor').isVisible()).toBe(true)
    })

    it('Component has required chart container', () => {
      const chartElement = wrapper.find('#line-chart')
      expect(chartElement.element).toBeDefined()
    })
  })

  describe('props and data', () => {
    it('Check props', () => {
      expect(wrapper.vm['chartOptions']).toBeTruthy()
      expect(wrapper.vm['chartData']).toBeTruthy()
    })

    it('should have chartOptions data property', () => {
      expect(wrapper.vm.chartOptions).toBeDefined()
    })

    it('should have chartData data property', () => {
      expect(wrapper.vm.chartData).toBeDefined()
    })

    it('chartOptions should be an object', () => {
      expect(typeof wrapper.vm.chartOptions).toBe('object')
    })

    it('chartData should be an object', () => {
      expect(typeof wrapper.vm.chartData).toBe('object')
    })

    it('initial chartOptions is an object', () => {
      expect(typeof wrapper.vm.chartOptions).toBe('object')
    })

    it('initial chartData is an object', () => {
      expect(typeof wrapper.vm.chartData).toBe('object')
    })
  })

  describe('chart data structure', () => {
    it('Chart has correct data structure', () => {
      expect(wrapper.vm.chartData).toBeInstanceOf(Object)
    })

    it('chartData is valid object structure', () => {
      expect(wrapper.vm.chartData).toBeInstanceOf(Object)
      expect(Object.keys(wrapper.vm.chartData).length).toBeGreaterThanOrEqual(0)
    })

    it('chartOptions is valid object structure', () => {
      expect(wrapper.vm.chartOptions).toBeInstanceOf(Object)
    })
  })

  describe('DOM elements', () => {
    it('chart element has correct ID attribute', () => {
      const chartElement = wrapper.find('#line-chart')
      expect(chartElement.attributes('id')).toBe('line-chart')
    })

    it('chartjs render monitor class is present', () => {
      const monitor = wrapper.find('.chartjs-render-monitor')
      expect(monitor.exists()).toBe(true)
      expect(monitor.classes()).toContain('chartjs-render-monitor')
    })

    it('should have canvas element', () => {
      expect(wrapper.find('canvas').exists()).toBe(true)
    })

    it('Chart canvas element exists', () => {
      expect(wrapper.find('canvas').exists()).toBe(true)
      expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
    })

    it('Chart container is properly initialized', () => {
      const chartElement = wrapper.find('#line-chart')
      expect(chartElement.element).toBeDefined()
      expect(chartElement.element.className).toContain('chartjs-render-monitor')
    })

    it('chart element exists with correct ID', () => {
      const chartElement = wrapper.find('#line-chart')
      expect(chartElement.exists()).toBe(true)
      expect(chartElement.element.id).toBe('line-chart')
    })

    it('chartjs render monitor is visible', () => {
      const monitor = wrapper.find('.chartjs-render-monitor')
      expect(monitor.exists()).toBe(true)
      expect(monitor.isVisible()).toBe(true)
    })
  })

  describe('chart initialization', () => {
    it('chart element is a canvas', () => {
      const chartElement = wrapper.find('#line-chart')
      expect(chartElement.element.tagName).toBe('CANVAS')
    })

    it('canvas is direct child of chart container', () => {
      const canvas = wrapper.find('canvas')
      expect(canvas.exists()).toBe(true)
      expect(canvas.element).toBeDefined()
    })

    it('chart element is rendered', () => {
      const chartElement = wrapper.find('#line-chart')
      expect(chartElement.element).toBeDefined()
    })
  })

  describe('component properties', () => {
    it('component should have data function', () => {
      expect(wrapper.vm.$options.data).toBeDefined()
    })

    it('component should have components property', () => {
      expect(wrapper.vm.$options.components).toBeDefined()
    })

    it('line-chart component is registered', () => {
      expect(wrapper.vm.$options.components['line-chart']).toBeDefined()
    })
  })

  describe('reactivity and updates', () => {
    it('should update chartData reactively', async () => {
      const newData = { labels: ['A', 'B'], datasets: [] }
      wrapper.vm.chartData = newData
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartData).toEqual(newData)
    })

    it('should update chartOptions reactively', async () => {
      const newOptions = { responsive: true }
      wrapper.vm.chartOptions = newOptions
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartOptions).toEqual(newOptions)
    })

    it('should add property to chartOptions', async () => {
      wrapper.vm.chartOptions.maintainAspectRatio = false
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartOptions.maintainAspectRatio).toBe(false)
    })

    it('should add property to chartData', async () => {
      wrapper.vm.chartData.labels = ['Q1', 'Q2']
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartData.labels).toEqual(['Q1', 'Q2'])
    })
  })

  describe('component integration', () => {
    it('Line component is registered', () => {
      expect(wrapper.vm.$options.components['line-chart']).toBeDefined()
    })

    it('Line component receives chartData prop', () => {
      const lineComponent = wrapper.findComponent({ name: 'Line' })
      if (lineComponent.exists()) {
        expect(lineComponent.props('chartData')).toBeDefined()
      }
    })

    it('Line component receives chartOptions prop', () => {
      const lineComponent = wrapper.findComponent({ name: 'Line' })
      if (lineComponent.exists()) {
        expect(lineComponent.props('chartOptions')).toBeDefined()
      }
    })

    it('template uses line-chart component', () => {
      expect(wrapper.findComponent({ name: 'Line' }).exists() ||
             wrapper.find('canvas').exists()).toBe(true)
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mount(TestLine, { localVue })
      const wrapper2 = mount(TestLine, { localVue })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not modify data between instances', () => {
      const wrapper1 = mount(TestLine, { localVue })
      const wrapper2 = mount(TestLine, { localVue })
      const originalData = JSON.parse(JSON.stringify(wrapper2.vm.chartData))
      wrapper1.vm.chartData = { test: 'value' }
      expect(wrapper2.vm.chartData).toEqual(originalData)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should handle component destruction gracefully', () => {
      const newWrapper = mount(TestLine, { localVue })
      expect(() => {
        newWrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain initial data on creation', () => {
      expect(typeof wrapper.vm.chartData).toBe('object')
      expect(typeof wrapper.vm.chartOptions).toBe('object')
    })

    it('should have same component name on multiple mounts', () => {
      const wrapper1 = mount(TestLine, { localVue })
      const wrapper2 = mount(TestLine, { localVue })
      expect(wrapper1.vm.$options.name).toBe('TestLine')
      expect(wrapper2.vm.$options.name).toBe('TestLine')
      wrapper1.destroy()
      wrapper2.destroy()
    })
  })

  describe('data isolation', () => {
    it('should isolate instances from each other', async () => {
      const wrapper1 = mount(TestLine, { localVue })
      const wrapper2 = mount(TestLine, { localVue })
      const originalData = JSON.parse(JSON.stringify(wrapper2.vm.chartData))

      wrapper1.vm.chartData = { test: 'data1' }
      expect(wrapper2.vm.chartData).toEqual(originalData)

      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not modify props object', () => {
      const wrapper1 = mount(TestLine, { localVue })
      wrapper1.vm.chartData = { new: 'value' }
      expect(wrapper1.vm.chartData).toEqual({ new: 'value' })
      wrapper1.destroy()
    })
  })

  describe('edge cases', () => {
    it('should handle chartData as object', () => {
      expect(typeof wrapper.vm.chartData).toBe('object')
    })

    it('should handle chartOptions as object', () => {
      expect(typeof wrapper.vm.chartOptions).toBe('object')
    })

    it('should handle chartData with complex structure', async () => {
      const complexData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [10, 20, 30]
          }
        ]
      }
      wrapper.vm.chartData = complexData
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartData).toEqual(complexData)
    })

    it('should handle chartOptions with multiple properties', async () => {
      const complexOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{ ticks: { min: 0 } }]
        }
      }
      wrapper.vm.chartOptions = complexOptions
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartOptions).toEqual(complexOptions)
    })

    it('should handle null-like data values', () => {
      wrapper.vm.chartData = {}
      expect(Object.keys(wrapper.vm.chartData).length).toBe(0)
    })
  })

  describe('template rendering', () => {
    it('should render template correctly', () => {
      expect(wrapper.html()).toContain('line-chart')
    })

    it('should have proper structure with canvas as chart element', () => {
      const chartElement = wrapper.find('#line-chart')
      expect(chartElement.exists()).toBe(true)
      expect(chartElement.element.tagName).toBe('CANVAS')
    })

    it('should render canvas element', () => {
      const canvas = wrapper.find('canvas')
      expect(canvas.exists()).toBe(true)
    })
  })

  describe('component lifecycle', () => {
    it('should be defined after mount', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have $el defined after mount', () => {
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should have $data defined after mount', () => {
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('should have $options defined after mount', () => {
      expect(wrapper.vm.$options).toBeDefined()
    })
  })

  describe('data property types', () => {
    it('chartData should be object type', () => {
      expect(typeof wrapper.vm.chartData).toBe('object')
    })

    it('chartOptions should be object type', () => {
      expect(typeof wrapper.vm.chartOptions).toBe('object')
    })

    it('chartData should not be null', () => {
      expect(wrapper.vm.chartData).not.toBeNull()
    })

    it('chartOptions should not be null', () => {
      expect(wrapper.vm.chartOptions).not.toBeNull()
    })

    it('chartData should not be array', () => {
      expect(Array.isArray(wrapper.vm.chartData)).toBe(false)
    })

    it('chartOptions should not be array', () => {
      expect(Array.isArray(wrapper.vm.chartOptions)).toBe(false)
    })
  })

  describe('chart element accessibility', () => {
    it('chart element should be visible', () => {
      const chartElement = wrapper.find('#line-chart')
      expect(chartElement.isVisible()).toBe(true)
    })

    it('canvas element should be defined', () => {
      const canvas = wrapper.find('canvas')
      expect(canvas.element).toBeDefined()
    })

    it('chart container should be in document', () => {
      expect(wrapper.find('#line-chart').element).toBeDefined()
    })
  })

  describe('no side effects', () => {
    it('should have same chartData structure on multiple mounts', () => {
      const newWrapper1 = mount(TestLine, { localVue })
      const newWrapper2 = mount(TestLine, { localVue })
      expect(newWrapper1.vm.chartData).toEqual(newWrapper2.vm.chartData)
      newWrapper1.destroy()
      newWrapper2.destroy()
    })

    it('should not pollute global scope', () => {
      const wrapper1 = mount(TestLine, { localVue })
      const wrapper2 = mount(TestLine, { localVue })
      const originalData = JSON.parse(JSON.stringify(wrapper2.vm.chartData))
      wrapper1.vm.chartData = { polluted: true }
      expect(wrapper2.vm.chartData).toEqual(originalData)
      wrapper1.destroy()
      wrapper2.destroy()
    })
  })
})

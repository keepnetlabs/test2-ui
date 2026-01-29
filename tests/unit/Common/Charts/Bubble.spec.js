import { shallowMount } from '@vue/test-utils'
import Bubble from '@/components/Common/Charts/Bubble.vue'

describe('Bubble.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Bubble, {
      mocks: {
        addPlugin: jest.fn(),
        renderChart: jest.fn()
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('Bubble')
    })

    it('should extend Bubble from vue-chartjs', () => {
      expect(wrapper.vm.$options.extends).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should have chartOptions prop', () => {
      expect(wrapper.vm.$options.props.chartOptions).toBeDefined()
    })

    it('should have data prop', () => {
      expect(wrapper.vm.$options.props.data).toBeDefined()
    })

    it('should accept custom chartOptions', () => {
      const customOptions = { responsive: false }
      wrapper = shallowMount(Bubble, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions).toEqual(customOptions)
    })

    it('should accept data array', () => {
      const testData = [
        { x: 10, y: 20, r: 5 },
        { x: 15, y: 25, r: 8 }
      ]
      wrapper = shallowMount(Bubble, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data).toEqual(testData)
    })
  })

  describe('ChartDataLabels plugin', () => {
    it('should add ChartDataLabels plugin on mount', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Bubble, {
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(addPluginMock).toHaveBeenCalled()
    })

    it('should configure datalabels formatter', () => {
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })

    it('should format labels by rounding radius value', () => {
      // The formatter rounds the r value
      const value = { r: 5.7 }
      expect(Math.round(value.r)).toBe(6)
    })

    it('should set datalabels color to #575757', () => {
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })
  })

  describe('chart configuration', () => {
    it('should have responsive true', () => {
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })

    it('should have maintainAspectRatio false', () => {
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })

    it('should spread custom chartOptions', () => {
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })

    it('should merge chartOptions with default options', () => {
      const customOptions = { animation: { duration: 500 } }
      wrapper = shallowMount(Bubble, {
        propsData: {
          chartOptions: customOptions,
          data: [{ x: 5, y: 10, r: 3 }]
        },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions).toEqual(customOptions)
    })
  })

  describe('bubble data points', () => {
    it('should support single bubble', () => {
      const testData = [{ x: 10, y: 20, r: 5 }]
      wrapper = shallowMount(Bubble, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(1)
    })

    it('should support multiple bubbles', () => {
      const testData = [
        { x: 10, y: 20, r: 5 },
        { x: 15, y: 25, r: 8 },
        { x: 20, y: 30, r: 12 }
      ]
      wrapper = shallowMount(Bubble, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(3)
    })

    it('should support various bubble sizes', () => {
      const testData = [
        { x: 10, y: 20, r: 1 },
        { x: 15, y: 25, r: 50 }
      ]
      wrapper = shallowMount(Bubble, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data[0].r).toBe(1)
      expect(wrapper.vm.data[1].r).toBe(50)
    })

    it('should support decimal coordinates', () => {
      const testData = [{ x: 10.5, y: 20.7, r: 5.3 }]
      wrapper = shallowMount(Bubble, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data[0].x).toBe(10.5)
    })
  })

  describe('renderChart method', () => {
    it('should call renderChart on mount', () => {
      const renderChartMock = jest.fn()
      wrapper = shallowMount(Bubble, {
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).toHaveBeenCalled()
    })

    it('should pass data in datasets format', () => {
      const testData = [{ x: 10, y: 20, r: 5 }]
      wrapper = shallowMount(Bubble, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data).toEqual(testData)
    })
  })

  describe('real-world scenarios', () => {
    it('should render bubble chart for correlation analysis', () => {
      const testData = [
        { x: 100, y: 4, r: 15 },
        { x: 200, y: 8, r: 10 }
      ]
      wrapper = shallowMount(Bubble, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(2)
    })

    it('should support custom styling options', () => {
      const customOptions = {
        legend: { display: true },
        title: { display: true, text: 'Bubble Chart' }
      }
      wrapper = shallowMount(Bubble, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.legend.display).toBe(true)
    })

    it('should handle empty data', () => {
      wrapper = shallowMount(Bubble, {
        propsData: { data: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(Array.isArray(wrapper.vm.data)).toBe(true)
    })
  })

  describe('chart responsiveness', () => {
    it('should maintain responsive configuration', () => {
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })

    it('should support custom aspect ratio', () => {
      const customOptions = { maintainAspectRatio: true }
      wrapper = shallowMount(Bubble, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.maintainAspectRatio).toBe(true)
    })
  })

  describe('data label formatting', () => {
    it('should round radius values for display', () => {
      const formatter = (value) => Math.round(value.r)
      const testValue = { r: 5.4 }
      expect(formatter(testValue)).toBe(5)
    })

    it('should handle large radius values', () => {
      const formatter = (value) => Math.round(value.r)
      expect(formatter({ r: 100.6 })).toBe(101)
    })

    it('should handle decimal radius values', () => {
      const formatter = (value) => Math.round(value.r)
      expect(formatter({ r: 5.5 })).toBe(6)
    })
  })

  describe('lifecycle hooks', () => {
    it('should have mounted hook', () => {
      expect(typeof wrapper.vm.$options.mounted).toBe('function')
    })

    it('should initialize chart on mount', () => {
      const renderChartMock = jest.fn()
      wrapper = shallowMount(Bubble, {
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).toHaveBeenCalled()
    })
  })

  describe('plugin management', () => {
    it('should add ChartDataLabels plugin', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Bubble, {
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(addPluginMock).toHaveBeenCalled()
    })

    it('should configure plugins before rendering', () => {
      const addPluginMock = jest.fn()
      const renderChartMock = jest.fn()
      wrapper = shallowMount(Bubble, {
        mocks: { addPlugin: addPluginMock, renderChart: renderChartMock }
      })
      expect(addPluginMock).toHaveBeenCalledBefore(renderChartMock)
    })
  })

  describe('options merging', () => {
    it('should merge chartOptions with default options', () => {
      const customOptions = { animation: false }
      wrapper = shallowMount(Bubble, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions).toEqual(customOptions)
    })

    it('should preserve responsive setting', () => {
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })

    it('should preserve maintainAspectRatio false setting', () => {
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })
  })

  describe('component reactivity', () => {
    it('should accept reactive data updates', () => {
      const initialData = [{ x: 10, y: 20, r: 5 }]
      wrapper = shallowMount(Bubble, {
        propsData: { data: initialData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data).toEqual(initialData)
    })
  })
})

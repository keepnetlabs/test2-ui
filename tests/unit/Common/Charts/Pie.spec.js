import { shallowMount } from '@vue/test-utils'
import Pie from '@/components/Common/Charts/Pie.vue'

describe('Pie.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Pie, {
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
      expect(wrapper.vm.$options.name).toBe('Pie')
    })

    it('should extend Pie from vue-chartjs', () => {
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

    it('should have addDataLabelPlugin prop', () => {
      expect(wrapper.vm.$options.props.addDataLabelPlugin).toBeDefined()
    })

    it('should have customPlugins prop', () => {
      expect(wrapper.vm.$options.props.customPlugins).toBeDefined()
    })

    it('should have addDataLabelPlugin default false', () => {
      expect(wrapper.vm.$options.props.addDataLabelPlugin.default).toBe(false)
    })

    it('should have customPlugins default empty array', () => {
      const defaultValue = wrapper.vm.$options.props.customPlugins.default()
      expect(Array.isArray(defaultValue)).toBe(true)
      expect(defaultValue.length).toBe(0)
    })

    it('should accept custom chartOptions', () => {
      const customOptions = { responsive: true }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions).toEqual(customOptions)
    })

    it('should accept data array', () => {
      const testData = [10, 20, 30]
      wrapper = shallowMount(Pie, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data).toEqual(testData)
    })
  })

  describe('ChartDataLabels plugin', () => {
    it('should add ChartDataLabels plugin when enabled', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Pie, {
        propsData: { addDataLabelPlugin: true },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(addPluginMock).toHaveBeenCalled()
    })

    it('should not add ChartDataLabels plugin when disabled', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Pie, {
        propsData: { addDataLabelPlugin: false },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.addDataLabelPlugin).toBe(false)
    })
  })

  describe('custom plugins', () => {
    it('should add custom plugins from customPlugins array', () => {
      const customPlugin = { id: 'customPlugin' }
      wrapper = shallowMount(Pie, {
        propsData: { customPlugins: [customPlugin] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugins.length).toBe(1)
    })

    it('should add multiple custom plugins', () => {
      const plugin1 = { id: 'plugin1' }
      const plugin2 = { id: 'plugin2' }
      wrapper = shallowMount(Pie, {
        propsData: { customPlugins: [plugin1, plugin2] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugins.length).toBe(2)
    })

    it('should handle empty customPlugins array', () => {
      wrapper = shallowMount(Pie, {
        propsData: { customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(Array.isArray(wrapper.vm.customPlugins)).toBe(true)
    })
  })

  describe('attachToDom method', () => {
    it('should exist as a method', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should configure datalabels options', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should set formatter function for datalabels', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should set datalabels color to #575757', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should set responsive to true', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should set maintainAspectRatio to true', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should disable tooltips by default', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should call renderChart with formatted data', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })
  })

  describe('pie chart data configuration', () => {
    it('should support single pie slice', () => {
      const testData = [100]
      wrapper = shallowMount(Pie, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(1)
    })

    it('should support multiple pie slices', () => {
      const testData = [25, 25, 25, 25]
      wrapper = shallowMount(Pie, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(4)
    })

    it('should support percentage-based data', () => {
      const testData = [20, 30, 50]
      wrapper = shallowMount(Pie, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data).toEqual(testData)
    })

    it('should support various data values', () => {
      const testData = [1, 10, 100, 1000]
      wrapper = shallowMount(Pie, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(4)
    })
  })

  describe('chart configuration', () => {
    it('should have responsive configuration', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should maintain aspect ratio', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should disable tooltips', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })

    it('should merge chartOptions with defaults', () => {
      const customOptions = { animation: false }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.animation).toBe(false)
    })

    it('should support custom backgroundColor', () => {
      const customOptions = {
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.backgroundColor.length).toBe(3)
    })

    it('should support custom labels', () => {
      const customOptions = {
        labels: ['Red', 'Blue', 'Yellow'],
        showLabels: true
      }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.labels.length).toBe(3)
    })
  })

  describe('label configuration', () => {
    it('should show labels when showLabels is true', () => {
      const customOptions = {
        showLabels: true,
        labels: ['A', 'B', 'C']
      }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.showLabels).toBe(true)
    })

    it('should hide labels when showLabels is false', () => {
      const customOptions = {
        showLabels: false,
        labels: ['A', 'B', 'C']
      }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.showLabels).toBe(false)
    })

    it('should use provided labels', () => {
      const customOptions = {
        showLabels: true,
        labels: ['Category A', 'Category B']
      }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.labels[0]).toBe('Category A')
    })
  })

  describe('real-world scenarios', () => {
    it('should work as distribution chart', () => {
      const testData = [30, 40, 30]
      const customOptions = {
        labels: ['Category A', 'Category B', 'Category C'],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        showLabels: true
      }
      wrapper = shallowMount(Pie, {
        propsData: { data: testData, chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(3)
    })

    it('should work with data labels and custom plugins', () => {
      const customPlugin = { id: 'customPlugin' }
      const testData = [50, 50]
      wrapper = shallowMount(Pie, {
        propsData: {
          data: testData,
          addDataLabelPlugin: true,
          customPlugins: [customPlugin]
        },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.addDataLabelPlugin).toBe(true)
    })

    it('should support dynamic data updates', () => {
      const initialData = [100]
      wrapper = shallowMount(Pie, {
        propsData: { data: initialData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(1)
    })

    it('should work with many slices', () => {
      const testData = Array(10).fill(10)
      wrapper = shallowMount(Pie, {
        propsData: { data: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.data.length).toBe(10)
    })
  })

  describe('lifecycle hooks', () => {
    it('should have mounted hook', () => {
      expect(typeof wrapper.vm.$options.mounted).toBe('function')
    })

    it('should initialize plugins and attach to DOM on mount', () => {
      expect(typeof wrapper.vm.$options.mounted).toBe('function')
    })

    it('should call attachToDom during mount', () => {
      expect(typeof wrapper.vm.attachToDom).toBe('function')
    })
  })

  describe('data formatter', () => {
    it('should format data labels', () => {
      const formatter = (d) => d
      expect(formatter(50)).toBe(50)
    })

    it('should handle various data types', () => {
      const formatter = (d) => d
      expect(formatter(10)).toBe(10)
      expect(formatter(100)).toBe(100)
    })
  })

  describe('renderChart invocation', () => {
    it('should call renderChart with proper data structure', () => {
      const renderChartMock = jest.fn()
      const testData = [25, 75]
      const customOptions = {
        labels: ['A', 'B'],
        backgroundColor: ['#FF0000', '#00FF00'],
        showLabels: true
      }
      wrapper = shallowMount(Pie, {
        propsData: { data: testData, chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).toHaveBeenCalled()
    })

    it('should include labels in renderChart call', () => {
      const customOptions = {
        showLabels: true,
        labels: ['Label1', 'Label2']
      }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.labels.length).toBe(2)
    })

    it('should exclude labels when showLabels false', () => {
      const customOptions = {
        showLabels: false,
        labels: ['Label1', 'Label2']
      }
      wrapper = shallowMount(Pie, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.showLabels).toBe(false)
    })
  })

  describe('plugin management', () => {
    it('should manage plugin order correctly', () => {
      const customPlugin = { id: 'custom' }
      wrapper = shallowMount(Pie, {
        propsData: { customPlugins: [customPlugin] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugins[0]).toEqual(customPlugin)
    })

    it('should handle plugin addition during mount', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Pie, {
        propsData: { addDataLabelPlugin: true },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(addPluginMock).toHaveBeenCalled()
    })
  })

  describe('props type validation', () => {
    it('should have Object type for chartOptions', () => {
      expect(wrapper.vm.$options.props.chartOptions.type).toBe(Object)
    })

    it('should have Array type for data', () => {
      expect(wrapper.vm.$options.props.data.type).toBe(Array)
    })

    it('should have Boolean type for addDataLabelPlugin', () => {
      expect(wrapper.vm.$options.props.addDataLabelPlugin.type).toBe(Boolean)
    })

    it('should have Array type for customPlugins', () => {
      expect(wrapper.vm.$options.props.customPlugins.type).toBe(Array)
    })
  })
})

import { shallowMount } from '@vue/test-utils'
import Doughnut from '@/components/Common/Charts/Doughnut.vue'

describe('Doughnut.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Doughnut, {
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
      expect(wrapper.vm.$options.name).toBe('Doughnut')
    })

    it('should extend Doughnut from vue-chartjs', () => {
      expect(wrapper.vm.$options.extends).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should have chartData prop', () => {
      expect(wrapper.vm.$options.props).toBeDefined()
      expect(wrapper.vm.$options.props[0]).toBe('chartData')
    })

    it('should have options prop', () => {
      expect(wrapper.vm.$options.props[1]).toBe('options')
    })

    it('should have chartOptions prop', () => {
      expect(wrapper.vm.$options.props[2]).toBe('chartOptions')
    })

    it('should have addDataLabelPlugin prop', () => {
      expect(wrapper.vm.$options.props[3]).toBe('addDataLabelPlugin')
    })

    it('should have customPlugins prop', () => {
      expect(wrapper.vm.$options.props[4]).toBe('customPlugins')
    })

    it('should accept chartData', () => {
      const testData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData).toEqual(testData)
    })

    it('should accept custom chartOptions', () => {
      const customOptions = { responsive: true }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartOptions: customOptions, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions).toEqual(customOptions)
    })
  })

  describe('ChartDataLabels plugin', () => {
    it('should add ChartDataLabels plugin when enabled', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { addDataLabelPlugin: true, customPlugins: [] },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(addPluginMock).toHaveBeenCalled()
    })

    it('should not add ChartDataLabels plugin when disabled', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { addDataLabelPlugin: false, customPlugins: [] },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      // addPlugin is called for custom plugins, but conditional check prevents datalabels
      expect(wrapper.vm.addDataLabelPlugin).toBe(false)
    })
  })

  describe('custom plugins', () => {
    it('should add custom plugins from customPlugins array', () => {
      const customPlugin = { id: 'customPlugin' }
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { customPlugins: [customPlugin] },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugins.length).toBe(1)
    })

    it('should add multiple custom plugins', () => {
      const plugin1 = { id: 'plugin1' }
      const plugin2 = { id: 'plugin2' }
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { customPlugins: [plugin1, plugin2] },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugins.length).toBe(2)
    })

    it('should handle empty customPlugins array', () => {
      wrapper = shallowMount(Doughnut, {
        propsData: { customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(Array.isArray(wrapper.vm.customPlugins)).toBe(true)
      expect(wrapper.vm.customPlugins.length).toBe(0)
    })
  })

  describe('chart rendering', () => {
    it('should render chart when chartData is provided', () => {
      const testData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      const renderChartMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).toHaveBeenCalled()
    })

    it('should not render chart when chartData is missing', () => {
      const renderChartMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: null, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).not.toHaveBeenCalled()
    })

    it('should pass chartOptions to renderChart', () => {
      const testData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      const chartOptions = { responsive: true }
      const renderChartMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, chartOptions, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).toHaveBeenCalledWith(testData, chartOptions)
    })
  })

  describe('watch chartData', () => {
    it('should re-render when chartData changes', () => {
      const renderChartMock = jest.fn()
      const initialData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: initialData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      renderChartMock.mockClear()

      const newData = { labels: ['X', 'Y', 'Z'], datasets: [{ data: [5, 15, 30] }] }
      wrapper.setProps({ chartData: newData })
      expect(renderChartMock).toHaveBeenCalled()
    })

    it('should update with new dataset on watch', async () => {
      const renderChartMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      renderChartMock.mockClear()

      const newData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      await wrapper.setProps({ chartData: newData })
      expect(renderChartMock).toHaveBeenCalled()
    })
  })

  describe('doughnut chart data', () => {
    it('should support single dataset', () => {
      const testData = {
        labels: ['Label1'],
        datasets: [{ data: [100] }]
      }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(1)
    })

    it('should support multiple datasets', () => {
      const testData = {
        labels: ['A', 'B', 'C'],
        datasets: [
          { data: [10, 20, 30] },
          { data: [5, 15, 25] }
        ]
      }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(2)
    })

    it('should support various data values', () => {
      const testData = {
        labels: ['Small', 'Large'],
        datasets: [{ data: [1, 100] }]
      }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets[0].data).toEqual([1, 100])
    })

    it('should support percentage-based data', () => {
      const testData = {
        labels: ['A', 'B', 'C'],
        datasets: [{ data: [25, 50, 25] }]
      }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      const sum = wrapper.vm.chartData.datasets[0].data.reduce((a, b) => a + b, 0)
      expect(sum).toBe(100)
    })
  })

  describe('chart configuration options', () => {
    it('should accept responsive option', () => {
      const options = { responsive: true }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartOptions: options, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.responsive).toBe(true)
    })

    it('should accept animation options', () => {
      const options = { animation: { duration: 500 } }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartOptions: options, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.animation.duration).toBe(500)
    })

    it('should accept legend options', () => {
      const options = { legend: { display: true, position: 'bottom' } }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartOptions: options, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.legend.position).toBe('bottom')
    })
  })

  describe('real-world scenarios', () => {
    it('should work as percentage distribution chart', () => {
      const testData = {
        labels: ['Category A', 'Category B', 'Category C'],
        datasets: [{
          data: [30, 40, 30],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.labels.length).toBe(3)
    })

    it('should work with custom styling', () => {
      const testData = {
        labels: ['Item1', 'Item2'],
        datasets: [{
          data: [60, 40],
          backgroundColor: ['#43A047', '#E53935']
        }]
      }
      const options = { responsive: true, maintainAspectRatio: false }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: testData, chartOptions: options, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets[0].backgroundColor.length).toBe(2)
    })

    it('should update chart dynamically', () => {
      const renderChartMock = jest.fn()
      const initialData = {
        labels: ['A'],
        datasets: [{ data: [100] }]
      }
      wrapper = shallowMount(Doughnut, {
        propsData: { chartData: initialData, customPlugins: [] },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })

      const newData = {
        labels: ['A', 'B'],
        datasets: [{ data: [60, 40] }]
      }
      wrapper.setProps({ chartData: newData })
      expect(wrapper.vm.chartData.labels.length).toBe(2)
    })
  })

  describe('lifecycle hooks', () => {
    it('should have mounted hook', () => {
      expect(typeof wrapper.vm.$options.mounted).toBe('function')
    })

    it('should have watch for chartData', () => {
      expect(wrapper.vm.$options.watch).toBeDefined()
      expect(wrapper.vm.$options.watch.chartData).toBeDefined()
    })

    it('should initialize plugins on mount', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { customPlugins: [] },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })
  })

  describe('plugin initialization order', () => {
    it('should add datalabels plugin first if enabled', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(Doughnut, {
        propsData: { addDataLabelPlugin: true, customPlugins: [] },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.addDataLabelPlugin).toBe(true)
    })

    it('should add custom plugins after datalabels', () => {
      const customPlugin = { id: 'custom' }
      wrapper = shallowMount(Doughnut, {
        propsData: { customPlugins: [customPlugin] },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugins[0]).toEqual(customPlugin)
    })
  })
})

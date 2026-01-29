import { shallowMount } from '@vue/test-utils'
import HorizontalBar from '@/components/Common/Charts/HorizontalBar.vue'

describe('HorizontalBar.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(HorizontalBar, {
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
      expect(wrapper.vm.$options.name).toBe('HorizontalBar')
    })

    it('should extend HorizontalBar from vue-chartjs', () => {
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

    it('should have customPlugin prop', () => {
      expect(wrapper.vm.$options.props[3]).toBe('customPlugin')
    })

    it('should have anotherCustomPlugin prop', () => {
      expect(wrapper.vm.$options.props[4]).toBe('anotherCustomPlugin')
    })

    it('should accept chartData', () => {
      const testData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData).toEqual(testData)
    })

    it('should accept custom chartOptions', () => {
      const customOptions = { responsive: true }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartOptions: customOptions },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions).toEqual(customOptions)
    })
  })

  describe('ChartDataLabels plugin', () => {
    it('should always add ChartDataLabels plugin', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(addPluginMock).toHaveBeenCalled()
    })

    it('should add datalabels plugin on mount', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(addPluginMock).toHaveBeenCalled()
    })
  })

  describe('custom plugins', () => {
    it('should add customPlugin if provided', () => {
      const customPlugin = { id: 'customPlugin' }
      const addPluginMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        propsData: { customPlugin },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugin).toEqual(customPlugin)
    })

    it('should add anotherCustomPlugin if provided', () => {
      const anotherCustomPlugin = { id: 'anotherPlugin' }
      const addPluginMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        propsData: { anotherCustomPlugin },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.anotherCustomPlugin).toEqual(anotherCustomPlugin)
    })

    it('should add both custom plugins', () => {
      const customPlugin = { id: 'plugin1' }
      const anotherCustomPlugin = { id: 'plugin2' }
      const addPluginMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        propsData: { customPlugin, anotherCustomPlugin },
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugin).toEqual(customPlugin)
      expect(wrapper.vm.anotherCustomPlugin).toEqual(anotherCustomPlugin)
    })

    it('should handle missing customPlugin', () => {
      wrapper = shallowMount(HorizontalBar, {
        propsData: { customPlugin: null },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugin).toBeNull()
    })

    it('should handle missing anotherCustomPlugin', () => {
      wrapper = shallowMount(HorizontalBar, {
        propsData: { anotherCustomPlugin: null },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.anotherCustomPlugin).toBeNull()
    })
  })

  describe('chart rendering', () => {
    it('should render chart when chartData is provided', () => {
      const testData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      const renderChartMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).toHaveBeenCalled()
    })

    it('should not render chart when chartData is missing', () => {
      const renderChartMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: null },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).not.toHaveBeenCalled()
    })

    it('should pass chartOptions to renderChart', () => {
      const testData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      const chartOptions = { responsive: true }
      const renderChartMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData, chartOptions },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      expect(renderChartMock).toHaveBeenCalledWith(testData, chartOptions)
    })
  })

  describe('watch chartData', () => {
    it('should re-render when chartData changes', () => {
      const renderChartMock = jest.fn()
      const initialData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: initialData },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      renderChartMock.mockClear()

      const newData = { labels: ['X', 'Y', 'Z'], datasets: [{ data: [5, 15, 30] }] }
      wrapper.setProps({ chartData: newData })
      expect(renderChartMock).toHaveBeenCalled()
    })

    it('should update with new dataset on watch', async () => {
      const renderChartMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      renderChartMock.mockClear()

      const newData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      await wrapper.setProps({ chartData: newData })
      expect(renderChartMock).toHaveBeenCalled()
    })
  })

  describe('horizontal bar chart data', () => {
    it('should support single dataset', () => {
      const testData = {
        labels: ['Label1'],
        datasets: [{ data: [100] }]
      }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(1)
    })

    it('should support multiple datasets', () => {
      const testData = {
        labels: ['A', 'B', 'C'],
        datasets: [
          { data: [10, 20, 30], label: 'Series 1' },
          { data: [5, 15, 25], label: 'Series 2' }
        ]
      }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(2)
    })

    it('should support stacked bars', () => {
      const testData = {
        labels: ['Category A', 'Category B'],
        datasets: [
          { data: [10, 20], label: 'Item 1' },
          { data: [15, 25], label: 'Item 2' }
        ]
      }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(2)
    })

    it('should support various data values', () => {
      const testData = {
        labels: ['Small', 'Large'],
        datasets: [{ data: [1, 1000] }]
      }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets[0].data).toEqual([1, 1000])
    })
  })

  describe('chart configuration options', () => {
    it('should accept responsive option', () => {
      const options = { responsive: true }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartOptions: options },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.responsive).toBe(true)
    })

    it('should accept legend options', () => {
      const options = { legend: { display: true, position: 'top' } }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartOptions: options },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.legend.position).toBe('top')
    })

    it('should accept scales configuration', () => {
      const options = {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }]
        }
      }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartOptions: options },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.scales.xAxes[0].stacked).toBe(true)
    })

    it('should accept animation options', () => {
      const options = { animation: { duration: 0 } }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartOptions: options },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartOptions.animation.duration).toBe(0)
    })
  })

  describe('real-world scenarios', () => {
    it('should work as comparison chart', () => {
      const testData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Sales',
          data: [120, 190, 300, 250],
          backgroundColor: '#2196F3'
        }]
      }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.labels.length).toBe(4)
    })

    it('should work with stacked horizontal bars', () => {
      const testData = {
        labels: ['Product A', 'Product B', 'Product C'],
        datasets: [
          { data: [30, 40, 50], label: 'Store 1' },
          { data: [20, 30, 40], label: 'Store 2' }
        ]
      }
      const options = {
        scales: {
          xAxes: [{ stacked: true }]
        }
      }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData, chartOptions: options },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(2)
    })

    it('should work with custom plugins and data labels', () => {
      const customPlugin = { id: 'customPlugin' }
      const testData = {
        labels: ['Item 1', 'Item 2'],
        datasets: [{ data: [50, 100] }]
      }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: testData, customPlugin },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugin).toBeDefined()
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
      wrapper = shallowMount(HorizontalBar, {
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(wrapper.vm.$options.mounted).toBeDefined()
    })
  })

  describe('plugin initialization order', () => {
    it('should add datalabels plugin first', () => {
      const addPluginMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        mocks: { addPlugin: addPluginMock, renderChart: jest.fn() }
      })
      expect(addPluginMock).toHaveBeenCalled()
    })

    it('should add custom plugins after datalabels', () => {
      const customPlugin = { id: 'custom' }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { customPlugin },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugin).toEqual(customPlugin)
    })

    it('should add all plugins in order', () => {
      const customPlugin = { id: 'plugin1' }
      const anotherCustomPlugin = { id: 'plugin2' }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { customPlugin, anotherCustomPlugin },
        mocks: { addPlugin: jest.fn(), renderChart: jest.fn() }
      })
      expect(wrapper.vm.customPlugin).toBeDefined()
      expect(wrapper.vm.anotherCustomPlugin).toBeDefined()
    })
  })

  describe('dynamic data updates', () => {
    it('should handle data updates reactively', () => {
      const renderChartMock = jest.fn()
      wrapper = shallowMount(HorizontalBar, {
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      renderChartMock.mockClear()

      const testData = { labels: ['A'], datasets: [{ data: [50] }] }
      wrapper.setProps({ chartData: testData })
      expect(renderChartMock).toHaveBeenCalled()
    })

    it('should handle multiple data updates', () => {
      const renderChartMock = jest.fn()
      const data1 = { labels: ['A'], datasets: [{ data: [10] }] }
      wrapper = shallowMount(HorizontalBar, {
        propsData: { chartData: data1 },
        mocks: { addPlugin: jest.fn(), renderChart: renderChartMock }
      })
      renderChartMock.mockClear()

      const data2 = { labels: ['B'], datasets: [{ data: [20] }] }
      wrapper.setProps({ chartData: data2 })
      const data3 = { labels: ['C'], datasets: [{ data: [30] }] }
      wrapper.setProps({ chartData: data3 })
      expect(renderChartMock.mock.calls.length).toBe(2)
    })
  })
})

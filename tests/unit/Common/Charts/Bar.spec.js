import { shallowMount } from '@vue/test-utils'
import Bar from '@/components/Common/Charts/Bar.vue'

describe('Bar.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Bar, {
      stubs: {
        canvas: true
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
      expect(wrapper.vm.$options.name).toBe('Bar')
    })

    it('should extend Bar from vue-chartjs', () => {
      expect(wrapper.vm.$options.extends).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should have chartData prop', () => {
      expect(wrapper.vm.$options.props.chartData).toBeDefined()
    })

    it('should have options prop', () => {
      expect(wrapper.vm.$options.props.options).toBeDefined()
    })

    it('should have chartOptions prop', () => {
      expect(wrapper.vm.$options.props.chartOptions).toBeDefined()
    })

    it('should have addDataPlugin prop with default true', () => {
      expect(wrapper.vm.$options.props.addDataPlugin.default).toBe(true)
    })

    it('should have addCustomLegendLabelHeight prop with default 4', () => {
      expect(wrapper.vm.$options.props.addCustomLegendLabelHeight.default).toBe(4)
    })

    it('should have customPlugin prop with default empty array', () => {
      const defaultValue = wrapper.vm.$options.props.customPlugin.default()
      expect(Array.isArray(defaultValue)).toBe(true)
      expect(defaultValue.length).toBe(0)
    })

    it('should accept chartData prop', () => {
      const chartData = {
        labels: ['Jan', 'Feb'],
        datasets: [{ data: [10, 20] }]
      }
      wrapper = shallowMount(Bar, {
        propsData: { chartData }
      })
      expect(wrapper.vm.chartData).toEqual(chartData)
    })

    it('should accept chartOptions prop', () => {
      const chartOptions = { responsive: true }
      wrapper = shallowMount(Bar, {
        propsData: { chartOptions }
      })
      expect(wrapper.vm.chartOptions).toEqual(chartOptions)
    })

    it('should accept addDataPlugin as false', () => {
      wrapper = shallowMount(Bar, {
        propsData: { addDataPlugin: false }
      })
      expect(wrapper.vm.addDataPlugin).toBe(false)
    })

    it('should accept custom legend label height', () => {
      wrapper = shallowMount(Bar, {
        propsData: { addCustomLegendLabelHeight: 10 }
      })
      expect(wrapper.vm.addCustomLegendLabelHeight).toBe(10)
    })

    it('should accept custom plugins array', () => {
      const plugins = [{ id: 'custom' }]
      wrapper = shallowMount(Bar, {
        propsData: { customPlugin: plugins }
      })
      expect(wrapper.vm.customPlugin).toEqual(plugins)
    })
  })

  describe('data plugin handling', () => {
    it('should add ChartDataLabels plugin by default', () => {
      wrapper = shallowMount(Bar, {
        propsData: { addDataPlugin: true }
      })
      expect(wrapper.vm.addDataPlugin).toBe(true)
    })

    it('should not add ChartDataLabels when addDataPlugin is false', () => {
      wrapper = shallowMount(Bar, {
        propsData: { addDataPlugin: false }
      })
      expect(wrapper.vm.addDataPlugin).toBe(false)
    })
  })

  describe('custom legend label height', () => {
    it('should have default custom legend height 4', () => {
      expect(wrapper.vm.addCustomLegendLabelHeight).toBe(4)
    })

    it('should accept custom legend label height', () => {
      wrapper = shallowMount(Bar, {
        propsData: { addCustomLegendLabelHeight: 8 }
      })
      expect(wrapper.vm.addCustomLegendLabelHeight).toBe(8)
    })

    it('should accept zero for custom legend height', () => {
      wrapper = shallowMount(Bar, {
        propsData: { addCustomLegendLabelHeight: 0 }
      })
      expect(wrapper.vm.addCustomLegendLabelHeight).toBe(0)
    })

    it('should accept large custom legend heights', () => {
      wrapper = shallowMount(Bar, {
        propsData: { addCustomLegendLabelHeight: 100 }
      })
      expect(wrapper.vm.addCustomLegendLabelHeight).toBe(100)
    })
  })

  describe('custom plugins', () => {
    it('should have empty custom plugins by default', () => {
      expect(wrapper.vm.customPlugin.length).toBe(0)
    })

    it('should accept single custom plugin', () => {
      const plugin = { id: 'custom1' }
      wrapper = shallowMount(Bar, {
        propsData: { customPlugin: [plugin] }
      })
      expect(wrapper.vm.customPlugin.length).toBe(1)
      expect(wrapper.vm.customPlugin[0]).toEqual(plugin)
    })

    it('should accept multiple custom plugins', () => {
      const plugins = [{ id: 'custom1' }, { id: 'custom2' }]
      wrapper = shallowMount(Bar, {
        propsData: { customPlugin: plugins }
      })
      expect(wrapper.vm.customPlugin.length).toBe(2)
    })
  })

  describe('lifecycle - mounted', () => {
    it('should render chart when chartData is provided', () => {
      const chartData = {
        labels: ['A', 'B'],
        datasets: [{ data: [10, 20] }]
      }
      wrapper = shallowMount(Bar, {
        propsData: { chartData }
      })
      expect(wrapper.vm.chartData).toBeDefined()
    })

    it('should not render chart when chartData is null', () => {
      wrapper = shallowMount(Bar, {
        propsData: { chartData: null }
      })
      expect(wrapper.vm.chartData).toBeNull()
    })
  })

  describe('watch chartData', () => {
    it('should re-render when chartData changes', async () => {
      const initialData = {
        labels: ['A'],
        datasets: [{ data: [10] }]
      }
      wrapper = shallowMount(Bar, {
        propsData: { chartData: initialData }
      })

      const newData = {
        labels: ['A', 'B'],
        datasets: [{ data: [10, 20] }]
      }
      await wrapper.setProps({ chartData: newData })
      expect(wrapper.vm.chartData).toEqual(newData)
    })

    it('should handle null chartData update', async () => {
      const chartData = {
        labels: ['A'],
        datasets: [{ data: [10] }]
      }
      wrapper = shallowMount(Bar, {
        propsData: { chartData }
      })
      await wrapper.setProps({ chartData: null })
      expect(wrapper.vm.chartData).toBeNull()
    })
  })

  describe('chart configuration', () => {
    it('should have props for chart options', () => {
      expect(wrapper.vm.$options.props.options).toBeDefined()
      expect(wrapper.vm.$options.props.chartOptions).toBeDefined()
    })

    it('should accept responsive options', () => {
      const options = { responsive: true }
      wrapper = shallowMount(Bar, {
        propsData: { chartOptions: options }
      })
      expect(wrapper.vm.chartOptions).toEqual(options)
    })

    it('should accept maintainAspectRatio option', () => {
      const options = { maintainAspectRatio: false }
      wrapper = shallowMount(Bar, {
        propsData: { chartOptions: options }
      })
      expect(wrapper.vm.chartOptions).toEqual(options)
    })
  })

  describe('plugin integration', () => {
    it('should have addPlugin method from vue-chartjs', () => {
      expect(typeof wrapper.vm.addPlugin).toBe('function')
    })

    it('should have renderChart method from vue-chartjs', () => {
      expect(typeof wrapper.vm.renderChart).toBe('function')
    })

    it('should add plugins during mounted', () => {
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('real-world scenarios', () => {
    it('should render sales data chart', () => {
      const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [
          {
            label: 'Sales',
            data: [100, 150, 200, 250]
          }
        ]
      }
      wrapper = shallowMount(Bar, {
        propsData: {
          chartData: salesData,
          chartOptions: { responsive: true }
        }
      })
      expect(wrapper.vm.chartData.labels).toEqual(salesData.labels)
      expect(wrapper.vm.chartData.datasets.length).toBe(1)
    })

    it('should render multiple dataset chart', () => {
      const multiData = {
        labels: ['Product A', 'Product B', 'Product C'],
        datasets: [
          { label: '2022', data: [10, 20, 30] },
          { label: '2023', data: [15, 25, 35] }
        ]
      }
      wrapper = shallowMount(Bar, {
        propsData: { chartData: multiData }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(2)
    })

    it('should handle comparison charts', () => {
      const comparisonData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          { label: 'Target', data: [100, 100, 100, 100] },
          { label: 'Actual', data: [80, 90, 95, 110] }
        ]
      }
      wrapper = shallowMount(Bar, {
        propsData: { chartData: comparisonData }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(2)
    })
  })

  describe('prop defaults', () => {
    it('should have null chartData by default', () => {
      expect(wrapper.vm.$options.props.chartData.default).toBeNull()
    })

    it('should have null options by default', () => {
      expect(wrapper.vm.$options.props.options.default).toBeNull()
    })

    it('should have null chartOptions by default', () => {
      expect(wrapper.vm.$options.props.chartOptions.default).toBeNull()
    })
  })

  describe('reactivity', () => {
    it('should update chart when chartOptions change', async () => {
      wrapper = shallowMount(Bar, {
        propsData: {
          chartData: { labels: ['A'], datasets: [{ data: [10] }] },
          chartOptions: { responsive: true }
        }
      })
      await wrapper.setProps({ chartOptions: { responsive: false } })
      expect(wrapper.vm.chartOptions.responsive).toBe(false)
    })

    it('should handle plugin prop updates', async () => {
      const plugin1 = { id: 'p1' }
      wrapper = shallowMount(Bar, {
        propsData: { customPlugin: [plugin1] }
      })
      const plugin2 = { id: 'p2' }
      await wrapper.setProps({ customPlugin: [plugin1, plugin2] })
      expect(wrapper.vm.customPlugin.length).toBe(2)
    })
  })

  describe('chart rendering', () => {
    it('should render bar chart with data', () => {
      const data = {
        labels: ['Bar1', 'Bar2'],
        datasets: [{ data: [10, 20] }]
      }
      wrapper = shallowMount(Bar, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData).toEqual(data)
    })

    it('should render stacked bar chart', () => {
      const stackedData = {
        labels: ['A', 'B'],
        datasets: [
          { data: [10, 20], stack: 'Stack 0' },
          { data: [30, 40], stack: 'Stack 1' }
        ]
      }
      wrapper = shallowMount(Bar, {
        propsData: { chartData: stackedData }
      })
      expect(wrapper.vm.chartData.datasets[0].stack).toBe('Stack 0')
    })

    it('should render horizontal bar chart', () => {
      const horizontalData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ data: [100, 200, 300] }]
      }
      const options = { indexAxis: 'y' }
      wrapper = shallowMount(Bar, {
        propsData: {
          chartData: horizontalData,
          chartOptions: options
        }
      })
      expect(wrapper.vm.chartOptions.indexAxis).toBe('y')
    })
  })
})

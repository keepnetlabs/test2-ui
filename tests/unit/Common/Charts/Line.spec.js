import { shallowMount } from '@vue/test-utils'
import Line from '@/components/Common/Charts/Line.vue'

describe('Line.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Line)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component structure', () => {
    it('should render as a Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('Line')
    })

    it('should extend Line from vue-chartjs', () => {
      expect(wrapper.vm.$options.extends).toBeDefined()
    })
  })

  describe('props handling', () => {
    it('should have chartData prop', () => {
      expect(wrapper.vm.$options.props).toContain('chartData')
    })

    it('should have options prop', () => {
      expect(wrapper.vm.$options.props).toContain('options')
    })

    it('should have chartOptions prop', () => {
      expect(wrapper.vm.$options.props).toContain('chartOptions')
    })

    it('should accept chartData prop', () => {
      const chartData = {
        labels: ['Jan', 'Feb'],
        datasets: [{ data: [10, 20] }]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData }
      })
      expect(wrapper.vm.chartData).toEqual(chartData)
    })

    it('should accept options prop', () => {
      const options = { responsive: true }
      wrapper = shallowMount(Line, {
        propsData: { options }
      })
      expect(wrapper.vm.options).toEqual(options)
    })

    it('should accept chartOptions prop', () => {
      const chartOptions = { scales: {} }
      wrapper = shallowMount(Line, {
        propsData: { chartOptions }
      })
      expect(wrapper.vm.chartOptions).toEqual(chartOptions)
    })

    it('should handle multiple props together', () => {
      const chartData = {
        labels: ['A', 'B'],
        datasets: [{ data: [5, 10] }]
      }
      const options = { responsive: true }
      const chartOptions = { scales: { y: { beginAtZero: true } } }

      wrapper = shallowMount(Line, {
        propsData: { chartData, options, chartOptions }
      })

      expect(wrapper.vm.chartData).toEqual(chartData)
      expect(wrapper.vm.options).toEqual(options)
      expect(wrapper.vm.chartOptions).toEqual(chartOptions)
    })
  })

  describe('lifecycle - mounted', () => {
    it('should render chart when chartData is provided', () => {
      const chartData = {
        labels: ['Q1', 'Q2'],
        datasets: [{ data: [100, 200] }]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData }
      })
      expect(wrapper.vm.chartData).toBeDefined()
    })

    it('should not render chart when chartData is null', () => {
      wrapper = shallowMount(Line, {
        propsData: { chartData: null }
      })
      expect(wrapper.vm.chartData).toBeNull()
    })

    it('should not render chart when chartData is undefined', () => {
      wrapper = shallowMount(Line, {
        propsData: { chartData: undefined }
      })
      expect(wrapper.vm.chartData).toBeUndefined()
    })
  })

  describe('watch chartData', () => {
    it('should re-render chart when chartData changes', async () => {
      const initialData = {
        labels: ['Jan'],
        datasets: [{ data: [10] }]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: initialData }
      })

      const newData = {
        labels: ['Jan', 'Feb'],
        datasets: [{ data: [10, 20] }]
      }
      await wrapper.setProps({ chartData: newData })
      expect(wrapper.vm.chartData).toEqual(newData)
    })

    it('should handle null to data transition', async () => {
      wrapper = shallowMount(Line, {
        propsData: { chartData: null }
      })

      const chartData = {
        labels: ['A'],
        datasets: [{ data: [100] }]
      }
      await wrapper.setProps({ chartData })
      expect(wrapper.vm.chartData).toEqual(chartData)
    })

    it('should handle data to null transition', async () => {
      const chartData = {
        labels: ['A'],
        datasets: [{ data: [100] }]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData }
      })

      await wrapper.setProps({ chartData: null })
      expect(wrapper.vm.chartData).toBeNull()
    })
  })

  describe('chart methods', () => {
    it('should have renderChart method from vue-chartjs', () => {
      expect(typeof wrapper.vm.renderChart).toBe('function')
    })

    it('should have addPlugin method from vue-chartjs', () => {
      expect(typeof wrapper.vm.addPlugin).toBe('function')
    })

    it('should be able to render chart with data and options', () => {
      const data = {
        labels: ['Mon', 'Tue', 'Wed'],
        datasets: [{ label: 'Sales', data: [100, 150, 200] }]
      }
      const options = { responsive: true }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data, chartOptions: options }
      })
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('line chart data structure', () => {
    it('should render single line', () => {
      const data = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Revenue',
            data: [100, 150, 200]
          }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(1)
    })

    it('should render multiple lines', () => {
      const data = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          { label: 'Sales', data: [100, 150, 200] },
          { label: 'Revenue', data: [50, 75, 100] }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(2)
    })

    it('should handle datasets with different properties', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            label: 'Line 1',
            data: [10, 20, 30],
            borderColor: 'red',
            fill: false
          },
          {
            label: 'Line 2',
            data: [5, 15, 25],
            borderColor: 'blue',
            fill: true
          }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.datasets[0].borderColor).toBe('red')
      expect(wrapper.vm.chartData.datasets[1].borderColor).toBe('blue')
    })
  })

  describe('chart options', () => {
    it('should accept responsive option', () => {
      const options = { responsive: true }
      wrapper = shallowMount(Line, {
        propsData: { chartOptions: options }
      })
      expect(wrapper.vm.chartOptions.responsive).toBe(true)
    })

    it('should accept maintainAspectRatio option', () => {
      const options = { maintainAspectRatio: false }
      wrapper = shallowMount(Line, {
        propsData: { chartOptions: options }
      })
      expect(wrapper.vm.chartOptions.maintainAspectRatio).toBe(false)
    })

    it('should accept scales configuration', () => {
      const options = {
        scales: {
          y: { beginAtZero: true },
          x: { title: { display: true, text: 'Months' } }
        }
      }
      wrapper = shallowMount(Line, {
        propsData: { chartOptions: options }
      })
      expect(wrapper.vm.chartOptions.scales.y.beginAtZero).toBe(true)
    })

    it('should accept plugins configuration', () => {
      const options = {
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        }
      }
      wrapper = shallowMount(Line, {
        propsData: { chartOptions: options }
      })
      expect(wrapper.vm.chartOptions.plugins.legend.display).toBe(true)
    })
  })

  describe('reactivity', () => {
    it('should update when chartData prop changes', async () => {
      wrapper = shallowMount(Line, {
        propsData: {
          chartData: { labels: ['A'], datasets: [{ data: [10] }] }
        }
      })

      const newData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }
      await wrapper.setProps({ chartData: newData })

      expect(wrapper.vm.chartData).toEqual(newData)
    })

    it('should update when chartOptions prop changes', async () => {
      wrapper = shallowMount(Line, {
        propsData: {
          chartOptions: { responsive: true }
        }
      })

      await wrapper.setProps({ chartOptions: { responsive: false } })

      expect(wrapper.vm.chartOptions.responsive).toBe(false)
    })

    it('should update when options prop changes', async () => {
      wrapper = shallowMount(Line, {
        propsData: {
          options: { animation: true }
        }
      })

      await wrapper.setProps({ options: { animation: false } })

      expect(wrapper.vm.options.animation).toBe(false)
    })
  })

  describe('real-world scenarios', () => {
    it('should render time series data', () => {
      const timeSeriesData = {
        labels: ['2023-01', '2023-02', '2023-03', '2023-04'],
        datasets: [
          {
            label: 'Temperature',
            data: [20, 22, 25, 23]
          }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: timeSeriesData }
      })
      expect(wrapper.vm.chartData.labels.length).toBe(4)
    })

    it('should render trend analysis', () => {
      const trendData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Trend',
            data: [10, 12, 15, 18],
            fill: true,
            tension: 0.3
          }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: trendData }
      })
      expect(wrapper.vm.chartData.datasets[0].tension).toBe(0.3)
    })

    it('should render comparison chart', () => {
      const comparisonData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          { label: 'Target', data: [100, 100, 100, 100] },
          { label: 'Actual', data: [80, 90, 95, 110] }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: comparisonData }
      })
      expect(wrapper.vm.chartData.datasets.length).toBe(2)
    })

    it('should render stock price chart', () => {
      const stockData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          {
            label: 'Price',
            data: [100, 102, 98, 105, 103]
          }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: stockData }
      })
      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(5)
    })
  })

  describe('chart customization', () => {
    it('should render curved line', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            data: [10, 20, 30],
            tension: 0.4
          }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.datasets[0].tension).toBe(0.4)
    })

    it('should render filled area', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            data: [10, 20, 30],
            fill: true
          }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.datasets[0].fill).toBe(true)
    })

    it('should render with custom colors', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            data: [10, 20, 30],
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.1)'
          }
        ]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.datasets[0].borderColor).toBe('#FF6384')
    })
  })

  describe('empty and edge cases', () => {
    it('should handle empty labels', () => {
      const data = {
        labels: [],
        datasets: [{ data: [] }]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.labels.length).toBe(0)
    })

    it('should handle single data point', () => {
      const data = {
        labels: ['Single'],
        datasets: [{ data: [100] }]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(1)
    })

    it('should handle null values in dataset', () => {
      const data = {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [{ data: [10, null, 20, null] }]
      }
      wrapper = shallowMount(Line, {
        propsData: { chartData: data }
      })
      expect(wrapper.vm.chartData.datasets[0].data.length).toBe(4)
    })
  })

  describe('props defaults', () => {
    it('should have default undefined for chartData', () => {
      expect(wrapper.vm.chartData).toBeUndefined()
    })

    it('should have default undefined for options', () => {
      expect(wrapper.vm.options).toBeUndefined()
    })

    it('should have default undefined for chartOptions', () => {
      expect(wrapper.vm.chartOptions).toBeUndefined()
    })
  })
})

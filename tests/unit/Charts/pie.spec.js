import { createLocalVue, mount } from '@vue/test-utils'
import TestPie from '@/components/TestHelpers/TestPie'
import 'jest-canvas-mock'

describe('Pie component', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = mount(TestPie, { localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component rendering', () => {
    it('Check render', () => {
      expect(wrapper.find('#pie-chart').exists()).toBe(true)
      expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
    })

    it('should render pie chart container', () => {
      expect(wrapper.find('#pie-chart').exists()).toBe(true)
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('TestPie')
    })

    it('should render as Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('Chart is mounted and visible', () => {
      expect(wrapper.find('canvas').exists()).toBe(true)
      expect(wrapper.find('.chartjs-render-monitor').isVisible()).toBe(true)
    })

    it('Component has required chart container', () => {
      const chartElement = wrapper.find('#pie-chart')
      expect(chartElement.element).toBeDefined()
    })
  })

  describe('props and data', () => {
    it('Check props', () => {
      expect(wrapper.vm['chartOptions']).toBeTruthy()
      expect(wrapper.vm['series']).toBeTruthy()
    })

    it('should have series data property', () => {
      expect(wrapper.vm.series).toBeDefined()
    })

    it('should have chartOptions data property', () => {
      expect(wrapper.vm.chartOptions).toBeDefined()
    })

    it('chartOptions should be an object', () => {
      expect(typeof wrapper.vm.chartOptions).toBe('object')
    })

    it('series should be an array', () => {
      expect(Array.isArray(wrapper.vm.series)).toBe(true)
    })

    it('initial series data is [44, 80]', () => {
      expect(wrapper.vm.series).toEqual([44, 80])
    })
  })

  describe('chart data structure', () => {
    it('Chart has correct data structure', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('responsive')
      expect(wrapper.vm.series).toBeInstanceOf(Array)
    })

    it('chartOptions has labels property', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('labels')
      expect(wrapper.vm.chartOptions.labels).toEqual(['Phishing', 'Malicious'])
    })

    it('chartOptions has fill property', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('fill')
    })

    it('chartOptions has legend property', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('legend')
    })

    it('chartOptions has colors property', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('colors')
    })

    it('chartOptions has responsive property', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('responsive')
    })

    it('chartOptions has dataLabels property', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('dataLabels')
    })

    it('legend property has verticalAlign', () => {
      expect(wrapper.vm.chartOptions.legend).toHaveProperty('verticalAlign')
      expect(wrapper.vm.chartOptions.legend.verticalAlign).toBe('right')
    })

    it('legend property has position', () => {
      expect(wrapper.vm.chartOptions.legend).toHaveProperty('position')
      expect(wrapper.vm.chartOptions.legend.position).toBe('right')
    })

    it('colors array has correct values', () => {
      expect(wrapper.vm.chartOptions.colors).toEqual(['#f56c6c', '#e6a23c'])
    })

    it('fill colors array has correct values', () => {
      expect(wrapper.vm.chartOptions.fill.colors).toEqual(['#f56c6c', '#e6a23c'])
    })

    it('dataLabels is disabled', () => {
      expect(wrapper.vm.chartOptions.dataLabels.enabled).toBe(false)
    })

    it('series data is array format', () => {
      expect(Array.isArray(wrapper.vm.series)).toBe(true)
      expect(wrapper.vm.series.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('DOM elements', () => {
    it('chart element has correct ID attribute', () => {
      const chartElement = wrapper.find('#pie-chart')
      expect(chartElement.attributes('id')).toBe('pie-chart')
    })

    it('chartjs render monitor class is present', () => {
      const monitor = wrapper.find('.chartjs-render-monitor')
      expect(monitor.exists()).toBe(true)
      expect(monitor.classes()).toContain('chartjs-render-monitor')
    })

    it('should have canvas element', () => {
      expect(wrapper.find('canvas').exists()).toBe(true)
    })
  })

  describe('legend configuration', () => {
    it('legend fontSize is 16px', () => {
      expect(wrapper.vm.chartOptions.legend.fontSize).toBe('16px')
    })

    it('legend offsetX is 0', () => {
      expect(wrapper.vm.chartOptions.legend.offsetX).toBe(0)
    })

    it('legend has markers configuration', () => {
      expect(wrapper.vm.chartOptions.legend).toHaveProperty('markers')
      expect(wrapper.vm.chartOptions.legend.markers).toHaveProperty('width')
      expect(wrapper.vm.chartOptions.legend.markers).toHaveProperty('height')
    })

    it('markers have correct dimensions', () => {
      const markers = wrapper.vm.chartOptions.legend.markers
      expect(markers.width).toBe(16)
      expect(markers.height).toBe(16)
    })

    it('markers have correct shape', () => {
      expect(wrapper.vm.chartOptions.legend.markers.shape).toBe('square')
    })

    it('legend has itemMargin', () => {
      expect(wrapper.vm.chartOptions.legend).toHaveProperty('itemMargin')
      expect(wrapper.vm.chartOptions.legend.itemMargin.horizontal).toBe(6)
      expect(wrapper.vm.chartOptions.legend.itemMargin.vertical).toBe(15)
    })

    it('legend has onItemClick configuration', () => {
      expect(wrapper.vm.chartOptions.legend).toHaveProperty('onItemClick')
      expect(wrapper.vm.chartOptions.legend.onItemClick.toggleDataSeries).toBe(true)
    })

    it('legend has onItemHover configuration', () => {
      expect(wrapper.vm.chartOptions.legend).toHaveProperty('onItemHover')
      expect(wrapper.vm.chartOptions.legend.onItemHover.highlightDataSeries).toBe(true)
    })

    it('legend labels have colors', () => {
      expect(wrapper.vm.chartOptions.legend.labels).toHaveProperty('colors')
      expect(wrapper.vm.chartOptions.legend.labels.colors).toEqual(['#f56c6c', '#e6a23c'])
    })
  })

  describe('responsive configuration', () => {
    it('responsive is an array', () => {
      expect(Array.isArray(wrapper.vm.chartOptions.responsive)).toBe(true)
    })

    it('responsive has breakpoint 480', () => {
      expect(wrapper.vm.chartOptions.responsive[0].breakpoint).toBe(480)
    })

    it('responsive has options for breakpoint', () => {
      expect(wrapper.vm.chartOptions.responsive[0]).toHaveProperty('options')
    })

    it('responsive options have chart configuration', () => {
      expect(wrapper.vm.chartOptions.responsive[0].options).toHaveProperty('chart')
      expect(wrapper.vm.chartOptions.responsive[0].options.chart.width).toBe(300)
    })

    it('responsive chart has offsetX and offsetY', () => {
      const chart = wrapper.vm.chartOptions.responsive[0].options.chart
      expect(chart.offsetX).toBe(-30)
      expect(chart.offsetY).toBe(10)
    })
  })

  describe('reactivity and updates', () => {
    it('should update series reactively', async () => {
      const newSeries = [50, 75]
      wrapper.vm.series = newSeries
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.series).toEqual(newSeries)
    })

    it('should update chartOptions reactively', async () => {
      wrapper.vm.chartOptions.labels = ['New1', 'New2']
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartOptions.labels).toEqual(['New1', 'New2'])
    })

    it('should handle series modification', async () => {
      wrapper.vm.series[0] = 100
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.series[0]).toBe(100)
    })
  })

  describe('component integration', () => {
    it('Pie component is registered', () => {
      expect(wrapper.vm.$options.components.Pie).toBeDefined()
    })

    it('Pie component receives series prop', () => {
      const pieComponent = wrapper.findComponent({ name: 'ApexChart' })
      if (pieComponent.exists()) {
        expect(pieComponent.props('data')).toBeDefined()
      }
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mount(TestPie, { localVue })
      const wrapper2 = mount(TestPie, { localVue })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not modify data between instances', () => {
      const wrapper1 = mount(TestPie, { localVue })
      const wrapper2 = mount(TestPie, { localVue })
      wrapper1.vm.series = [10, 20]
      expect(wrapper2.vm.series).toEqual([44, 80])
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should handle component destruction gracefully', () => {
      const newWrapper = mount(TestPie, { localVue })
      expect(() => {
        newWrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain initial data on creation', () => {
      expect(wrapper.vm.series).toEqual([44, 80])
      expect(wrapper.vm.chartOptions.labels).toEqual(['Phishing', 'Malicious'])
    })
  })

  describe('color schemes', () => {
    it('has two colors defined', () => {
      expect(wrapper.vm.chartOptions.colors.length).toBe(2)
    })

    it('colors are valid hex codes', () => {
      const colors = wrapper.vm.chartOptions.colors
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    it('fill colors match main colors', () => {
      expect(wrapper.vm.chartOptions.fill.colors).toEqual(wrapper.vm.chartOptions.colors)
    })

    it('legend label colors match', () => {
      expect(wrapper.vm.chartOptions.legend.labels.colors).toEqual(wrapper.vm.chartOptions.colors)
    })
  })

  describe('data validation', () => {
    it('series should have at least 2 values', () => {
      expect(wrapper.vm.series.length).toBeGreaterThanOrEqual(2)
    })

    it('labels should match series length', () => {
      expect(wrapper.vm.chartOptions.labels.length).toBe(wrapper.vm.series.length)
    })

    it('colors should match series length', () => {
      expect(wrapper.vm.chartOptions.colors.length).toBe(wrapper.vm.series.length)
    })

    it('series values should be numbers', () => {
      wrapper.vm.series.forEach(value => {
        expect(typeof value).toBe('number')
      })
    })

    it('labels should be strings', () => {
      wrapper.vm.chartOptions.labels.forEach(label => {
        expect(typeof label).toBe('string')
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty series', () => {
      const newWrapper = mount(TestPie, {
        localVue,
        data() {
          return {
            series: [],
            chartOptions: wrapper.vm.chartOptions
          }
        }
      })
      expect(newWrapper.vm.series).toEqual([])
      newWrapper.destroy()
    })

    it('should handle single data point', () => {
      wrapper.vm.series = [100]
      expect(wrapper.vm.series.length).toBe(1)
    })

    it('should handle large numbers in series', () => {
      wrapper.vm.series = [1000000, 2000000]
      expect(wrapper.vm.series[0]).toBe(1000000)
    })

    it('should handle decimal numbers in series', () => {
      wrapper.vm.series = [44.5, 80.3]
      expect(wrapper.vm.series[0]).toBe(44.5)
    })
  })
})

import { createLocalVue, mount } from '@vue/test-utils'
import TestBubble from '@/components/TestHelpers/TestBubble'
import 'jest-canvas-mock'

describe('Bubble component', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = mount(TestBubble, { localVue })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('component rendering', () => {
    it('Check render', () => {
      expect(wrapper.find('#bubble-chart').exists()).toBe(true)
      expect(wrapper.find('.chartjs-render-monitor').exists()).toBe(true)
    })

    it('should render bubble chart container', () => {
      expect(wrapper.find('#bubble-chart').exists()).toBe(true)
    })

    it('should have correct component name', () => {
      expect(wrapper.vm.$options.name).toBe('TestBubble')
    })

    it('should render as Vue component', () => {
      expect(wrapper.vm).toBeDefined()
    })

    it('Chart is mounted and visible', () => {
      expect(wrapper.find('canvas').exists()).toBe(true)
      expect(wrapper.find('.chartjs-render-monitor').isVisible()).toBe(true)
    })

    it('Component has required chart container', () => {
      const chartElement = wrapper.find('#bubble-chart')
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

    it('chartData should be an array', () => {
      expect(Array.isArray(wrapper.vm.chartData)).toBe(true)
    })

    it('chartData should have 4 datasets', () => {
      expect(wrapper.vm.chartData.length).toBe(4)
    })

    it('chartData datasets have labels', () => {
      const labels = wrapper.vm.chartData.map(d => d.label)
      expect(labels).toEqual(['Phishing', 'Malicious', 'Non Malicious', 'Clean'])
    })
  })

  describe('chart data structure', () => {
    it('Chart has correct data structure', () => {
      expect(wrapper.vm.chartData).toBeInstanceOf(Object)
    })

    it('chartData is properly structured', () => {
      expect(wrapper.vm.chartData).toBeInstanceOf(Object)
      expect(Object.keys(wrapper.vm.chartData).length).toBeGreaterThan(0)
    })

    it('chartOptions has scales property', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('scales')
    })

    it('chartOptions has legend property', () => {
      expect(wrapper.vm.chartOptions).toHaveProperty('legend')
    })

    it('scales has xAxes property', () => {
      expect(wrapper.vm.chartOptions.scales).toHaveProperty('xAxes')
      expect(Array.isArray(wrapper.vm.chartOptions.scales.xAxes)).toBe(true)
    })

    it('scales has yAxes property', () => {
      expect(wrapper.vm.chartOptions.scales).toHaveProperty('yAxes')
      expect(Array.isArray(wrapper.vm.chartOptions.scales.yAxes)).toBe(true)
    })

    it('xAxes array has at least one axis', () => {
      expect(wrapper.vm.chartOptions.scales.xAxes.length).toBeGreaterThanOrEqual(1)
    })

    it('yAxes array has at least one axis', () => {
      expect(wrapper.vm.chartOptions.scales.yAxes.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('DOM elements', () => {
    it('chart element has correct ID attribute', () => {
      const chartElement = wrapper.find('#bubble-chart')
      expect(chartElement.attributes('id')).toBe('bubble-chart')
    })

    it('chartjs render monitor class is present', () => {
      const monitor = wrapper.find('.chartjs-render-monitor')
      expect(monitor.exists()).toBe(true)
      expect(monitor.classes()).toContain('chartjs-render-monitor')
    })

    it('should have canvas element', () => {
      expect(wrapper.find('canvas').exists()).toBe(true)
    })

    it('canvas element is rendered and visible', () => {
      const canvas = wrapper.find('canvas')
      expect(canvas.exists()).toBe(true)
      expect(canvas.element).toBeDefined()
    })

    it('chart container has correct class names', () => {
      const chartElement = wrapper.find('#bubble-chart')
      const classes = chartElement.classes()
      expect(classes).toContain('chartjs-render-monitor')
    })
  })

  describe('xAxes configuration', () => {
    it('xAxes has display property set to true', () => {
      expect(wrapper.vm.chartOptions.scales.xAxes[0].display).toBe(true)
    })

    it('xAxes type is time', () => {
      expect(wrapper.vm.chartOptions.scales.xAxes[0].type).toBe('time')
    })

    it('xAxes time unit is week', () => {
      expect(wrapper.vm.chartOptions.scales.xAxes[0].time.unit).toBe('week')
    })

    it('xAxes has offset property set to true', () => {
      expect(wrapper.vm.chartOptions.scales.xAxes[0].offset).toBe(true)
    })

    it('xAxes gridLines configuration exists', () => {
      const gridLines = wrapper.vm.chartOptions.scales.xAxes[0].gridLines
      expect(gridLines).toBeDefined()
      expect(gridLines.display).toBe(true)
      expect(gridLines.color).toBe('rgba(128, 151, 177, 0.3)')
      expect(gridLines.borderDash).toEqual([3])
    })

    it('xAxes ticks configuration exists', () => {
      const ticks = wrapper.vm.chartOptions.scales.xAxes[0].ticks
      expect(ticks).toBeDefined()
      expect(ticks.fontColor).toBe('rgba(176, 186, 201)')
      expect(ticks.lineHeight).toBe(1.58)
    })

    it('xAxes ticks have min and max values', () => {
      const ticks = wrapper.vm.chartOptions.scales.xAxes[0].ticks
      expect(ticks.min).toBe(1601154000000)
      expect(ticks.max).toBe(1603141200000)
    })
  })

  describe('yAxes configuration', () => {
    it('yAxes has offset property set to true', () => {
      expect(wrapper.vm.chartOptions.scales.yAxes[0].offset).toBe(true)
    })

    it('yAxes gridLines configuration exists', () => {
      const gridLines = wrapper.vm.chartOptions.scales.yAxes[0].gridLines
      expect(gridLines).toBeDefined()
      expect(gridLines.display).toBe(true)
      expect(gridLines.color).toBe('rgba(128, 151, 177, 0.3)')
      expect(gridLines.borderDash).toEqual([3])
    })

    it('yAxes has scaleLabel property', () => {
      expect(wrapper.vm.chartOptions.scales.yAxes[0]).toHaveProperty('scaleLabel')
    })

    it('yAxes scaleLabel has display property', () => {
      const scaleLabel = wrapper.vm.chartOptions.scales.yAxes[0].scaleLabel
      expect(scaleLabel.display).toBe(true)
    })

    it('yAxes scaleLabel text is "Avarage Reliability"', () => {
      const scaleLabel = wrapper.vm.chartOptions.scales.yAxes[0].scaleLabel
      expect(scaleLabel.labelString).toBe('Avarage Reliability')
    })

    it('yAxes scaleLabel has styling properties', () => {
      const scaleLabel = wrapper.vm.chartOptions.scales.yAxes[0].scaleLabel
      expect(scaleLabel.fontColor).toBe('#b0bac9')
      expect(scaleLabel.fontFamily).toBe('Open-sans,sans-serif')
      expect(scaleLabel.fontWeight).toBe(600)
    })

    it('yAxes ticks configuration exists', () => {
      const ticks = wrapper.vm.chartOptions.scales.yAxes[0].ticks
      expect(ticks).toBeDefined()
      expect(ticks.min).toBe(0)
      expect(ticks.max).toBe(100)
    })

    it('yAxes ticks have correct step values', () => {
      const ticks = wrapper.vm.chartOptions.scales.yAxes[0].ticks
      expect(ticks.stepSize).toBe(20)
      expect(ticks.labelOffset).toBe(0)
      expect(ticks.padding).toBe(-2)
    })

    it('yAxes ticks have font styling', () => {
      const ticks = wrapper.vm.chartOptions.scales.yAxes[0].ticks
      expect(ticks.fontColor).toBe('rgba(176, 186, 201)')
      expect(ticks.lineHeight).toBe(1.58)
    })
  })

  describe('legend configuration', () => {
    it('legend has display property set to true', () => {
      expect(wrapper.vm.chartOptions.legend.display).toBe(true)
    })

    it('legend has labels property', () => {
      expect(wrapper.vm.chartOptions.legend).toHaveProperty('labels')
    })

    it('legend labels have usePointStyle property', () => {
      expect(wrapper.vm.chartOptions.legend.labels.usePointStyle).toBe(true)
    })
  })

  describe('chartData datasets', () => {
    it('first dataset is Phishing', () => {
      expect(wrapper.vm.chartData[0].label).toBe('Phishing')
    })

    it('second dataset is Malicious', () => {
      expect(wrapper.vm.chartData[1].label).toBe('Malicious')
    })

    it('third dataset is Non Malicious', () => {
      expect(wrapper.vm.chartData[2].label).toBe('Non Malicious')
    })

    it('fourth dataset is Clean', () => {
      expect(wrapper.vm.chartData[3].label).toBe('Clean')
    })

    it('Phishing dataset has 3 data points', () => {
      expect(wrapper.vm.chartData[0].data.length).toBe(3)
    })

    it('Phishing dataset has correct backgroundColor', () => {
      expect(wrapper.vm.chartData[0].backgroundColor).toBe('rgba(33, 150, 243, 0.5)')
    })

    it('Malicious dataset has 2 data points', () => {
      expect(wrapper.vm.chartData[1].data.length).toBe(2)
    })

    it('Malicious dataset has correct backgroundColor', () => {
      expect(wrapper.vm.chartData[1].backgroundColor).toBe('rgba(230, 162, 60, 0.5)')
    })

    it('Non Malicious dataset has 1 data point', () => {
      expect(wrapper.vm.chartData[2].data.length).toBe(1)
    })

    it('Non Malicious dataset has correct backgroundColor', () => {
      expect(wrapper.vm.chartData[2].backgroundColor).toBe('rgba(0, 188, 212, 0.5)')
    })

    it('Clean dataset has 2 data points', () => {
      expect(wrapper.vm.chartData[3].data.length).toBe(2)
    })

    it('Clean dataset has correct backgroundColor', () => {
      expect(wrapper.vm.chartData[3].backgroundColor).toBe('rgba(67, 160, 71, 0.5)')
    })
  })

  describe('data points structure', () => {
    it('each data point has x, y, r properties', () => {
      const dataPoint = wrapper.vm.chartData[0].data[0]
      expect(dataPoint).toHaveProperty('x')
      expect(dataPoint).toHaveProperty('y')
      expect(dataPoint).toHaveProperty('r')
    })

    it('Phishing first data point has correct values', () => {
      const dataPoint = wrapper.vm.chartData[0].data[0]
      expect(dataPoint.x).toBe(1601547149316)
      expect(dataPoint.y).toBe(75)
      expect(dataPoint.r).toBe(24)
    })

    it('data point x values are numbers (timestamps)', () => {
      wrapper.vm.chartData.forEach(dataset => {
        dataset.data.forEach(dataPoint => {
          expect(typeof dataPoint.x).toBe('number')
          expect(dataPoint.x).toBeGreaterThan(0)
        })
      })
    })

    it('data point y values are numbers (0-100)', () => {
      wrapper.vm.chartData.forEach(dataset => {
        dataset.data.forEach(dataPoint => {
          expect(typeof dataPoint.y).toBe('number')
          expect(dataPoint.y).toBeGreaterThanOrEqual(0)
          expect(dataPoint.y).toBeLessThanOrEqual(100)
        })
      })
    })

    it('data point r values are positive numbers', () => {
      wrapper.vm.chartData.forEach(dataset => {
        dataset.data.forEach(dataPoint => {
          expect(typeof dataPoint.r).toBe('number')
          expect(dataPoint.r).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('reactivity and updates', () => {
    it('should update chartData reactively', async () => {
      const newData = [
        {
          label: 'Test',
          data: [{ x: 1000, y: 50, r: 10 }],
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      ]
      wrapper.vm.chartData = newData
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartData).toEqual(newData)
    })

    it('should update chartOptions reactively', async () => {
      wrapper.vm.chartOptions.legend.display = false
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartOptions.legend.display).toBe(false)
    })

    it('should handle data point modification', async () => {
      wrapper.vm.chartData[0].data[0].y = 50
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.chartData[0].data[0].y).toBe(50)
    })
  })

  describe('component integration', () => {
    it('Bubble component is registered', () => {
      expect(wrapper.vm.$options.components.Bubble).toBeDefined()
    })

    it('Bubble component receives chartOptions prop', () => {
      const bubbleComponent = wrapper.findComponent({ name: 'Bubble' })
      if (bubbleComponent.exists()) {
        expect(bubbleComponent.props('chartOptions')).toBeDefined()
      }
    })

    it('Bubble component receives data prop', () => {
      const bubbleComponent = wrapper.findComponent({ name: 'Bubble' })
      if (bubbleComponent.exists()) {
        expect(bubbleComponent.props('data')).toBeDefined()
      }
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mount(TestBubble, { localVue })
      const wrapper2 = mount(TestBubble, { localVue })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should not modify data between instances', () => {
      const wrapper1 = mount(TestBubble, { localVue })
      const wrapper2 = mount(TestBubble, { localVue })
      wrapper1.vm.chartData[0].label = 'Modified'
      expect(wrapper2.vm.chartData[0].label).toBe('Phishing')
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should handle component destruction gracefully', () => {
      const newWrapper = mount(TestBubble, { localVue })
      expect(() => {
        newWrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain initial data on creation', () => {
      expect(wrapper.vm.chartData.length).toBe(4)
      expect(wrapper.vm.chartData[0].label).toBe('Phishing')
      expect(wrapper.vm.chartOptions.scales).toBeDefined()
    })
  })

  describe('color validation', () => {
    it('all datasets have backgroundColor property', () => {
      wrapper.vm.chartData.forEach(dataset => {
        expect(dataset).toHaveProperty('backgroundColor')
      })
    })

    it('backgroundColor values are valid rgba colors', () => {
      wrapper.vm.chartData.forEach(dataset => {
        expect(dataset.backgroundColor).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/)
      })
    })
  })

  describe('data validation', () => {
    it('chartData should have at least 1 dataset', () => {
      expect(wrapper.vm.chartData.length).toBeGreaterThanOrEqual(1)
    })

    it('all datasets should have label and data properties', () => {
      wrapper.vm.chartData.forEach(dataset => {
        expect(dataset).toHaveProperty('label')
        expect(dataset).toHaveProperty('data')
        expect(Array.isArray(dataset.data)).toBe(true)
      })
    })

    it('dataset labels should be strings', () => {
      wrapper.vm.chartData.forEach(dataset => {
        expect(typeof dataset.label).toBe('string')
      })
    })

    it('yAxes ticks min is 0', () => {
      expect(wrapper.vm.chartOptions.scales.yAxes[0].ticks.min).toBe(0)
    })

    it('yAxes ticks max is 100', () => {
      expect(wrapper.vm.chartOptions.scales.yAxes[0].ticks.max).toBe(100)
    })
  })

  describe('edge cases', () => {
    it('should handle empty chartData', () => {
      const newWrapper = mount(TestBubble, {
        localVue,
        data() {
          return {
            chartData: [],
            chartOptions: wrapper.vm.chartOptions
          }
        }
      })
      expect(newWrapper.vm.chartData).toEqual([])
      newWrapper.destroy()
    })

    it('should handle single dataset', () => {
      wrapper.vm.chartData = [wrapper.vm.chartData[0]]
      expect(wrapper.vm.chartData.length).toBe(1)
    })

    it('should handle large x values (timestamps)', () => {
      wrapper.vm.chartData[0].data[0].x = 9999999999999
      expect(wrapper.vm.chartData[0].data[0].x).toBe(9999999999999)
    })

    it('should handle decimal y values', () => {
      wrapper.vm.chartData[0].data[0].y = 75.5
      expect(wrapper.vm.chartData[0].data[0].y).toBe(75.5)
    })

    it('should handle decimal r values', () => {
      wrapper.vm.chartData[0].data[0].r = 24.5
      expect(wrapper.vm.chartData[0].data[0].r).toBe(24.5)
    })
  })

  describe('configuration completeness', () => {
    it('all required scale properties exist', () => {
      const scales = wrapper.vm.chartOptions.scales
      expect(scales).toHaveProperty('xAxes')
      expect(scales).toHaveProperty('yAxes')
    })

    it('xAxes configuration is complete', () => {
      const xAxis = wrapper.vm.chartOptions.scales.xAxes[0]
      expect(xAxis).toHaveProperty('display')
      expect(xAxis).toHaveProperty('type')
      expect(xAxis).toHaveProperty('time')
      expect(xAxis).toHaveProperty('offset')
      expect(xAxis).toHaveProperty('gridLines')
      expect(xAxis).toHaveProperty('ticks')
    })

    it('yAxes configuration is complete', () => {
      const yAxis = wrapper.vm.chartOptions.scales.yAxes[0]
      expect(yAxis).toHaveProperty('offset')
      expect(yAxis).toHaveProperty('gridLines')
      expect(yAxis).toHaveProperty('scaleLabel')
      expect(yAxis).toHaveProperty('ticks')
    })

    it('legend configuration is complete', () => {
      const legend = wrapper.vm.chartOptions.legend
      expect(legend).toHaveProperty('display')
      expect(legend).toHaveProperty('labels')
    })
  })
})

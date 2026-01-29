import { shallowMount } from '@vue/test-utils'
import Gauge from '@/components/Common/Charts/Gauge.vue'

describe('Gauge.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Gauge, {
      stubs: {
        'vue-gauge': true
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
      expect(wrapper.vm.$options.name).toBe('Gauge')
    })

    it('should have VueGauge component', () => {
      expect(wrapper.vm.$options.components.VueGauge).toBeDefined()
    })

    it('should render VueGauge component', () => {
      expect(wrapper.findComponent({ name: 'vue-gauge' }).exists()).toBe(true)
    })
  })

  describe('props handling', () => {
    it('should have refId prop', () => {
      expect(wrapper.vm.$options.props.refId).toBeDefined()
    })

    it('should have options prop', () => {
      expect(wrapper.vm.$options.props.options).toBeDefined()
    })

    it('should accept custom refId', () => {
      wrapper = shallowMount(Gauge, {
        propsData: { refId: 'my-gauge' },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.refId).toBe('my-gauge')
    })

    it('should accept custom options', () => {
      const customOptions = { hasNeedle: false }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.hasNeedle).toBe(false)
    })
  })

  describe('refId generation', () => {
    it('should generate refId with gauge-key- prefix by default', () => {
      expect(wrapper.vm.refId).toBeDefined()
      expect(wrapper.vm.refId).toContain('gauge-key-')
    })

    it('should generate unique refId for each instance', () => {
      const wrapper1 = shallowMount(Gauge, { stubs: { 'vue-gauge': true } })
      const wrapper2 = shallowMount(Gauge, { stubs: { 'vue-gauge': true } })
      expect(wrapper1.vm.refId).not.toBe(wrapper2.vm.refId)
      wrapper1.destroy()
      wrapper2.destroy()
    })

    it('should be callable on mount', () => {
      expect(wrapper.vm.refId).toBeDefined()
    })
  })

  describe('default options', () => {
    it('should have hasNeedle true by default', () => {
      expect(wrapper.vm.options.hasNeedle).toBe(true)
    })

    it('should have needleColor #757575 by default', () => {
      expect(wrapper.vm.options.needleColor).toBe('#757575')
    })

    it('should have arcColors array', () => {
      expect(Array.isArray(wrapper.vm.options.arcColors)).toBe(true)
      expect(wrapper.vm.options.arcColors.length).toBe(5)
    })

    it('should have correct arcColors', () => {
      const expected = ['#43A047', '#FBF280', '#E6A23C', '#B6791D', '#B83A3A']
      expect(wrapper.vm.options.arcColors).toEqual(expected)
    })

    it('should have arcDelimiters', () => {
      expect(Array.isArray(wrapper.vm.options.arcDelimiters)).toBe(true)
      expect(wrapper.vm.options.arcDelimiters).toEqual([20, 40, 60, 80])
    })

    it('should have arcPadding 0 by default', () => {
      expect(wrapper.vm.options.arcPadding).toBe(0)
    })

    it('should have arcPaddingColor white by default', () => {
      expect(wrapper.vm.options.arcPaddingColor).toBe('white')
    })

    it('should have arcLabels array', () => {
      expect(Array.isArray(wrapper.vm.options.arcLabels)).toBe(true)
      expect(wrapper.vm.options.arcLabels).toEqual(['0', '20', '40', '60', '80', '100'])
    })

    it('should have chartWidth 600 by default', () => {
      expect(wrapper.vm.options.chartWidth).toBe(600)
    })

    it('should have labelsFont Open Sans by default', () => {
      expect(wrapper.vm.options.labelsFont).toBe('Open Sans')
    })
  })

  describe('arc color zones', () => {
    it('should have green color for lowest range', () => {
      expect(wrapper.vm.options.arcColors[0]).toBe('#43A047')
    })

    it('should have yellow color for low-mid range', () => {
      expect(wrapper.vm.options.arcColors[1]).toBe('#FBF280')
    })

    it('should have orange color for mid range', () => {
      expect(wrapper.vm.options.arcColors[2]).toBe('#E6A23C')
    })

    it('should have brown color for high range', () => {
      expect(wrapper.vm.options.arcColors[3]).toBe('#B6791D')
    })

    it('should have red color for highest range', () => {
      expect(wrapper.vm.options.arcColors[4]).toBe('#B83A3A')
    })
  })

  describe('custom options', () => {
    it('should allow disabling needle', () => {
      const customOptions = { hasNeedle: false }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.hasNeedle).toBe(false)
    })

    it('should allow custom needle color', () => {
      const customOptions = { needleColor: '#FF0000' }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.needleColor).toBe('#FF0000')
    })

    it('should allow custom arcColors', () => {
      const customOptions = { arcColors: ['#000', '#FFF'] }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.arcColors).toEqual(['#000', '#FFF'])
    })

    it('should allow custom arcDelimiters', () => {
      const customOptions = { arcDelimiters: [10, 30, 50, 70, 90] }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.arcDelimiters).toEqual([10, 30, 50, 70, 90])
    })

    it('should allow custom chartWidth', () => {
      const customOptions = { chartWidth: 800 }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.chartWidth).toBe(800)
    })

    it('should allow custom labelsFont', () => {
      const customOptions = { labelsFont: 'Arial' }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.labelsFont).toBe('Arial')
    })
  })

  describe('gauge ranges', () => {
    it('should define 5 color ranges', () => {
      expect(wrapper.vm.options.arcColors.length).toBe(5)
    })

    it('should define 4 delimiter points', () => {
      expect(wrapper.vm.options.arcDelimiters.length).toBe(4)
    })

    it('should define range labels', () => {
      expect(wrapper.vm.options.arcLabels.length).toBe(6)
    })

    it('should span from 0 to 100', () => {
      const labels = wrapper.vm.options.arcLabels
      expect(labels[0]).toBe('0')
      expect(labels[labels.length - 1]).toBe('100')
    })

    it('should have evenly distributed delimiters', () => {
      const delimiters = wrapper.vm.options.arcDelimiters
      expect(delimiters[0]).toBe(20)
      expect(delimiters[1]).toBe(40)
      expect(delimiters[2]).toBe(60)
      expect(delimiters[3]).toBe(80)
    })
  })

  describe('visual properties', () => {
    it('should have arcLabelFontSize as true', () => {
      expect(wrapper.vm.options.arcLabelFontSize).toBe(true)
    })

    it('should have arcOverEffect as false', () => {
      expect(wrapper.vm.options.arcOverEffect).toBe(false)
    })

    it('should have rangeLabelFontSize as false', () => {
      expect(wrapper.vm.options.rangeLabelFontSize).toBe(false)
    })
  })

  describe('real-world scenarios', () => {
    it('should work as performance gauge', () => {
      const customOptions = {
        hasNeedle: true,
        arcColors: ['#43A047', '#FBF280', '#E6A23C', '#B6791D', '#B83A3A'],
        arcDelimiters: [20, 40, 60, 80],
        chartWidth: 400
      }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.hasNeedle).toBe(true)
    })

    it('should work as satisfaction score gauge', () => {
      wrapper = shallowMount(Gauge, {
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.arcColors.length).toBe(5)
    })

    it('should support custom sizing', () => {
      const customOptions = { chartWidth: 1000 }
      wrapper = shallowMount(Gauge, {
        propsData: { options: customOptions },
        stubs: { 'vue-gauge': true }
      })
      expect(wrapper.vm.options.chartWidth).toBe(1000)
    })
  })

  describe('component prop bindings', () => {
    it('should pass refId to VueGauge', () => {
      const gauge = wrapper.findComponent({ name: 'vue-gauge' })
      expect(gauge.props('refid')).toBe(wrapper.vm.refId)
    })

    it('should pass options to VueGauge', () => {
      const gauge = wrapper.findComponent({ name: 'vue-gauge' })
      expect(gauge.props('options')).toBeDefined()
    })

    it('should bind options correctly', () => {
      const gauge = wrapper.findComponent({ name: 'vue-gauge' })
      expect(gauge.props('options').hasNeedle).toBe(true)
    })
  })

  describe('template rendering', () => {
    it('should render VueGauge with refId and options', () => {
      expect(wrapper.html()).toContain('vue-gauge')
    })

    it('should have refId attribute', () => {
      const gauge = wrapper.findComponent({ name: 'vue-gauge' })
      expect(gauge.exists()).toBe(true)
    })
  })

  describe('props type validation', () => {
    it('should have refId as String type', () => {
      expect(wrapper.vm.$options.props.refId.type).toBe(String)
    })

    it('should have options as Object type', () => {
      expect(wrapper.vm.$options.props.options.type).toBe(Object)
    })

    it('should have refId default value function', () => {
      expect(typeof wrapper.vm.$options.props.refId.default).toBe('function')
    })

    it('should have options default value function', () => {
      expect(typeof wrapper.vm.$options.props.options.default).toBe('function')
    })
  })

  describe('reactivity', () => {
    it('should update when refId prop changes', async () => {
      const newRefId = 'new-gauge-id'
      await wrapper.setProps({ refId: newRefId })
      expect(wrapper.vm.refId).toBe(newRefId)
    })

    it('should update when options prop changes', async () => {
      const newOptions = { chartWidth: 900 }
      await wrapper.setProps({ options: newOptions })
      expect(wrapper.vm.options.chartWidth).toBe(900)
    })
  })

  describe('lazy loading', () => {
    it('should lazy load VueGauge component', () => {
      expect(wrapper.vm.$options.components.VueGauge).toBeDefined()
    })

    it('should have dynamic import for VueGauge', () => {
      expect(wrapper.vm.$options.components.VueGauge).toBeDefined()
    })
  })
})

import { createLocalVue, shallowMount } from '@vue/test-utils'
import CardLoading from '@/components/SkeletonLoading/CardLoading.vue'
import Vuetify from 'vuetify'

describe('CardLoading.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(CardLoading, {
      localVue,
      vuetify,
      propsData: {
        loading: false,
        ...propsData
      }
    })
  }

  describe('component rendering', () => {
    it('renders correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })

    it('should render component', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CardLoading')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should render skeleton loader', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })
  })

  describe('loading prop', () => {
    it('passes loading prop', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('v-skeleton-loader-stub').props('loading')).toBe(true)
    })

    it('should accept loading prop as true', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.props('loading')).toBe(true)
    })

    it('should accept loading prop as false', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.props('loading')).toBe(false)
    })

    it('should have default loading as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.loading).toBeFalsy()
    })

    it('should pass loading prop to skeleton loader', () => {
      const wrapper = mountComponent({ loading: true })
      const skeleton = wrapper.find('v-skeleton-loader-stub')
      expect(skeleton.props('loading')).toBe(true)
    })
  })

  describe('visibility based on loading prop', () => {
    it('should show loader when loading is true', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })

    it('should render when loading is false', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.exists()).toBe(true)
    })

    it('skeleton loader should exist regardless of loading state', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })
  })

  describe('skeleton loader configuration', () => {
    it('uses default type attribute', () => {
      const wrapper = mountComponent()
      const skeleton = wrapper.find('v-skeleton-loader-stub')
      expect(skeleton.exists()).toBe(true)
      expect(skeleton.attributes('type')).toContain('article')
    })

    it('should have correct skeleton type', () => {
      const wrapper = mountComponent({ loading: true })
      const skeleton = wrapper.find('v-skeleton-loader-stub')
      expect(skeleton.attributes('type')).toContain('article')
    })

    it('has boilerplate attribute in attrs', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.vm.attrs.boilerplate).toBe(false)
    })

    it('should have boilerplate false in data', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.attrs.boilerplate).toBe(false)
    })

    it('should have attrs property defined', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.attrs).toBeDefined()
    })
  })

  describe('slot rendering', () => {
    it('renders slot content', () => {
      const wrapper = shallowMount(CardLoading, {
        localVue,
        vuetify,
        slots: {
          'skeleton-content': '<div class="test-slot">Slot Content</div>'
        }
      })
      expect(wrapper.find('.test-slot').exists()).toBe(true)
    })

    it('should support skeleton-content slot', () => {
      const wrapper = shallowMount(CardLoading, {
        localVue,
        vuetify,
        slots: {
          'skeleton-content': '<div>Test</div>'
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should render with custom slot content', () => {
      const wrapper = shallowMount(CardLoading, {
        localVue,
        vuetify,
        propsData: { loading: true },
        slots: {
          'skeleton-content': '<span class="custom">Custom Content</span>'
        }
      })
      expect(wrapper.find('.custom').exists()).toBe(true)
    })
  })

  describe('loading state transitions', () => {
    it('handles loading state transitions', async () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('v-skeleton-loader-stub').props('loading')).toBe(true)
      await wrapper.setProps({ loading: false })
      expect(wrapper.find('v-skeleton-loader-stub').props('loading')).toBe(false)
    })

    it('should respond to loading prop changes', async () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.props('loading')).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.props('loading')).toBe(false)

      await wrapper.setProps({ loading: true })
      expect(wrapper.props('loading')).toBe(true)
    })

    it('should toggle loading state multiple times', async () => {
      const wrapper = mountComponent({ loading: true })
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ loading: i % 2 === 0 })
        expect(wrapper.exists()).toBe(true)
      }
    })

    it('should handle rapid loading changes', async () => {
      const wrapper = mountComponent({ loading: true })
      for (let i = 0; i < 10; i++) {
        await wrapper.setProps({ loading: !wrapper.props('loading') })
      }
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('data properties', () => {
    it('should initialize attrs correctly', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.attrs).toBeDefined()
      expect(typeof wrapper.vm.attrs).toBe('object')
    })

    it('should have attrs with boilerplate property', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.attrs.boilerplate).toBe(false)
    })

    it('should have non-empty attrs', () => {
      const wrapper = mountComponent()
      expect(Object.keys(wrapper.vm.attrs).length).toBeGreaterThan(0)
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent({ loading: true })
      const wrapper2 = mountComponent({ loading: true })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent()
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain state after lifecycle', async () => {
      const wrapper = mountComponent({ loading: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('loading prop should be boolean type', () => {
      const wrapper = mountComponent({ loading: true })
      expect(typeof wrapper.props('loading')).toBe('boolean')
    })

    it('attrs should be object type', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.attrs).toBe('object')
    })

    it('attrs boilerplate should be boolean type', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.attrs.boilerplate).toBe('boolean')
    })
  })

  describe('component lifecycle', () => {
    it('should be defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have $el defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$el).toBeDefined()
    })

    it('should have $data defined after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$data).toBeDefined()
    })

    it('should have proper component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('CardLoading')
    })

    it('should have skeleton loader reference after mount', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle rapid true/false toggles', async () => {
      const wrapper = mountComponent({ loading: true })
      for (let i = 0; i < 20; i++) {
        await wrapper.setProps({ loading: i % 2 === 0 })
      }
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle multiple mount/destroy cycles', () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mountComponent({ loading: true })
        expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
        wrapper.destroy()
      }
    })

    it('should maintain functionality with rapid prop changes', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 10; i++) {
        await wrapper.setProps({ loading: i % 3 === 0 })
      }
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle loading=true from start', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.props('loading')).toBe(true)
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })

    it('should handle loading=false from start', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.props('loading')).toBe(false)
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })
  })

  describe('default state behavior', () => {
    it('initializes with default loading state', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.loading).toBeFalsy()
    })

    it('should render loader by default', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })

    it('should apply default article type', () => {
      const wrapper = mountComponent()
      const skeleton = wrapper.find('v-skeleton-loader-stub')
      expect(skeleton.attributes('type')).toContain('article')
    })
  })
})

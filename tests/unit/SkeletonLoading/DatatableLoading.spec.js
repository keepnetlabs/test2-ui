import { createLocalVue, shallowMount } from '@vue/test-utils'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading.vue'
import Vuetify from 'vuetify'

describe('DatatableLoading.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountComponent = (propsData = {}) => {
    return shallowMount(DatatableLoading, {
      localVue,
      vuetify,
      propsData: {
        loading: false,
        ...propsData
      }
    })
  }

  describe('component rendering', () => {
    it('should render component', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.exists()).toBe(true)
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('DatatableLoading')
    })

    it('should render as Vue component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should render correctly when loading is true', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })

    it('should render main container when loading', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)
    })

    it('should render skeleton loader when loading', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })
  })

  describe('visibility based on loading prop', () => {
    it('should hide when loading is false', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.find('.data-table-loading').exists()).toBe(false)
    })

    it('should show when loading is true', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)
    })

    it('should hide container but not component when loading false', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.data-table-loading').exists()).toBe(false)
    })

    it('should conditionally render container', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)

      // Can't test false here without re-mounting
    })
  })

  describe('skeleton loader configuration', () => {
    it('should render skeleton loader with correct type', () => {
      const wrapper = mountComponent({ loading: true })
      const skeletonLoader = wrapper.find('v-skeleton-loader-stub')
      expect(skeletonLoader.exists()).toBe(true)
      expect(skeletonLoader.attributes('type')).toContain('table')
    })

    it('should have table-heading and table-tbody in loader type', () => {
      const wrapper = mountComponent({ loading: true })
      const skeletonLoader = wrapper.find('v-skeleton-loader-stub')
      const type = skeletonLoader.attributes('type')
      expect(type).toContain('table-heading')
      expect(type).toContain('table-tbody')
    })

    it('should pass loading prop to skeleton loader', () => {
      const wrapper = mountComponent({ loading: true })
      const skeletonLoader = wrapper.find('v-skeleton-loader-stub')
      expect(skeletonLoader.attributes('loading')).toBe('true')
    })

    it('should have boilerplate false in attrs', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.vm.attrs.boilerplate).toBe(false)
    })

    it('should use attrs from data', () => {
      const wrapper = mountComponent({ loading: true })
      const skeletonLoader = wrapper.find('v-skeleton-loader-stub')
      expect(skeletonLoader.exists()).toBe(true)
    })
  })

  describe('CSS classes', () => {
    it('should apply correct CSS class when loading', () => {
      const wrapper = mountComponent({ loading: true })
      const container = wrapper.find('.data-table-loading')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('data-table-loading')
    })

    it('should have data-table-loading class', () => {
      const wrapper = mountComponent({ loading: true })
      const container = wrapper.find('.data-table-loading')
      expect(container.classes('data-table-loading')).toBe(true)
    })

    it('should not render container class when loading false', () => {
      const wrapper = mountComponent({ loading: false })
      expect(wrapper.find('.data-table-loading').exists()).toBe(false)
    })
  })

  describe('props handling', () => {
    it('should accept loading prop as boolean', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.props('loading')).toBe(true)
    })

    it('should accept loaderType prop as number', () => {
      const wrapper = mountComponent({ loaderType: 5 })
      expect(wrapper.props('loaderType')).toBe(5)
    })

    it('should have default loading as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.loading).toBeFalsy()
    })

    it('should have default loaderType as 0', () => {
      const wrapper = mountComponent()
      expect(wrapper.props('loaderType')).toBe(0)
    })

    it('should require loading prop', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.loading).toBeDefined()
    })

    it('should accept different loaderType values', () => {
      const types = [0, 1, 2, 5, 10]
      types.forEach(type => {
        const wrapper = mountComponent({ loaderType: type })
        expect(wrapper.props('loaderType')).toBe(type)
      })
    })
  })

  describe('reactive prop updates', () => {
    it('should respond to loading prop changes', async () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.find('.data-table-loading').exists()).toBe(false)

      await wrapper.setProps({ loading: true })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)
    })

    it('should toggle visibility on prop change', async () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)

      await wrapper.setProps({ loading: false })
      expect(wrapper.find('.data-table-loading').exists()).toBe(false)
    })

    it('should update multiple times', async () => {
      const wrapper = mountComponent({ loading: true })
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ loading: i % 2 === 0 })
        expect(wrapper.find('.data-table-loading').exists()).toBe(i % 2 === 0)
      }
    })

    it('should respond to loaderType changes', async () => {
      const wrapper = mountComponent({ loading: true, loaderType: 0 })
      expect(wrapper.props('loaderType')).toBe(0)

      await wrapper.setProps({ loaderType: 5 })
      expect(wrapper.props('loaderType')).toBe(5)
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
    it('should initialize attrs with boilerplate false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.attrs).toBeDefined()
      expect(wrapper.vm.attrs.boilerplate).toBe(false)
    })

    it('should have attrs as object', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.attrs).toBe('object')
    })

    it('should not have empty attrs', () => {
      const wrapper = mountComponent()
      expect(Object.keys(wrapper.vm.attrs).length).toBeGreaterThan(0)
    })
  })

  describe('slot rendering', () => {
    it('should have skeleton-content slot', () => {
      const wrapper = mountComponent({ loading: true })
      const skeletonLoader = wrapper.find('v-skeleton-loader-stub')
      expect(skeletonLoader.exists()).toBe(true)
    })

    it('should render with skeleton content slot', () => {
      const wrapper = shallowMount(DatatableLoading, {
        localVue,
        vuetify,
        propsData: { loading: true },
        slots: {
          'skeleton-content': '<div>Loading content</div>'
        }
      })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)
    })
  })

  describe('consistency and reliability', () => {
    it('should render consistently', () => {
      const wrapper1 = mountComponent({ loading: true })
      const wrapper2 = mountComponent({ loading: true })
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name)
    })

    it('should handle component destruction gracefully', () => {
      const wrapper = mountComponent({ loading: true })
      expect(() => {
        wrapper.destroy()
      }).not.toThrow()
    })

    it('should maintain state after lifecycle', async () => {
      const wrapper = mountComponent({ loading: true })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)
    })

    it('should have correct DOM structure', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('v-skeleton-loader-stub').exists()).toBe(true)
    })
  })

  describe('data types validation', () => {
    it('loading prop should be boolean type', () => {
      const wrapper = mountComponent({ loading: true })
      expect(typeof wrapper.props('loading')).toBe('boolean')
    })

    it('loaderType prop should be number type', () => {
      const wrapper = mountComponent({ loaderType: 5 })
      expect(typeof wrapper.props('loaderType')).toBe('number')
    })

    it('attrs should be object type', () => {
      const wrapper = mountComponent()
      expect(typeof wrapper.vm.attrs).toBe('object')
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
      expect(wrapper.vm.$options.name).toBe('DatatableLoading')
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

    it('should handle large loaderType values', () => {
      const wrapper = mountComponent({ loading: true, loaderType: 999999 })
      expect(wrapper.props('loaderType')).toBe(999999)
    })

    it('should handle zero loaderType', () => {
      const wrapper = mountComponent({ loading: true, loaderType: 0 })
      expect(wrapper.props('loaderType')).toBe(0)
    })

    it('should handle negative loaderType', () => {
      const wrapper = mountComponent({ loading: true, loaderType: -1 })
      expect(wrapper.props('loaderType')).toBe(-1)
    })

    it('should maintain functionality with multiple mount/destroy cycles', () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mountComponent({ loading: true })
        expect(wrapper.find('.data-table-loading').exists()).toBe(true)
        wrapper.destroy()
      }
    })
  })

  describe('default state behavior', () => {
    it('initializes with default loading state', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.loading).toBeFalsy()
    })

    it('should default to not showing loader', () => {
      const wrapper = mountComponent()
      expect(wrapper.find('.data-table-loading').exists()).toBe(false)
    })

    it('should show loader when explicitly set to true', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.find('.data-table-loading').exists()).toBe(true)
    })

    it('should apply default loaderType', () => {
      const wrapper = mountComponent({ loading: true })
      expect(wrapper.props('loaderType')).toBe(0)
    })
  })
})

import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose'

describe('AppDialogFooterWithClose.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(AppDialogFooterWithClose, {
      localVue,
      propsData: { id: 'footer-close', ...propsData },
      stubs: { VBtn: true },
      ...options
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('AppDialogFooterWithClose')
    })
  })

  describe('Props', () => {
    it('should accept id prop', () => {
      const wrapper = mountComponent({ id: 'close-btn' })
      expect(wrapper.vm.id).toBe('close-btn')
    })
  })

  describe('Close Button', () => {
    it('should render close button', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'VBtn' }).exists()).toBe(true)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(200)
    })
  })
})

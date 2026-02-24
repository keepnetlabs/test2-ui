import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'

describe('AppDialogFooter.vue', () => {
  const localVue = createLocalVue()

  const defaultProps = {
    cancelButtonId: 'btn-cancel',
    confirmButtonId: 'btn-confirm'
  }

  const mountComponent = (propsData = {}, options = {}) => {
    return shallowMount(AppDialogFooter, {
      localVue,
      propsData: { ...defaultProps, ...propsData },
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
      expect(wrapper.vm.$options.name).toBe('AppDialogFooter')
    })
  })

  describe('Props', () => {
    it('should accept cancelButtonId prop', () => {
      const wrapper = mountComponent({ cancelButtonId: 'cancel-btn' })
      expect(wrapper.vm.cancelButtonId).toBe('cancel-btn')
    })

    it('should accept confirmButtonId prop', () => {
      const wrapper = mountComponent({ confirmButtonId: 'confirm-btn' })
      expect(wrapper.vm.confirmButtonId).toBe('confirm-btn')
    })

    it('should accept confirmButtonDisabled prop', () => {
      const wrapper = mountComponent({ confirmButtonDisabled: true })
      expect(wrapper.vm.confirmButtonDisabled).toBe(true)
    })
  })

  describe('Button Labels', () => {
    it('should display cancel button text', () => {
      const wrapper = mountComponent({ cancelButtonText: 'Cancel' })
      expect(wrapper.text()).toContain('Cancel')
    })

    it('should display action button text', () => {
      const wrapper = mountComponent({ actionButtonText: 'Confirm' })
      expect(wrapper.text()).toContain('Confirm')
    })
  })

  describe('Button States', () => {
    it('should have cancel button', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.cancelButtonId).toBeDefined()
    })

    it('should have confirm button', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.confirmButtonId).toBeDefined()
    })

    it('should disable confirm button when specified', () => {
      const wrapper = mountComponent({ confirmButtonDisabled: true })
      expect(wrapper.vm.confirmButtonDisabled).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', () => {
      const wrapper1 = mountComponent({ cancelButtonId: 'cancel-1' })
      const wrapper2 = mountComponent({ cancelButtonId: 'cancel-2' })

      expect(wrapper1.vm.cancelButtonId).toBe('cancel-1')
      expect(wrapper2.vm.cancelButtonId).toBe('cancel-2')
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

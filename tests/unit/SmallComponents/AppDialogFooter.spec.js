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

    it('should accept confirmButtonLoading prop defaulting to false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.confirmButtonLoading).toBe(false)
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

    it('passes loading to confirm v-btn when confirmButtonLoading is true', () => {
      const wrapper = mountComponent({ confirmButtonLoading: true })
      const buttons = wrapper.findAllComponents({ name: 'VBtn' })
      expect(buttons.length).toBeGreaterThanOrEqual(2)
      expect(buttons.at(1).props('loading')).toBe(true)
      expect(buttons.at(1).props('disabled')).toBe(true)
    })

    it('confirmButtonLoading defaults to false and does not disable confirm by itself', () => {
      const wrapper = mountComponent({ confirmButtonDisabled: false })
      const buttons = wrapper.findAllComponents({ name: 'VBtn' })
      expect(buttons.at(1).props('loading')).toBe(false)
      expect(buttons.at(1).props('disabled')).toBe(false)
    })

    it('cancel button is not affected by confirmButtonLoading', () => {
      const wrapper = mountComponent({ confirmButtonLoading: true })
      const buttons = wrapper.findAllComponents({ name: 'VBtn' })
      expect(buttons.at(0).props('loading')).toBeFalsy()
    })

    it('confirm stays disabled when confirmButtonDisabled true even if loading is false', () => {
      const wrapper = mountComponent({
        confirmButtonDisabled: true,
        confirmButtonLoading: false
      })
      const buttons = wrapper.findAllComponents({ name: 'VBtn' })
      expect(buttons.at(1).props('disabled')).toBe(true)
      expect(buttons.at(1).props('loading')).toBe(false)
    })

    it('confirm is disabled when both confirmButtonDisabled and confirmButtonLoading are true', () => {
      const wrapper = mountComponent({
        confirmButtonDisabled: true,
        confirmButtonLoading: true
      })
      expect(wrapper.findAllComponents({ name: 'VBtn' }).at(1).props('disabled')).toBe(true)
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

  describe('Methods', () => {
    it('closeButtonClick emits handleClose', () => {
      const wrapper = mountComponent()
      wrapper.vm.closeButtonClick()
      expect(wrapper.emitted('handleClose')).toHaveLength(1)
    })

    it('confirmButtonClick emits handleConfirm', () => {
      const wrapper = mountComponent()
      wrapper.vm.confirmButtonClick()
      expect(wrapper.emitted('handleConfirm')).toHaveLength(1)
    })
  })

  describe('computed (delete type)', () => {
    it('getActionButtonColor uses delete palette when type is delete', () => {
      const wrapper = mountComponent({ type: 'delete', actionButtonColor: '#2196f3' })
      expect(wrapper.vm.getActionButtonColor).toBe('#f56c6c')
    })

    it('getCancelButtonColor uses delete palette when type is delete', () => {
      const wrapper = mountComponent({ type: 'delete', cancelButtonColor: '#f56c6c' })
      expect(wrapper.vm.getCancelButtonColor).toBe('#383b41')
    })

    it('getActionButtonText is DELETE for delete type unless isForceActionButtonText', () => {
      const wrapper = mountComponent({ type: 'delete', actionButtonText: 'Remove item' })
      expect(wrapper.vm.getActionButtonText).toBe('DELETE')

      const forced = mountComponent({
        type: 'delete',
        actionButtonText: 'Remove item',
        isForceActionButtonText: true
      })
      expect(forced.vm.getActionButtonText).toBe('Remove item')
    })
  })

  describe('layout', () => {
    it('applies justify prop to root flex class', () => {
      const wrapper = mountComponent({ justify: 'start' })
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['justify-start']))
    })
  })
})

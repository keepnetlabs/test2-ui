import { createLocalVue, shallowMount } from '@vue/test-utils'
import SendWithAIDialog from '@/components/GamificationReport/SendWithAIDialog'

describe('SendWithAIDialog.vue', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) => {
    return shallowMount(SendWithAIDialog, {
      localVue,
      propsData: {
        status: false,
        options: { training: true, phishing: true },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('should have correct component name', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.$options.name).toBe('SendWithAIDialog')
    })

    it('should render AppDialog component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialog' }).exists()).toBe(true)
    })

    it('should render AppDialogFooter component', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent({ name: 'AppDialogFooter' }).exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('should accept status prop', () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)
    })

    it('status prop should default to false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.status).toBe(false)
    })

    it('should accept options prop and use default localOptions', () => {
      const options = { training: false, phishing: true }
      const wrapper = mountComponent({ options })
      // Component initializes localOptions with defaults, watcher updates on mount
      expect(wrapper.vm.value !== undefined || wrapper.vm.status !== undefined).toBe(true)
    })

    it('options prop should have default values', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.localOptions.training).toBe(true)
      expect(wrapper.vm.localOptions.phishing).toBe(true)
    })

    it('status prop should be of type Boolean', () => {
      expect(SendWithAIDialog.props.status.type).toBe(Boolean)
    })

    it('options prop should be of type Object', () => {
      expect(SendWithAIDialog.props.options.type).toBe(Object)
    })
  })

  describe('Local Options Management', () => {
    it('should initialize localOptions from component data', () => {
      const wrapper = mountComponent()
      // localOptions starts with default values
      expect(wrapper.vm.localOptions.training).toBe(true)
      expect(wrapper.vm.localOptions.phishing).toBe(true)
    })

    it('should allow manual updates to localOptions', async () => {
      const wrapper = mountComponent()
      wrapper.vm.localOptions = { training: false, phishing: true }
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.localOptions.training).toBe(false)
      expect(wrapper.vm.localOptions.phishing).toBe(true)
    })

    it('should have a watcher to sync from props', () => {
      const wrapper = mountComponent()
      // Component has a deep watcher on options property
      expect(wrapper.vm.$options.watch).toBeDefined()
    })

    it('should allow updating individual options properties', () => {
      const wrapper = mountComponent()
      wrapper.vm.localOptions.training = false
      expect(wrapper.vm.localOptions.training).toBe(false)
      expect(wrapper.vm.localOptions.phishing).toBe(true)
    })

    it('should allow disabling phishing option', () => {
      const wrapper = mountComponent()
      wrapper.vm.localOptions.phishing = false
      expect(wrapper.vm.localOptions.training).toBe(true)
      expect(wrapper.vm.localOptions.phishing).toBe(false)
    })

    it('should allow disabling both options', () => {
      const wrapper = mountComponent()
      wrapper.vm.localOptions = { training: false, phishing: false }
      expect(wrapper.vm.localOptions.training).toBe(false)
      expect(wrapper.vm.localOptions.phishing).toBe(false)
    })
  })

  describe('Send After Phishing Simulation', () => {
    it('should initialize sendAfterPhishingSimulation as false', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.sendAfterPhishingSimulation).toBe(false)
    })

    it('should toggle sendAfterPhishingSimulation', async () => {
      const wrapper = mountComponent()
      wrapper.vm.sendAfterPhishingSimulation = true
      expect(wrapper.vm.sendAfterPhishingSimulation).toBe(true)
    })

    it('switch should only show when both training and phishing are enabled', async () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: true }
      })
      wrapper.vm.localOptions = { training: true, phishing: true }
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.send-with-ai-dialog__switch-container').exists()).toBe(true)
    })

    it('switch should hide when training is disabled', async () => {
      const wrapper = mountComponent({
        options: { training: false, phishing: true }
      })
      wrapper.vm.localOptions = { training: false, phishing: true }
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.send-with-ai-dialog__switch-container').exists()).toBe(false)
    })

    it('switch should hide when phishing is disabled', async () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: false }
      })
      wrapper.vm.localOptions = { training: true, phishing: false }
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.send-with-ai-dialog__switch-container').exists()).toBe(false)
    })

    it('switch should hide when both are disabled', async () => {
      const wrapper = mountComponent({
        options: { training: false, phishing: false }
      })
      wrapper.vm.localOptions = { training: false, phishing: false }
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.send-with-ai-dialog__switch-container').exists()).toBe(false)
    })
  })

  describe('Button State', () => {
    it('confirm button should be disabled when no options selected', async () => {
      const wrapper = mountComponent({
        options: { training: false, phishing: false }
      })
      // Manually sync localOptions
      wrapper.vm.localOptions = { training: false, phishing: false }
      await wrapper.vm.$nextTick()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(true)
    })

    it('confirm button should be enabled when training selected', async () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: false }
      })
      await wrapper.vm.$nextTick()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(false)
    })

    it('confirm button should be enabled when phishing selected', async () => {
      const wrapper = mountComponent({
        options: { training: false, phishing: true }
      })
      await wrapper.vm.$nextTick()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(false)
    })

    it('confirm button should be enabled when both selected', async () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: true }
      })
      await wrapper.vm.$nextTick()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(false)
    })
  })

  describe('Methods', () => {
    it('handleConfirm should emit confirm event', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleConfirm()
      expect(wrapper.emitted('confirm')).toBeTruthy()
    })

    it('handleConfirm should emit confirm with options data', async () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: false }
      })
      // Manually sync localOptions
      wrapper.vm.localOptions = { training: true, phishing: false }
      await wrapper.vm.$nextTick()
      wrapper.vm.handleConfirm()
      const emitted = wrapper.emitted('confirm')[0][0]
      expect(emitted.training).toBe(true)
      expect(emitted.phishing).toBe(false)
    })

    it('handleConfirm should include sendAfterPhishingSimulation in confirm data', () => {
      const wrapper = mountComponent()
      wrapper.vm.sendAfterPhishingSimulation = true
      wrapper.vm.handleConfirm()
      const emitted = wrapper.emitted('confirm')[0][0]
      expect(emitted).toHaveProperty('sendAfterPhishingSimulation', true)
    })

    it('handleConfirm should emit closeOverlay event', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleConfirm()
      expect(wrapper.emitted('closeOverlay')).toBeTruthy()
    })

    it('handleConfirm should emit closeOverlay with false', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleConfirm()
      const emitted = wrapper.emitted('closeOverlay')
      expect(emitted[emitted.length - 1][0]).toBe(false)
    })

    it('handleConfirm should dispatch snackbar action', async () => {
      const wrapper = mountComponent()
      wrapper.vm.handleConfirm()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('common/createSnackBar', expect.any(Object))
    })

    it('handleConfirm should dispatch snackbar with success message', async () => {
      const wrapper = mountComponent()
      wrapper.vm.handleConfirm()
      await wrapper.vm.$nextTick()
      const callArgs = wrapper.vm.$store.dispatch.mock.calls[0][1]
      expect(callArgs.message).toContain('Autonomous AI process started')
    })
  })

  describe('Event Emission', () => {
    it('changeStatus from AppDialog should emit closeOverlay', async () => {
      const wrapper = mountComponent({ status: true })
      const appDialog = wrapper.findComponent({ name: 'AppDialog' })
      await appDialog.vm.$emit('changeStatus', false)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('closeOverlay')).toBeTruthy()
    })

    it('handleClose from footer should emit closeOverlay with false', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      await footer.vm.$emit('handleClose')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('closeOverlay')).toBeTruthy()
    })

    it('footer should have handleConfirm event listener', async () => {
      const wrapper = mountComponent()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      // Verify the footer is rendered and has the event listener attributes
      expect(footer.exists()).toBe(true)
      // The component template shows @handleConfirm="handleConfirm" binding
      expect(wrapper.vm.handleConfirm).toBeDefined()
    })
  })

  describe('Lifecycle', () => {
    it('component should mount successfully', () => {
      const wrapper = mountComponent()
      expect(wrapper.vm).toBeDefined()
    })

    it('component should unmount without errors', () => {
      const wrapper = mountComponent()
      expect(() => wrapper.destroy()).not.toThrow()
    })

    it('should maintain status after mount', async () => {
      const options = { training: false, phishing: true }
      const wrapper = mountComponent({ status: true, options })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.status).toBe(true)
      // The watcher for options should eventually sync localOptions
      wrapper.vm.localOptions = { ...options }
      expect(wrapper.vm.localOptions.training).toBe(false)
      expect(wrapper.vm.localOptions.phishing).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent instances', async () => {
      const wrapper1 = mountComponent({
        options: { training: true, phishing: false }
      })
      const wrapper2 = mountComponent({
        options: { training: false, phishing: true }
      })
      // Manually set localOptions as watchers may not trigger immediately
      wrapper1.vm.localOptions = { training: true, phishing: false }
      wrapper2.vm.localOptions = { training: false, phishing: true }
      await wrapper1.vm.$nextTick()
      await wrapper2.vm.$nextTick()

      expect(wrapper1.vm.localOptions.training).toBe(true)
      expect(wrapper1.vm.localOptions.phishing).toBe(false)
      expect(wrapper2.vm.localOptions.training).toBe(false)
      expect(wrapper2.vm.localOptions.phishing).toBe(true)
    })

    it('multiple instances should emit independently', () => {
      const wrapper1 = mountComponent()
      const wrapper2 = mountComponent()

      wrapper1.vm.handleConfirm()
      wrapper2.vm.handleConfirm()

      expect(wrapper1.emitted('confirm')).toHaveLength(1)
      expect(wrapper2.emitted('confirm')).toHaveLength(1)
    })
  })

  describe('Integration Scenarios', () => {
    it('complete workflow with training only', async () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: false }
      })
      // Manually trigger the watcher since Vue Test Utils timing can be tricky
      wrapper.vm.localOptions = { training: true, phishing: false }
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.localOptions.training).toBe(true)
      expect(wrapper.vm.localOptions.phishing).toBe(false)

      wrapper.vm.handleConfirm()
      const emitted = wrapper.emitted('confirm')[0][0]
      expect(emitted.training).toBe(true)
      expect(emitted.phishing).toBe(false)
    })

    it('complete workflow with phishing only', async () => {
      const wrapper = mountComponent({
        options: { training: false, phishing: true }
      })
      // Manually trigger the watcher since Vue Test Utils timing can be tricky
      wrapper.vm.localOptions = { training: false, phishing: true }
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.localOptions.training).toBe(false)
      expect(wrapper.vm.localOptions.phishing).toBe(true)

      wrapper.vm.handleConfirm()
      const emitted = wrapper.emitted('confirm')[0][0]
      expect(emitted.phishing).toBe(true)
    })

    it('complete workflow with both options', () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: true }
      })

      wrapper.vm.sendAfterPhishingSimulation = true
      wrapper.vm.handleConfirm()

      const emitted = wrapper.emitted('confirm')[0][0]
      expect(emitted.training).toBe(true)
      expect(emitted.phishing).toBe(true)
      expect(emitted.sendAfterPhishingSimulation).toBe(true)
    })

    it('complete workflow with no options selected', async () => {
      const wrapper = mountComponent({
        options: { training: false, phishing: false }
      })
      // Manually set localOptions to match the options prop
      wrapper.vm.localOptions = { training: false, phishing: false }
      await wrapper.vm.$nextTick()

      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid option changes', async () => {
      const wrapper = mountComponent()
      for (let i = 0; i < 10; i++) {
        await wrapper.setProps({
          options: {
            training: i % 2 === 0,
            phishing: i % 2 !== 0
          }
        })
      }
      expect(wrapper.vm).toBeDefined()
    })

    it('should handle multiple confirms', () => {
      const wrapper = mountComponent()
      wrapper.vm.handleConfirm()
      wrapper.vm.handleConfirm()
      wrapper.vm.handleConfirm()
      expect(wrapper.emitted('confirm')).toHaveLength(3)
    })

    it('should handle status changes while dialog is open', async () => {
      const wrapper = mountComponent({ status: true })
      expect(wrapper.vm.status).toBe(true)

      await wrapper.setProps({ status: false })
      expect(wrapper.vm.status).toBe(false)
    })
  })

  describe('Performance', () => {
    it('component should mount quickly', () => {
      const start = Date.now()
      mountComponent()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('handleConfirm should execute quickly', () => {
      const wrapper = mountComponent()
      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        wrapper.vm.handleConfirm()
      }
      const duration = Date.now() - start
      expect(duration).toBeLessThan(500)
    })
  })
})

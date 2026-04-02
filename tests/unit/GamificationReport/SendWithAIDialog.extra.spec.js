import { createLocalVue, shallowMount } from '@vue/test-utils'
import SendWithAIDialog from '@/components/GamificationReport/SendWithAIDialog.vue'

describe('SendWithAIDialog.vue (extra coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(SendWithAIDialog, {
      localVue,
      propsData: {
        status: true,
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

  it('options prop default factory returns fresh objects with expected defaults', () => {
    const defaultFactory = SendWithAIDialog.props.options.default
    const first = defaultFactory()
    const second = defaultFactory()

    expect(first).toEqual({ training: true, phishing: true })
    expect(second).toEqual({ training: true, phishing: true })
    expect(first).not.toBe(second)
  })

  it('data() initializes local options and sendAfterPhishingSimulation', () => {
    const data = SendWithAIDialog.data.call({})
    expect(data.localOptions).toEqual({ training: true, phishing: true })
    expect(data.sendAfterPhishingSimulation).toBe(false)
  })

  it('options watcher clones incoming object instead of keeping same reference', () => {
    const wrapper = mountComponent()
    const newOptions = { training: false, phishing: true }

    wrapper.vm.$options.watch.options.handler.call(wrapper.vm, newOptions)

    expect(wrapper.vm.localOptions).toEqual(newOptions)
    expect(wrapper.vm.localOptions).not.toBe(newOptions)
  })

  it('handleConfirm emits confirm payload with sendAfterPhishingSimulation default false', () => {
    const wrapper = mountComponent({ options: { training: false, phishing: true } })
    wrapper.vm.localOptions = { training: false, phishing: true }
    wrapper.vm.sendAfterPhishingSimulation = false

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('confirm')[0][0]).toEqual({
      training: false,
      phishing: true,
      sendAfterPhishingSimulation: false
    })
  })

  it('handleConfirm does not close or dispatch snackbar directly even when both options are false', async () => {
    const wrapper = mountComponent({ options: { training: false, phishing: false } })
    wrapper.vm.localOptions = { training: false, phishing: false }

    wrapper.vm.handleConfirm()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('closeOverlay')).toBeFalsy()
    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
  })

  it('footer confirm-button-disabled becomes true only when both options are false', async () => {
    const wrapper = mountComponent({ options: { training: true, phishing: true } })
    wrapper.vm.localOptions = { training: false, phishing: false }
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'AppDialogFooter' }).props('confirmButtonDisabled')).toBe(
      true
    )

    wrapper.vm.localOptions = { training: true, phishing: false }
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'AppDialogFooter' }).props('confirmButtonDisabled')).toBe(
      false
    )
  })

  it('options watcher can sync partial payload and still allows confirm flow', async () => {
    const wrapper = mountComponent({ options: { training: true, phishing: true } })

    wrapper.vm.$options.watch.options.handler.call(wrapper.vm, { training: false })
    expect(wrapper.vm.localOptions).toEqual({ training: false })

    wrapper.vm.handleConfirm()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('confirm')[0][0]).toEqual({
      training: false,
      sendAfterPhishingSimulation: false
    })
    expect(wrapper.emitted('closeOverlay')).toBeFalsy()
  })

  it('options watcher handles null payload by resetting to empty object', () => {
    const wrapper = mountComponent({ options: { training: true, phishing: true } })

    wrapper.vm.$options.watch.options.handler.call(wrapper.vm, null)
    expect(wrapper.vm.localOptions).toEqual({})
  })

  it('handleConfirm emits confirm only and leaves feedback to parent flow', async () => {
    const wrapper = mountComponent({ options: { training: true, phishing: false } })
    wrapper.vm.localOptions = { training: true, phishing: false }

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('closeOverlay')).toBeFalsy()
    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
  })

  it('handleConfirm emits sendAfterPhishingSimulation=true when switch is enabled', async () => {
    const wrapper = mountComponent({ options: { training: true, phishing: true } })
    wrapper.vm.localOptions = { training: true, phishing: true }
    wrapper.vm.sendAfterPhishingSimulation = true

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('confirm')[0][0]).toEqual({
      training: true,
      phishing: true,
      sendAfterPhishingSimulation: true
    })
    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()
  })

  it('computes approval-specific title and action button copy', () => {
    const wrapper = mountComponent({ mode: 'approval', targetType: 'group' })

    expect(wrapper.vm.dialogTitle).toBe('Send with AI for Approval')
    expect(wrapper.vm.confirmButtonText).toBe('Send with AI for Approval')
    expect(wrapper.vm.dialogDescription).toContain('approval for this group')
    expect(wrapper.vm.dialogDescription).toContain("each user's individual risk signals")
  })

  it('computes group-aware autonomous description', () => {
    const wrapper = mountComponent({ targetType: 'group' })

    expect(wrapper.vm.dialogDescription).toContain('Select the actions to generate for this group')
    expect(wrapper.vm.dialogDescription).toContain("each user's individual risk signals")
  })

  it('computes personalized autonomous description for a single user', () => {
    const wrapper = mountComponent({ mode: 'autonomous', targetType: 'user' })

    expect(wrapper.vm.dialogDescription).toContain('Select the actions to generate for this user')
    expect(wrapper.vm.dialogDescription).toContain("the user's risk signals, behavior, and weaknesses")
  })

  it('computes quishing-capable simulation option description', () => {
    const wrapper = mountComponent()

    expect(wrapper.vm.simulationOptionDescription).toContain('phishing or quishing')
    expect(wrapper.vm.simulationOptionDescription).toContain('personalized')
  })

  describe('submitLoading', () => {
    it('forwards submitLoading to AppDialogFooter as disabled without spinner', async () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: true },
        submitLoading: true
      })
      await wrapper.vm.$nextTick()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(true)
      expect(footer.props('confirmButtonLoading')).toBe(false)
    })

    it('footer disables confirm while submitting when options valid', async () => {
      const wrapper = mountComponent({
        options: { training: true, phishing: false },
        submitLoading: true
      })
      wrapper.vm.localOptions = { training: true, phishing: false }
      await wrapper.vm.$nextTick()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(true)
      expect(footer.props('confirmButtonLoading')).toBe(false)
    })

    it('footer stays disabled when no action selected and submitting', async () => {
      const wrapper = mountComponent({
        options: { training: false, phishing: false },
        submitLoading: true
      })
      wrapper.vm.localOptions = { training: false, phishing: false }
      await wrapper.vm.$nextTick()
      const footer = wrapper.findComponent({ name: 'AppDialogFooter' })
      expect(footer.props('confirmButtonDisabled')).toBe(true)
      expect(footer.props('confirmButtonLoading')).toBe(false)
    })
  })
})

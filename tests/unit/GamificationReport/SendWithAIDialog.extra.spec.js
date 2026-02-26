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

  it('handleConfirm triggers closeOverlay and snackbar dispatch even when both options are false', async () => {
    const wrapper = mountComponent({ options: { training: false, phishing: false } })
    wrapper.vm.localOptions = { training: false, phishing: false }

    wrapper.vm.handleConfirm()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
    expect(wrapper.emitted('closeOverlay').pop()).toEqual([false])
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        icon: 'mdi-check-circle',
        color: '#4caf50'
      })
    )
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
    expect(wrapper.emitted('closeOverlay').pop()).toEqual([false])
  })

  it('options watcher handles null payload by resetting to empty object', () => {
    const wrapper = mountComponent({ options: { training: true, phishing: true } })

    wrapper.vm.$options.watch.options.handler.call(wrapper.vm, null)
    expect(wrapper.vm.localOptions).toEqual({})
  })

  it('handleConfirm emits confirm and close first, then dispatches snackbar on nextTick', async () => {
    const wrapper = mountComponent({ options: { training: true, phishing: false } })
    wrapper.vm.localOptions = { training: true, phishing: false }

    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
    expect(wrapper.vm.$store.dispatch).not.toHaveBeenCalled()

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(1)
  })

  it('handleConfirm emits sendAfterPhishingSimulation=true when switch is enabled', async () => {
    const wrapper = mountComponent({ options: { training: true, phishing: true } })
    wrapper.vm.localOptions = { training: true, phishing: true }
    wrapper.vm.sendAfterPhishingSimulation = true

    wrapper.vm.handleConfirm()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('confirm')[0][0]).toEqual({
      training: true,
      phishing: true,
      sendAfterPhishingSimulation: true
    })
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: expect.stringContaining('Autonomous AI process started')
      })
    )
  })
})

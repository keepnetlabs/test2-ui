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
})

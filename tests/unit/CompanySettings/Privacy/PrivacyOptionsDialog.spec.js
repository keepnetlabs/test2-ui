import { shallowMount } from '@vue/test-utils'
import PrivacyOptionsDialog from '@/components/Company Settings/Privacy/PrivacyOptionsDialog.vue'

describe('PrivacyOptionsDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(PrivacyOptionsDialog, {
      propsData: {
        status: true,
        ...propsData
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          props: ['icon', 'title', 'subtitle', 'status'],
          template: '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: {
          name: 'AppDialogFooter',
          props: ['confirmButtonDisabled'],
          template: '<div class="app-dialog-footer-stub" />'
        },
        VCheckbox: {
          name: 'VCheckbox',
          props: ['value', 'label'],
          template: '<input class="checkbox-stub" />'
        }
      }
    })

  it('starts with unconfirmed state and static constants', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isConfirm).toBe(false)
    expect(wrapper.vm.CONSTANTS.title).toBe('Privacy Options')
    expect(wrapper.vm.CONSTANTS.icon).toBe('mdi-shield-alert')
  })

  it('emits close and success actions', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    wrapper.vm.handleSuccess()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-success')).toBeTruthy()
  })

  it('passes static constants and status into AppDialog', () => {
    const wrapper = createWrapper({ status: false })
    const dialog = wrapper.findComponent({ name: 'AppDialog' })

    expect(dialog.props('icon')).toBe('mdi-shield-alert')
    expect(dialog.props('title')).toBe('Privacy Options')
    expect(dialog.props('subtitle')).toContain('Display user entered data')
    expect(dialog.props('status')).toBe(false)
  })

  it('disables confirm button until user confirms', async () => {
    const wrapper = createWrapper()
    const footer = () => wrapper.findComponent({ name: 'AppDialogFooter' })

    expect(footer().props('confirmButtonDisabled')).toBe(true)
    await wrapper.setData({ isConfirm: true })
    expect(footer().props('confirmButtonDisabled')).toBe(false)
  })

  it('wires footer events to close/success emits', () => {
    const wrapper = createWrapper()
    const footer = wrapper.findComponent({ name: 'AppDialogFooter' })

    footer.vm.$emit('handleClose')
    footer.vm.$emit('handleConfirm')

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-success')).toBeTruthy()
  })
})

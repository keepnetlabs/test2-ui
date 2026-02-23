import { shallowMount } from '@vue/test-utils'
import AccountPrivacyDialog from '@/components/Company Settings/AccountPrivacy/AccountPrivacyDialog.vue'
import { updateCompanyPrivacy } from '@/api/company'

jest.mock('@/api/company', () => ({
  updateCompanyPrivacy: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('AccountPrivacyDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(AccountPrivacyDialog, {
      propsData: {
        status: true,
        timeAllowed: '2 hours',
        privacyDurationId: 2,
        ...propsData
      },
      stubs: {
        AppDialog: {
          name: 'AppDialog',
          props: ['icon', 'title', 'status'],
          template:
            '<div class="app-dialog-stub"><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: {
          name: 'AppDialogFooter',
          props: ['confirmButtonDisabled'],
          template: '<div class="app-dialog-footer-stub" />'
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('emits on-close with given forceUpdate value', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose(true)
    wrapper.vm.handleClose(false)

    expect(wrapper.emitted('on-close')).toEqual([[true], [false]])
  })

  it('updates privacy and closes dialog on confirm', async () => {
    const wrapper = createWrapper({ privacyDurationId: 5 })

    wrapper.vm.handleConfirm()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    await flushPromises()

    expect(updateCompanyPrivacy).toHaveBeenCalledWith({ privacyDurationId: 5 })
    expect(wrapper.emitted('on-close')[0]).toEqual([true])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('passes title/icon/status and time text into dialog', () => {
    const wrapper = createWrapper({ status: false, timeAllowed: '7 days' })
    const dialog = wrapper.findComponent({ name: 'AppDialog' })

    expect(dialog.props('icon')).toBe('mdi-lock')
    expect(dialog.props('title')).toBe('Account Privacy')
    expect(dialog.props('status')).toBe(false)
    expect(wrapper.text()).toContain('Time allowed for the access: 7 days')
  })

  it('wires footer events and disabled state to component methods/state', async () => {
    const wrapper = createWrapper()
    const footer = () => wrapper.findComponent({ name: 'AppDialogFooter' })

    expect(footer().props('confirmButtonDisabled')).toBe(false)

    footer().vm.$emit('handleClose')
    expect(wrapper.emitted('on-close')).toBeTruthy()

    await wrapper.setData({ isActionButtonDisabled: true })
    expect(footer().props('confirmButtonDisabled')).toBe(true)
  })

  it('handleClose emits false by default when forceUpdate is omitted', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toEqual([[false]])
  })
})

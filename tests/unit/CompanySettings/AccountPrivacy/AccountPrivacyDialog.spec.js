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
        AppDialog: true,
        AppDialogFooter: true
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
})

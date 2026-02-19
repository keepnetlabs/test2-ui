import { shallowMount } from '@vue/test-utils'
import SecurityModal from '@/components/Security/SecurityModal.vue'
import {
  disableMfaStatus,
  getMfaStatus,
  updatePassword,
  getMfaSetup,
  setMfaResync
} from '@/api/auth'

jest.mock('@/api/auth', () => ({
  disableMfaStatus: jest.fn(() => Promise.resolve()),
  getMfaStatus: jest.fn(() => Promise.resolve({ data: { data: { statusId: 1 } } })),
  updatePassword: jest.fn(() => Promise.resolve()),
  getMfaSetup: jest.fn(() => Promise.resolve({ data: { data: { qrCode: 'qr' } } })),
  setMfaResync: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SecurityModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SecurityModal, {
      propsData: {
        openPasswordChange: true,
        ...propsData
      },
      stubs: {
        AppDialog: true,
        PasswordChecker: true,
        MFASetup: true,
        PostCardLoading: true,
        VCardText: true,
        VBtn: true,
        VForm: true,
        VTextField: true,
        VRow: true,
        VCol: true
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getMfaStatus.mockResolvedValue({ data: { data: { statusId: 1 } } })
  })

  it('renders component and computes title by step', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.$options.name).toBe('SecurityModal')
    expect(wrapper.vm.getTitle).toBe(wrapper.vm.labels.Security)

    await wrapper.setData({ step: 2 })
    expect(wrapper.vm.getTitle).toBe(wrapper.vm.labels.LoginPassword)
    await wrapper.setData({ step: 3 })
    expect(wrapper.vm.getTitle).toBe(wrapper.vm.labels.DisableMfa)
    await wrapper.setData({ step: 4 })
    expect(wrapper.vm.getTitle).toBe(wrapper.vm.labels.EnableMfa)
  })

  it('getMfaStatus sets status on success and clears loading', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getMfaStatus).toHaveBeenCalled()
    expect(wrapper.vm.mfaStatus).toBe(1)
    expect(wrapper.vm.loadingSecurityModal).toBe(false)
  })

  it('getMfaStatus emits close event on failure', async () => {
    getMfaStatus.mockRejectedValueOnce(new Error('failed'))
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.emitted('changePasswordChange')).toBeTruthy()
    expect(wrapper.vm.loadingSecurityModal).toBe(false)
  })

  it('onMfaStatusChangeButton calls setupMFA', () => {
    const wrapper = createWrapper()
    const setupSpy = jest.spyOn(wrapper.vm, 'setupMFA').mockImplementation(() => {})

    wrapper.vm.onMfaStatusChangeButton()

    expect(setupSpy).toHaveBeenCalled()
  })

  it('setupMFA sets setup details and moves to step 4', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.setupMFA()
    await flushPromises()

    expect(getMfaSetup).toHaveBeenCalled()
    expect(wrapper.vm.mfaSetupDetails).toEqual({ qrCode: 'qr' })
    expect(wrapper.vm.step).toBe(4)
  })

  it('disableMFA validates form before api call', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.refDisableMfa = { validate: jest.fn(() => false) }
    wrapper.vm.mfaCode = '123456'

    wrapper.vm.disableMFA()
    await flushPromises()
    expect(disableMfaStatus).not.toHaveBeenCalled()

    wrapper.vm.$refs.refDisableMfa.validate.mockReturnValue(true)
    wrapper.vm.disableMFA()
    await flushPromises()

    expect(disableMfaStatus).toHaveBeenCalledWith({ code: '123456' })
    expect(wrapper.emitted('changePasswordChange')).toBeTruthy()
  })

  it('changePassword validates form and emits close on success', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.newPasswordByMain = { validate: jest.fn(() => false) }
    wrapper.vm.currentPassword = 'Current#123'
    wrapper.vm.newPassword = 'New#12345'
    wrapper.vm.reNewPassword = 'New#12345'

    wrapper.vm.changePassword()
    await flushPromises()
    expect(updatePassword).not.toHaveBeenCalled()

    wrapper.vm.$refs.newPasswordByMain.validate.mockReturnValue(true)
    wrapper.vm.changePassword()
    await flushPromises()

    expect(updatePassword).toHaveBeenCalledWith({
      CurrentPassword: 'Current#123',
      NewPassword: 'New#12345',
      ConfirmNewPassword: 'New#12345'
    })
    expect(wrapper.emitted('changePasswordChange')).toBeTruthy()
  })

  it('confirmSetupMFA dispatches snackbar and emits close on success', async () => {
    const wrapper = createWrapper()
    wrapper.vm.$refs.mfaSetup = { mfaCode: '654321' }

    wrapper.vm.confirmSetupMFA()
    await flushPromises()

    expect(setMfaResync).toHaveBeenCalledWith({ code: '654321' })
    expect(wrapper.emitted('changePasswordChange')).toBeTruthy()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Multi-factor authentication enabled' })
    )
  })

  it('confirmSetupMFA handles api failure without throwing', async () => {
    setMfaResync.mockRejectedValueOnce(new Error('resync failed'))
    const wrapper = createWrapper()
    wrapper.vm.$refs.mfaSetup = { mfaCode: '111111' }

    expect(() => wrapper.vm.confirmSetupMFA()).not.toThrow()
    await flushPromises()
  })
})


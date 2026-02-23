import { shallowMount } from '@vue/test-utils'
import DataPrivacy from '@/components/Company Settings/Privacy/DataPrivacy.vue'
import { getCompanyDataPrivacy, saveCompanyDataPrivacy } from '@/api/company'

jest.mock('@/api/company', () => ({
  getCompanyDataPrivacy: jest.fn(),
  saveCompanyDataPrivacy: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('DataPrivacy.vue', () => {
  const createWrapper = (userRole = 'Root') =>
    shallowMount(DataPrivacy, {
      stubs: {
        PrivacyOptionsDialog: true,
        CompanySettingsHeader: true,
        FormGroup: true,
        SaveButton: true,
        VIcon: true,
        VRadioGroup: true,
        VRadio: true
      },
      mocks: {
        $store: {
          getters: {
            'auth/getUserRole': userRole
          }
        }
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.setItem('companyResourceId', '1')
    localStorage.setItem('selectedCompanyRequestId', '1')
    getCompanyDataPrivacy.mockResolvedValue({
      data: { data: { pentesterMasked: false } }
    })
    saveCompanyDataPrivacy.mockResolvedValue({})
  })

  it('loads privacy settings on created and sets defaults', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getCompanyDataPrivacy).toHaveBeenCalled()
    expect(wrapper.vm.pentesterMasked).toBe(false)
    expect(wrapper.vm.defaultPentesterValue).toBe(false)
  })

  it('callForData falls back to true when api value is missing', async () => {
    getCompanyDataPrivacy.mockResolvedValueOnce({ data: { data: {} } })
    const ctx = { pentesterMasked: false, defaultPentesterValue: false }

    DataPrivacy.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.pentesterMasked).toBe(true)
    expect(ctx.defaultPentesterValue).toBe(true)
  })

  it('computes return-main-account warning visibility by role and localStorage', () => {
    let wrapper = createWrapper('Root')
    expect(wrapper.vm.isReturnMainAccountVisible).toBe(false)
    wrapper.destroy()

    localStorage.setItem('selectedCompanyRequestId', '2')
    wrapper = createWrapper('Root')
    expect(wrapper.vm.isReturnMainAccountVisible).toBe(true)
    wrapper.destroy()

    wrapper = createWrapper('Standard User')
    expect(wrapper.vm.isReturnMainAccountVisible).toBe(false)
  })

  it('computes action button disabled status branches', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({
      defaultPentesterValue: true,
      pentesterMasked: true,
      isApiCalling: false
    })
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    await wrapper.setData({
      defaultPentesterValue: false,
      pentesterMasked: true,
      isApiCalling: true
    })
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    await wrapper.setData({
      defaultPentesterValue: false,
      pentesterMasked: true,
      isApiCalling: false
    })
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('handleSave calls submit api when masked is true', () => {
    const callForSubmitApi = jest.fn()
    const ctx = {
      pentesterMasked: true,
      isShowPrivacyOptionsDialog: false,
      callForSubmitApi
    }

    DataPrivacy.methods.handleSave.call(ctx)
    expect(callForSubmitApi).toHaveBeenCalled()
    expect(ctx.isShowPrivacyOptionsDialog).toBe(false)
  })

  it('handleSave opens privacy options dialog when masked is false', () => {
    const callForSubmitApi = jest.fn()
    const ctx = {
      pentesterMasked: false,
      isShowPrivacyOptionsDialog: false,
      callForSubmitApi
    }

    DataPrivacy.methods.handleSave.call(ctx)
    expect(callForSubmitApi).not.toHaveBeenCalled()
    expect(ctx.isShowPrivacyOptionsDialog).toBe(true)
  })

  it('callForSubmitApi updates api state and default value', async () => {
    const ctx = {
      pentesterMasked: false,
      defaultPentesterValue: true,
      isApiCalling: false
    }

    DataPrivacy.methods.callForSubmitApi.call(ctx)
    expect(ctx.isApiCalling).toBe(true)
    await flushPromises()

    expect(saveCompanyDataPrivacy).toHaveBeenCalledWith({ pentesterMasked: false })
    expect(ctx.isApiCalling).toBe(false)
    expect(ctx.defaultPentesterValue).toBe(false)
  })

  it('handleSuccess submits and closes dialog with no toggle value flip', () => {
    const callForSubmitApi = jest.fn()
    const toggleShowPrivacyOptionsDialog = jest.fn()
    const ctx = { callForSubmitApi, toggleShowPrivacyOptionsDialog }

    DataPrivacy.methods.handleSuccess.call(ctx)
    expect(callForSubmitApi).toHaveBeenCalled()
    expect(toggleShowPrivacyOptionsDialog).toHaveBeenCalledWith(false)
  })

  it('toggleShowPrivacyOptionsDialog toggles visibility and optionally pentester value', () => {
    const ctx = {
      pentesterMasked: true,
      isShowPrivacyOptionsDialog: false
    }

    DataPrivacy.methods.toggleShowPrivacyOptionsDialog.call(ctx)
    expect(ctx.pentesterMasked).toBe(false)
    expect(ctx.isShowPrivacyOptionsDialog).toBe(true)

    DataPrivacy.methods.toggleShowPrivacyOptionsDialog.call(ctx, false)
    expect(ctx.pentesterMasked).toBe(false)
    expect(ctx.isShowPrivacyOptionsDialog).toBe(false)
  })
})

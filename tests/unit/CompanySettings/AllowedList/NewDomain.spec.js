import { shallowMount } from '@vue/test-utils'
import NewDomain from '@/components/Company Settings/AllowedList/NewDomain.vue'
import { createTxtRecord, createAllowListList } from '@/api/allowList'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

jest.mock('@/api/allowList', () => ({
  createTxtRecord: jest.fn(),
  createAllowListList: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('NewDomain.vue', () => {
  const createWrapper = (propsData = {}) => {
    const changeNewDomainPopupStatus = jest.fn()
    const dispatch = jest.fn()
    const wrapper = shallowMount(NewDomain, {
      propsData: {
        status: true,
        changeNewDomainPopupStatus,
        ...propsData
      },
      stubs: {
        AppModal: true,
        FormGroup: true,
        VForm: true,
        VTextField: true,
        VContainer: true,
        VRow: true,
        VCol: true,
        VBtn: true
      },
      mocks: {
        $store: {
          dispatch
        }
      }
    })

    return { wrapper, changeNewDomainPopupStatus, dispatch }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    createTxtRecord.mockResolvedValue({ data: { data: 'TXT-RECORD' } })
  })

  it('loads TXT record on created', async () => {
    const { wrapper } = createWrapper()
    await flushPromises()

    expect(createTxtRecord).toHaveBeenCalled()
    expect(wrapper.vm.formValues.txtRecord).toBe('TXT-RECORD')
  })

  it('computes save button status from form and submitting state', async () => {
    const { wrapper } = createWrapper()
    await wrapper.setData({ formValues: { domain: '', txtRecord: 'TXT' }, isSubmitting: false })
    expect(wrapper.vm.saveButtonStatus).toBe(true)

    await wrapper.setData({
      formValues: { domain: 'example.com', txtRecord: 'TXT' },
      isSubmitting: false
    })
    expect(wrapper.vm.saveButtonStatus).toBe(false)

    await wrapper.setData({
      formValues: { domain: 'a'.repeat(161), txtRecord: 'TXT' },
      isSubmitting: false
    })
    expect(wrapper.vm.saveButtonStatus).toBe(true)
  })

  it('dispatches leaving dialog and closes popup via callback', () => {
    const { wrapper, changeNewDomainPopupStatus, dispatch } = createWrapper()
    wrapper.vm.closeDomainPopup()

    expect(dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )

    const payload = dispatch.mock.calls[0][1]
    payload.callback()
    expect(changeNewDomainPopupStatus).toHaveBeenCalledWith(false)
  })

  it('submits successfully when form is valid', async () => {
    createAllowListList.mockResolvedValue({ data: { data: { resourceId: 321 } } })
    const { wrapper, changeNewDomainPopupStatus } = createWrapper()
    wrapper.vm.$refs.refdomainForm = { validate: jest.fn(() => true) }
    await wrapper.setData({
      formValues: { domain: 'example.com', txtRecord: 'TXT-RECORD' }
    })

    wrapper.vm.submit()
    expect(wrapper.vm.isSubmitting).toBe(true)
    await flushPromises()

    expect(createAllowListList).toHaveBeenCalled()
    expect(changeNewDomainPopupStatus).toHaveBeenCalledWith(false, true, 321)
    expect(wrapper.vm.isSubmitting).toBe(false)
  })

  it('creates snackbar on submit error', async () => {
    createAllowListList.mockRejectedValue({
      response: { data: { message: 'Domain exists' } }
    })
    const { wrapper, dispatch } = createWrapper()
    wrapper.vm.$refs.refdomainForm = { validate: jest.fn(() => true) }
    await wrapper.setData({
      formValues: { domain: 'example.com', txtRecord: 'TXT-RECORD' }
    })

    wrapper.vm.submit()
    await flushPromises()

    expect(dispatch).toHaveBeenCalledWith('common/createSnackBar', {
      message: 'Domain exists',
      color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
      icon: 'mdi-alert-circle'
    })
    expect(wrapper.vm.isSubmitting).toBe(false)
  })

  it('does not submit when form is invalid', () => {
    const { wrapper } = createWrapper()
    wrapper.vm.$refs.refdomainForm = { validate: jest.fn(() => false) }
    wrapper.vm.submit()
    expect(createAllowListList).not.toHaveBeenCalled()
  })
})

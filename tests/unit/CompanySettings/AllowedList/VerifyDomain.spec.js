import { shallowMount } from '@vue/test-utils'
import VerifyDomain from '@/components/Company Settings/AllowedList/VerifyDomain.vue'
import { getAllowListListVerify } from '@/api/allowList'

jest.mock('@/api/allowList', () => ({
  getAllowListListVerify: jest.fn()
}))

describe('VerifyDomain.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(VerifyDomain, {
      propsData: {
        status: true,
        selectedDomain: {
          allowListResourceId: 15,
          domain: 'example.com',
          txtRecord: 'TXT123',
          status: 'Unverified'
        },
        ...propsData
      },
      stubs: {
        AppDialog: true,
        FormGroup: true,
        VContainer: true,
        VRow: true,
        VCol: true,
        VTextField: true,
        VCard: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('computes title and icon for different verification states', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.title).toBe('Verify domain')
    expect(wrapper.vm.titleIcon).toBe('')

    await wrapper.setData({ isVerified: false })
    expect(wrapper.vm.title).toBe('Cannot verify domain')
    expect(wrapper.vm.titleIcon).toBe('mdi-alert-circle')

    await wrapper.setProps({
      selectedDomain: { allowListResourceId: 1, domain: 'x.com', txtRecord: 'x', status: 'Verified' }
    })
    expect(wrapper.vm.title).toBe('Verified domain')
    expect(wrapper.vm.titleIcon).toBe('mdi-check-circle ')
  })

  it('verifyDomain marks as not verified when api returns status 1', async () => {
    getAllowListListVerify.mockResolvedValue({ data: { data: { status: 1 } } })
    const wrapper = createWrapper()

    wrapper.vm.verifyDomain()
    await Promise.resolve()
    jest.advanceTimersByTime(100)

    expect(getAllowListListVerify).toHaveBeenCalledWith(15)
    expect(wrapper.vm.verifyStartStatus).toBe(false)
    expect(wrapper.vm.isVerified).toBe(false)
    expect(wrapper.emitted('getDatatableList')).toBeTruthy()
    expect(wrapper.emitted('handleVerifyDomainPopup')).toBeFalsy()
  })

  it('verifyDomain emits verify popup when api returns successful verification', async () => {
    getAllowListListVerify.mockResolvedValue({ data: { data: { status: 0 } } })
    const wrapper = createWrapper()

    wrapper.vm.verifyDomain()
    await Promise.resolve()
    jest.advanceTimersByTime(100)

    expect(wrapper.emitted('handleVerifyDomainPopup')).toBeTruthy()
    expect(wrapper.emitted('getDatatableList')).toBeTruthy()
  })

  it('closes modal and emits handleCloseModal', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })
})

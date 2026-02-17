import { shallowMount } from '@vue/test-utils'
import MarkAsVerifiedModal from '@/components/Company Settings/AllowedList/MarkAsVerifiedModal.vue'
import { markAsVerified } from '@/api/allowList'

jest.mock('@/api/allowList', () => ({
  markAsVerified: jest.fn()
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('MarkAsVerifiedModal.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(MarkAsVerifiedModal, {
      propsData: {
        status: true,
        selectedDomain: {
          allowListResourceId: 77,
          domain: 'example.com'
        },
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

  it('emits close event', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })

  it('emits success when markAsVerified returns SUCCESS', async () => {
    markAsVerified.mockResolvedValue({ data: { status: 'SUCCESS' } })
    const wrapper = createWrapper()

    wrapper.vm.handleConfirm()
    expect(wrapper.vm.buttonDisableStatus).toBe(true)
    await flushPromises()

    expect(markAsVerified).toHaveBeenCalledWith(77)
    expect(wrapper.emitted('handleMarkAsVerifiedSuccess')).toBeTruthy()
    expect(wrapper.vm.buttonDisableStatus).toBe(false)
  })

  it('does not emit success when response status is not SUCCESS', async () => {
    markAsVerified.mockResolvedValue({ data: { status: 'FAILED' } })
    const wrapper = createWrapper()

    wrapper.vm.handleConfirm()
    await flushPromises()

    expect(wrapper.emitted('handleMarkAsVerifiedSuccess')).toBeFalsy()
    expect(wrapper.vm.buttonDisableStatus).toBe(false)
  })
})

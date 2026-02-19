jest.mock('@/api/landingPage', () => ({
  deleteLandingPage: jest.fn()
}))

import { shallowMount } from '@vue/test-utils'
import DeleteLandingPage from '@/components/LandingPage/DeleteLandingPage.vue'
import { deleteLandingPage } from '@/api/landingPage'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('DeleteLandingPage.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteLandingPage, {
      propsData: {
        status: true,
        selectedEmailTemplate: {
          resourceId: 'landing-1',
          name: 'Landing A'
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

  it('emits close event from closeModal', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()

    expect(wrapper.emitted('handleCloseModal')).toEqual([[]])
  })

  it('calls delete api and emits success on handleDelete', async () => {
    deleteLandingPage.mockResolvedValueOnce({})
    const wrapper = createWrapper()

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    await flushPromises()

    expect(deleteLandingPage).toHaveBeenCalledWith('landing-1')
    expect(wrapper.emitted('handleSuccessDeleteAction')).toEqual([
      [{ resourceId: 'landing-1', name: 'Landing A' }]
    ])
    expect(wrapper.emitted('handleCloseModal')).toEqual([[]])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('resets button state when delete api fails', async () => {
    deleteLandingPage.mockRejectedValueOnce(new Error('delete failed'))
    const wrapper = createWrapper()

    wrapper.vm.handleDelete()
    await flushPromises()

    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    expect(wrapper.emitted('handleSuccessDeleteAction')).toBeUndefined()
  })
})

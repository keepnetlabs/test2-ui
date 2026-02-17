import { shallowMount } from '@vue/test-utils'
import DeleteEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/DeleteEnrollmentDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { EMITS } from '@/components/AwarenessEducator/utils'

jest.mock('@/api/awarenessEducator', () => ({
  deleteEnrollment: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('DeleteEnrollmentDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteEnrollmentDialog, {
      propsData: {
        status: true,
        selectedRow: { enrollmentId: 'enr-1' },
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

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('DeleteEnrollmentDialog')
  })

  it('emits on-close in handleClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[false]])
  })

  it('handleDelete calls api and closes dialog with force update', async () => {
    const wrapper = createWrapper({ selectedRow: { enrollmentId: 'enr-25' } })
    const closeSpy = jest.spyOn(wrapper.vm, 'handleClose')

    wrapper.vm.handleDelete()
    await flushPromises()

    expect(AwarenessEducatorService.deleteEnrollment).toHaveBeenCalledWith('enr-25')
    expect(closeSpy).toHaveBeenCalledWith(true)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('keeps action button disabled while pending and resets after resolve', async () => {
    let resolveRequest
    const pendingRequest = new Promise((resolve) => {
      resolveRequest = resolve
    })
    AwarenessEducatorService.deleteEnrollment.mockReturnValueOnce(pendingRequest)
    const wrapper = createWrapper()

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    resolveRequest()
    await flushPromises()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})

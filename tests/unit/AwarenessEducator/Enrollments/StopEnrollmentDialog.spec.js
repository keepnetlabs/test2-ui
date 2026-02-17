import { shallowMount } from '@vue/test-utils'
import StopEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/StopEnrollmentDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { EMITS } from '@/components/AwarenessEducator/utils'

jest.mock('@/api/awarenessEducator', () => ({
  stopEnrollment: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('StopEnrollmentDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(StopEnrollmentDialog, {
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
    expect(wrapper.vm.$options.name).toBe('StopEnrollmentDialog')
  })

  it('emits on-close in handleClose with default false', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[false]])
  })

  it('emits on-close in handleClose with true when forceUpdate is true', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[true]])
  })

  it('handleDelete calls api and closes dialog with force update', async () => {
    const wrapper = createWrapper({ selectedRow: { enrollmentId: 'enr-99' } })
    const closeSpy = jest.spyOn(wrapper.vm, 'handleClose')

    wrapper.vm.handleDelete()
    await flushPromises()

    expect(AwarenessEducatorService.stopEnrollment).toHaveBeenCalledWith('enr-99')
    expect(closeSpy).toHaveBeenCalledWith(true)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('handleDelete keeps disabled true while request is pending and resets after resolve', async () => {
    let resolveRequest
    const pendingRequest = new Promise((resolve) => {
      resolveRequest = resolve
    })
    AwarenessEducatorService.stopEnrollment.mockReturnValueOnce(pendingRequest)
    const wrapper = createWrapper()

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    resolveRequest()
    await flushPromises()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})

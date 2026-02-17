import { shallowMount } from '@vue/test-utils'
import SendEnrollmentDialog from '@/components/AwarenessEducator/Enrollments/SendEnrollmentDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'

jest.mock('@/api/awarenessEducator', () => ({
  sendEnrollment: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('SendEnrollmentDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(SendEnrollmentDialog, {
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
    expect(wrapper.vm.$options.name).toBe('SendEnrollmentDialog')
  })

  it('contains expected constants', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.CONSTANTS).toEqual({
      icon: 'mdi-send',
      title: 'Send Now?',
      content: 'Do you want to enroll users now?'
    })
  })

  it('emits on-close in handleClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toEqual([[false]])
  })

  it('handleConfirm calls sendEnrollment and emits on-close with true', async () => {
    const wrapper = createWrapper({ selectedRow: { enrollmentId: 'enr-55' } })
    const closeSpy = jest.spyOn(wrapper.vm, 'handleClose')

    wrapper.vm.handleConfirm()
    await flushPromises()

    expect(AwarenessEducatorService.sendEnrollment).toHaveBeenCalledWith('enr-55')
    expect(closeSpy).toHaveBeenCalledWith(true)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('keeps action button disabled while request is pending and resets after resolve', async () => {
    let resolveRequest
    const pendingRequest = new Promise((resolve) => {
      resolveRequest = resolve
    })
    AwarenessEducatorService.sendEnrollment.mockReturnValueOnce(pendingRequest)
    const wrapper = createWrapper()

    wrapper.vm.handleConfirm()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    resolveRequest()
    await flushPromises()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})

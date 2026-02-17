import { shallowMount } from '@vue/test-utils'
import TrashDeletePermanentlyDialog from '@/components/AwarenessEducator/Enrollments/TrashDeletePermanentlyDialog.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { EMITS } from '@/components/AwarenessEducator/utils'

jest.mock('@/api/awarenessEducator', () => ({
  deletePermanentlyEnrollment: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TrashDeletePermanentlyDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TrashDeletePermanentlyDialog, {
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
    expect(wrapper.vm.$options.name).toBe('TrashDeletePermanentlyDialog')
  })

  it('emits on-close with default false in handleClose', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[false]])
  })

  it('emits on-close with true when force update requested', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose(true)
    expect(wrapper.emitted(EMITS.ON_CLOSE)).toEqual([[true]])
  })

  it('handleDelete calls delete api and closes with force update', async () => {
    const wrapper = createWrapper({ selectedRow: { enrollmentId: 'enr-10' } })
    const closeSpy = jest.spyOn(wrapper.vm, 'handleClose')

    wrapper.vm.handleDelete()
    await flushPromises()

    expect(AwarenessEducatorService.deletePermanentlyEnrollment).toHaveBeenCalledWith('enr-10')
    expect(closeSpy).toHaveBeenCalledWith(true)
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('keeps button disabled while request is pending and resets after resolve', async () => {
    let resolveRequest
    const pendingRequest = new Promise((resolve) => {
      resolveRequest = resolve
    })
    AwarenessEducatorService.deletePermanentlyEnrollment.mockReturnValueOnce(pendingRequest)
    const wrapper = createWrapper()

    wrapper.vm.handleDelete()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    resolveRequest()
    await flushPromises()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})

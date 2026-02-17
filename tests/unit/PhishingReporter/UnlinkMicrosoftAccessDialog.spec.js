import { shallowMount } from '@vue/test-utils'
import UnlinkMicrosoftAccessDialog from '@/components/PhishingReporter/UnlinkMicrosoftAccessDialog.vue'
import { deleteGraphAccount } from '@/api/phishingReporter'

jest.mock('@/api/phishingReporter', () => ({
  deleteGraphAccount: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('UnlinkMicrosoftAccessDialog.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(UnlinkMicrosoftAccessDialog, {
      propsData: {
        status: true,
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

  it('emits close event with forceUpdate value', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleClose()
    wrapper.vm.handleClose(true)

    expect(wrapper.emitted('close')).toEqual([[false], [true]])
  })

  it('deletes graph account and closes with update on confirm', async () => {
    const wrapper = createWrapper()

    wrapper.vm.handleConfirm()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)

    await flushPromises()

    expect(deleteGraphAccount).toHaveBeenCalled()
    expect(wrapper.emitted('close')).toContainEqual([true])
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})

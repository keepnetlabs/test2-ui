import { shallowMount } from '@vue/test-utils'
import UnlinkMicrosoftAccessDialog from '@/components/PhishingReporter/UnlinkMicrosoftAccessDialog.vue'
import { deleteGraphAccount } from '@/api/phishingReporter'

jest.mock('@/api/phishingReporter', () => ({
  deleteGraphAccount: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('UnlinkMicrosoftAccessDialog.vue (extra coverage)', () => {
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

  it('calls handleClose when AppDialog changeStatus fires', async () => {
    const wrapper = createWrapper()
    wrapper.findComponent({ name: 'AppDialog' }).vm.$emit('changeStatus')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('invokes handleConfirm when AppDialogFooter emits handleConfirm', async () => {
    const wrapper = createWrapper()
    wrapper.findComponent({ name: 'AppDialogFooter' }).vm.$emit('handleConfirm')
    await flushPromises()
    expect(deleteGraphAccount).toHaveBeenCalled()
    expect(wrapper.emitted('close')).toContainEqual([true])
  })

  it('sets isActionButtonDisabled true during confirm and false after', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    wrapper.vm.handleConfirm()
    expect(wrapper.vm.isActionButtonDisabled).toBe(true)
    await flushPromises()
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })
})

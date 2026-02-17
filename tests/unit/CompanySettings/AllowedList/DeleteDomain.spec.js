import { shallowMount } from '@vue/test-utils'
import DeleteDomain from '@/components/Company Settings/AllowedList/DeleteDomain.vue'
import { deleteAllowListItems } from '@/api/allowList'

jest.mock('@/api/allowList', () => ({
  deleteAllowListItems: jest.fn(() => Promise.resolve({}))
}))

describe('DeleteDomain.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteDomain, {
      propsData: {
        status: true,
        selectedItems: [{ allowListResourceId: 11 }, { allowListResourceId: 22 }],
        ...propsData
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true,
        VCard: true,
        VTextField: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('uppercases confirm text and controls delete button state via watcher', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ confirmText: 'delete' })
    wrapper.vm.uppercase()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.confirmText).toBe('DELETE')
    expect(wrapper.vm.buttonDisableStatus).toBe(false)

    await wrapper.setData({ confirmText: 'nope' })
    expect(wrapper.vm.buttonDisableStatus).toBe(true)
  })

  it('closes modal and clears confirm text', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ confirmText: 'DELETE' })
    wrapper.vm.closeModal()

    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
    expect(wrapper.vm.confirmText).toBe('')
  })

  it('deletes selected ids and emits success action', async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleDelete()

    await Promise.resolve()
    expect(deleteAllowListItems).toHaveBeenCalledWith([11, 22])

    jest.advanceTimersByTime(1000)
    expect(wrapper.emitted('handleSuccessDeleteAction')).toBeTruthy()
  })
})

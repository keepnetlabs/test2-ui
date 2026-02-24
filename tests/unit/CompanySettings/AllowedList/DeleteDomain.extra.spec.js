import { shallowMount } from '@vue/test-utils'
import DeleteDomain from '@/components/Company Settings/AllowedList/DeleteDomain.vue'

jest.mock('@/api/allowList', () => ({
  deleteAllowListItems: jest.fn(() => Promise.resolve({}))
}))

describe('DeleteDomain.vue (extra branch coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteDomain, {
      propsData: {
        status: true,
        selectedItems: [{ allowListResourceId: 1 }],
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true, VCard: true, VTextField: true }
    })

  it('confirmText watcher sets buttonDisableStatus false when val is exactly DELETE', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ confirmText: 'DELETE' })
    expect(wrapper.vm.buttonDisableStatus).toBe(false)
  })

  it('confirmText watcher sets buttonDisableStatus true when val is not DELETE', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ confirmText: 'DELET' })
    expect(wrapper.vm.buttonDisableStatus).toBe(true)
  })

  it('confirmText watcher sets buttonDisableStatus true when val is empty', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ confirmText: '' })
    expect(wrapper.vm.buttonDisableStatus).toBe(true)
  })

  it('handleDelete collects ids from selectedItems', async () => {
    const { deleteAllowListItems } = require('@/api/allowList')
    const wrapper = createWrapper({
      selectedItems: [
        { allowListResourceId: 10 },
        { allowListResourceId: 20 }
      ]
    })
    wrapper.vm.handleDelete()
    await Promise.resolve()
    expect(deleteAllowListItems).toHaveBeenCalledWith([10, 20])
  })

  it('handleDelete handles empty selectedItems', async () => {
    const { deleteAllowListItems } = require('@/api/allowList')
    const wrapper = createWrapper({ selectedItems: [] })
    wrapper.vm.handleDelete()
    await Promise.resolve()
    expect(deleteAllowListItems).toHaveBeenCalledWith([])
  })
})

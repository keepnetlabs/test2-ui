jest.mock('@/api/targetUsers', () => ({
  searchTargetGroups: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    })
  ),
  bulkImportTargetUsersToGroups: jest.fn(() => Promise.resolve())
}))

import { shallowMount } from '@vue/test-utils'
import TargetGroupUsersAddToAnExistingGroupModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddToAnExistingGroupModal.vue'

describe('TargetGroupUsersAddToAnExistingGroupModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(TargetGroupUsersAddToAnExistingGroupModal, {
      propsData: {
        status: true,
        bulkImportPayload: { selectedRowCount: 1 },
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, AppDialogFooter: true }
    })

  it('getTitle returns singular User when selectedRowCount is 1', () => {
    const wrapper = createWrapper({ bulkImportPayload: { selectedRowCount: 1 } })
    expect(wrapper.vm.getTitle).toBe('Add 1 User To User Groups')
  })

  it('getTitle returns plural Users when selectedRowCount > 1', () => {
    const wrapper = createWrapper({ bulkImportPayload: { selectedRowCount: 3 } })
    expect(wrapper.vm.getTitle).toBe('Add 3 Users To User Groups')
  })

  it('getConfirmButtonDisabled is true when no selection', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedTargetGroups: [] })
    expect(wrapper.vm.getConfirmButtonDisabled).toBe(true)
  })

  it('getConfirmButtonDisabled is false when has selection', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedTargetGroups: [{ resourceId: 'g1' }], confirmButtonDisabled: false })
    expect(wrapper.vm.getConfirmButtonDisabled).toBe(false)
  })

  it('closeOverlay emits closeOverlay', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
  })

  it('handleRowIsSelectable returns false for isScimGroup', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.handleRowIsSelectable({ isScimGroup: true })).toBe(false)
  })

  it('handleRowIsSelectable returns true for non-ScimGroup', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.handleRowIsSelectable({ isScimGroup: false })).toBe(true)
  })
})

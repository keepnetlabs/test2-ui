jest.mock('@/api/targetUsers', () => ({
  getTargetUserCustomFieldsByCompanyId: jest.fn(() =>
    Promise.resolve({ data: { data: [] } })
  )
}))

import { shallowMount } from '@vue/test-utils'
import TargetGroupUsers from '@/components/TargetUsers/GroupUsers/TargetGroupUsers.vue'

describe('TargetGroupUsers.vue', () => {
  it('getSelectedRow returns array when selectedRow is array', () => {
    const wrapper = shallowMount(TargetGroupUsers, {
      mocks: {
        $route: { params: { id: 'g1', label: 'Group A' } }
      },
      stubs: {
        KContainer: true,
        DefaultErrorDialog: true,
        TargetGroupsUsersRemoveFromGroups: true,
        TargetGroupUsersAddUsersModal: true,
        TargetGroupUsersAddToAnExistingGroupModal: true,
        TargetGroupUsersTable: true,
        TargetUserEditUserModal: true,
        TargetUserCreateGroupWithUserDialog: true
      }
    })
    wrapper.vm.selectedRow = [{ resourceId: 'u1' }]
    expect(wrapper.vm.getSelectedRow).toEqual([{ resourceId: 'u1' }])
  })

  it('getSelectedRow wraps single object in array', () => {
    const wrapper = shallowMount(TargetGroupUsers, {
      mocks: {
        $route: { params: { id: 'g1', label: 'Group A' } }
      },
      stubs: {
        KContainer: true,
        DefaultErrorDialog: true,
        TargetGroupsUsersRemoveFromGroups: true,
        TargetGroupUsersAddUsersModal: true,
        TargetGroupUsersAddToAnExistingGroupModal: true,
        TargetGroupUsersTable: true,
        TargetUserEditUserModal: true,
        TargetUserCreateGroupWithUserDialog: true
      }
    })
    wrapper.vm.selectedRow = { resourceId: 'u1' }
    expect(wrapper.vm.getSelectedRow).toEqual([{ resourceId: 'u1' }])
  })

  it('getGroupName returns route params label', () => {
    const wrapper = shallowMount(TargetGroupUsers, {
      mocks: {
        $route: { params: { id: 'g1', label: 'Sales Group' } }
      },
      stubs: {
        KContainer: true,
        DefaultErrorDialog: true,
        TargetGroupsUsersRemoveFromGroups: true,
        TargetGroupUsersAddUsersModal: true,
        TargetGroupUsersAddToAnExistingGroupModal: true,
        TargetGroupUsersTable: true,
        TargetUserEditUserModal: true,
        TargetUserCreateGroupWithUserDialog: true
      }
    })
    expect(wrapper.vm.getGroupName).toBe('Sales Group')
  })

})

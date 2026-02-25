import { shallowMount } from '@vue/test-utils'
import TargetUsersViewTargetUserGroups from '@/components/TargetUsers/TargetUsersViewTargetUserGroups.vue'

describe('TargetUsersViewTargetUserGroups.vue', () => {
  it('handleClose emits on-close', () => {
    const wrapper = shallowMount(TargetUsersViewTargetUserGroups, {
      propsData: { item: { firstName: 'John' }, status: true },
      stubs: { AppDialog: true, TargetUsersViewTargetUserGroupsTable: true }
    })
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('data returns CONSTANTS with title and icon', () => {
    const data = TargetUsersViewTargetUserGroups.data()
    expect(data.CONSTANTS.title).toContain('Groups')
    expect(data.CONSTANTS.icon).toBe('mdi-account-supervisor-outline')
  })
})

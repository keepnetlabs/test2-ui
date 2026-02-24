jest.mock('@/api/ldap', () => {
  const getTargetGroupsForLDAP = jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { name: 'Group1', resourceId: 'g1', isSelectable: true, message: '' },
          { name: 'Group2', resourceId: 'g2', isSelectable: false, message: 'used' }
        ]
      }
    })
  )
  return {
    __esModule: true,
    default: { getTargetGroupsForLDAP }
  }
})

jest.mock('@/api/targetUsers', () => ({
  createTargetGroup: jest.fn(() =>
    Promise.resolve({ data: { data: { resourceId: 'new-g1', name: 'NewGroup' } } })
  )
}))

import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportModalStep1 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep1.vue'

describe('TargetUserLDAPImportModalStep1.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}, inject = {}) =>
    shallowMount(TargetUserLDAPImportModalStep1, {
      propsData: {
        selectedLDAPItems: [],
        isLDAPGroupsValid: true,
        step1TargetGroupResourceId: '',
        step1Step: 0,
        ...propsData
      },
      provide: {
        isEdit: inject.isEdit ?? false,
        getServerSideSelectionParams: inject.getServerSideSelectionParams ?? (() => ({})),
        handleServerSideSelectionParams: inject.handleServerSideSelectionParams ?? (() => {})
      },
      stubs: {
        FormGroup: true,
        TargetUserLDAPImportTable: true,
        CustomError: true,
        KSelect: true,
        KButtonRadioGroup: true,
        CreateNewUserGroupModal: true,
        Fragment: { template: '<div><slot /></div>' }
      }
    })

  it('getLDAPGroupsErrorMessage returns empty when selectedLDAPItems has items', () => {
    const wrapper = createWrapper({ selectedLDAPItems: [{ id: 1 }] })
    expect(wrapper.vm.getLDAPGroupsErrorMessage).toBe('')
  })

  it('getLDAPGroupsErrorMessage returns Required when selectedLDAPItems empty', () => {
    const wrapper = createWrapper({ selectedLDAPItems: [] })
    expect(wrapper.vm.getLDAPGroupsErrorMessage).toBe('Required')
  })

  it('getSwitchLabel returns Active when isActive true', () => {
    const wrapper = createWrapper()
    wrapper.setData({ isActive: true })
    expect(wrapper.vm.getSwitchLabel).toBe('Active')
  })

  it('getSwitchLabel returns Passive when isActive false', () => {
    const wrapper = createWrapper()
    wrapper.setData({ isActive: false })
    expect(wrapper.vm.getSwitchLabel).toBe('Passive')
  })

  it('getLDAPTargetUserTableStyle returns border when not valid', () => {
    const wrapper = createWrapper({ isLDAPGroupsValid: false })
    expect(wrapper.vm.getLDAPTargetUserTableStyle).toHaveProperty('border')
  })

  it('getLDAPTargetUserTableStyle returns empty object when valid', () => {
    const wrapper = createWrapper({ isLDAPGroupsValid: true })
    expect(wrapper.vm.getLDAPTargetUserTableStyle).toEqual({})
  })

  it('handleTableSelectionChange emits update:selectedLDAPItems and update:isLDAPGroupsValid', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleTableSelectionChange([{ id: 1 }])
    expect(wrapper.emitted('update:selectedLDAPItems')[0][0]).toEqual([{ id: 1 }])
    expect(wrapper.emitted('update:isLDAPGroupsValid')[0][0]).toBe(true)
  })

  it('handleTableSelectionChange emits isLDAPGroupsValid false when empty', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleTableSelectionChange([])
    expect(wrapper.emitted('update:isLDAPGroupsValid')).toEqual([[false]])
  })

  it('handleRadioGroupItemClick clears selection and emits when ENTIRE LDAP', () => {
    const handleServerSideSelectionParams = jest.fn()
    const wrapper = createWrapper(
      {},
      { handleServerSideSelectionParams }
    )
    wrapper.vm.radioGroupItems = [
      { label: 'ENTIRE LDAP' },
      { label: 'SELECT LDAP GROUPS' }
    ]
    wrapper.vm.handleRadioGroupItemClick({ label: 'ENTIRE LDAP' })
    expect(wrapper.emitted('update:selectedLDAPItems')[0][0]).toEqual([])
    expect(wrapper.emitted('update:isLDAPGroupsValid')).toContainEqual([true])
    expect(handleServerSideSelectionParams).toHaveBeenCalledWith({
      isSelectedAllEver: false,
      excludedResourceIdList: []
    })
  })
})

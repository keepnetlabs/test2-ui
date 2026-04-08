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
import LDAPService from '@/api/ldap'
import { createTargetGroup } from '@/api/targetUsers'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUserLDAPImportModalStep1.vue (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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

  it('created calls target group loader', () => {
    const ctx = {
      callForTargetGroups: jest.fn()
    }

    TargetUserLDAPImportModalStep1.created.call(ctx)

    expect(ctx.callForTargetGroups).toHaveBeenCalled()
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

  it('watchers emit target group id and step changes', () => {
    const emit = jest.fn()

    TargetUserLDAPImportModalStep1.watch.targetGroupResourceId.call({ $emit: emit }, 'group-1')
    TargetUserLDAPImportModalStep1.watch.selectedRadioGroupIndex.call({ $emit: emit }, 1)

    expect(emit).toHaveBeenCalledWith('update:step1TargetGroupResourceId', 'group-1')
    expect(emit).toHaveBeenCalledWith('update:step1Step', 1)
  })

  it('handleCreateGroup opens modal and closes select menu when ref exists', () => {
    const ctx = {
      isTargetGroupModalVisible: false,
      $refs: {
        refTargetGroupSelect: {
          $refs: {
            refComponent: {
              isMenuActive: true
            }
          }
        }
      }
    }

    TargetUserLDAPImportModalStep1.methods.handleCreateGroup.call(ctx)

    expect(ctx.isTargetGroupModalVisible).toBe(true)
    expect(ctx.$refs.refTargetGroupSelect.$refs.refComponent.isMenuActive).toBe(false)
  })

  it('handleCreateGroup stays safe when select ref is missing', () => {
    const ctx = {
      isTargetGroupModalVisible: false,
      $refs: {}
    }

    expect(() => TargetUserLDAPImportModalStep1.methods.handleCreateGroup.call(ctx)).not.toThrow()
    expect(ctx.isTargetGroupModalVisible).toBe(true)
  })

  it('handleCloseTargetGroupModal hides modal', () => {
    const ctx = {
      isTargetGroupModalVisible: true
    }

    TargetUserLDAPImportModalStep1.methods.handleCloseTargetGroupModal.call(ctx)

    expect(ctx.isTargetGroupModalVisible).toBe(false)
  })

  it('handleConfirmTargetGroupModal creates group and prepends new target group', async () => {
    const ctx = {
      isCreateTargetGroupButtonDisabled: false,
      isTargetGroupModalVisible: true,
      targetGroupItems: [{ text: 'Existing', value: 'existing-1' }],
      targetGroupResourceId: '',
      $set: (obj, key, value) => {
        obj[key] = value
      }
    }

    TargetUserLDAPImportModalStep1.methods.handleConfirmTargetGroupModal.call(ctx, {
      name: 'NewGroup'
    })
    await flushPromises()

    expect(createTargetGroup).toHaveBeenCalledWith({ name: 'NewGroup' })
    expect(ctx.isTargetGroupModalVisible).toBe(false)
    expect(ctx.targetGroupItems[0]).toEqual({ text: 'NewGroup', value: 'new-g1' })
    expect(ctx.targetGroupResourceId).toBe('new-g1')
    expect(ctx.isCreateTargetGroupButtonDisabled).toBe(false)
  })

  it('callForTargetGroups maps API response to selectable items', async () => {
    const ctx = {
      targetGroupItems: []
    }

    TargetUserLDAPImportModalStep1.methods.callForTargetGroups.call(ctx)
    await flushPromises()

    expect(LDAPService.getTargetGroupsForLDAP).toHaveBeenCalled()
    expect(ctx.targetGroupItems).toEqual([
      {
        text: 'Group1',
        value: 'g1',
        disabled: false,
        attrs: { usedLdapName: '' }
      },
      {
        text: 'Group2',
        value: 'g2',
        disabled: true,
        attrs: { usedLdapName: 'used' }
      }
    ])
  })

  it('validateForm requires selected LDAP items when selecting groups manually', () => {
    const result = TargetUserLDAPImportModalStep1.methods.validateForm.call({
      getServerSideSelectionParams: () => ({ isSelectedAllEver: false }),
      selectedRadioGroupIndex: 1,
      selectedLDAPItems: [],
      $refs: {
        refForm: {
          validate: () => true
        }
      }
    })

    expect(result).toBeFalsy()
  })

  it('validateForm allows empty LDAP items when server-side all selection is active', () => {
    const result = TargetUserLDAPImportModalStep1.methods.validateForm.call({
      getServerSideSelectionParams: () => ({ isSelectedAllEver: true }),
      selectedRadioGroupIndex: 1,
      selectedLDAPItems: [],
      $refs: {
        refForm: {
          validate: () => true
        }
      }
    })

    expect(result).toBe(true)
  })

  it('handleRadioGroupItemClick ignores non-entire-ldap option', () => {
    const ctx = {
      radioGroupItems: [{ label: 'ENTIRE LDAP' }, { label: 'SELECT LDAP GROUPS' }],
      handleTableSelectionChange: jest.fn(),
      handleServerSideSelectionParams: jest.fn(),
      $emit: jest.fn()
    }

    TargetUserLDAPImportModalStep1.methods.handleRadioGroupItemClick.call(ctx, {
      label: 'SELECT LDAP GROUPS'
    })

    expect(ctx.handleTableSelectionChange).not.toHaveBeenCalled()
    expect(ctx.handleServerSideSelectionParams).not.toHaveBeenCalled()
  })
})

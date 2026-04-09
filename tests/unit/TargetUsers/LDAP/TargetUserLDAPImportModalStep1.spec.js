jest.mock('@/api/ldap', () => ({
  __esModule: true,
  default: {
    getTargetGroupsForLDAP: jest.fn()
  }
}))

jest.mock('@/api/targetUsers', () => ({
  createTargetGroup: jest.fn()
}))

import LDAPService from '@/api/ldap'
import { createTargetGroup } from '@/api/targetUsers'
import TargetUserLDAPImportModalStep1 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep1.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUserLDAPImportModalStep1.vue', () => {
  const { computed, methods, watch, created } = TargetUserLDAPImportModalStep1

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes helper texts and styles for group validation and switch state', () => {
    expect(computed.getLDAPGroupsErrorMessage.call({ selectedLDAPItems: [] })).toBe('Required')
    expect(computed.getLDAPGroupsErrorMessage.call({ selectedLDAPItems: [{ resourceId: '1' }] })).toBe(
      ''
    )
    expect(computed.getSwitchLabel.call({ isActive: true })).toBe('Active')
    expect(computed.getSwitchLabel.call({ isActive: false })).toBe('Passive')
    expect(computed.getLDAPTargetUserTableStyle.call({ isLDAPGroupsValid: true })).toEqual({})
    expect(computed.getLDAPTargetUserTableStyle.call({ isLDAPGroupsValid: false })).toEqual(
      expect.objectContaining({
        border: '1px solid rgb(255, 82, 82) !important'
      })
    )
  })

  it('watchers emit target group and step updates', () => {
    const emit = jest.fn()
    const ctx = { $emit: emit }

    watch.targetGroupResourceId.call(ctx, 'group-1')
    watch.selectedRadioGroupIndex.call(ctx, 1)

    expect(emit).toHaveBeenNthCalledWith(1, 'update:step1TargetGroupResourceId', 'group-1')
    expect(emit).toHaveBeenNthCalledWith(2, 'update:step1Step', 1)
  })

  it('created loads target groups', () => {
    const callForTargetGroups = jest.fn()

    created.call({ callForTargetGroups })

    expect(callForTargetGroups).toHaveBeenCalledTimes(1)
  })

  it('handleCreateGroup opens modal and closes select menu when available', () => {
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

    methods.handleCreateGroup.call(ctx)

    expect(ctx.isTargetGroupModalVisible).toBe(true)
    expect(ctx.$refs.refTargetGroupSelect.$refs.refComponent.isMenuActive).toBe(false)
  })

  it('handleConfirmTargetGroupModal creates and selects the new group', async () => {
    createTargetGroup.mockResolvedValueOnce({
      data: {
        data: {
          resourceId: 'tg-1'
        }
      }
    })
    const ctx = {
      isCreateTargetGroupButtonDisabled: false,
      isTargetGroupModalVisible: true,
      targetGroupItems: [],
      targetGroupResourceId: ''
    }

    methods.handleConfirmTargetGroupModal.call(ctx, { name: 'New Group' })
    expect(ctx.isCreateTargetGroupButtonDisabled).toBe(true)
    await flushPromises()

    expect(createTargetGroup).toHaveBeenCalledWith({ name: 'New Group' })
    expect(ctx.isTargetGroupModalVisible).toBe(false)
    expect(ctx.targetGroupItems[0]).toEqual({ text: 'New Group', value: 'tg-1' })
    expect(ctx.targetGroupResourceId).toBe('tg-1')
    expect(ctx.isCreateTargetGroupButtonDisabled).toBe(false)
  })

  it('callForTargetGroups maps target groups with disabled and attrs fields', async () => {
    LDAPService.getTargetGroupsForLDAP.mockResolvedValueOnce({
      data: {
        data: [
          {
            name: 'Group A',
            resourceId: 'g-1',
            isSelectable: false,
            message: 'Used by sync'
          }
        ]
      }
    })
    const ctx = {
      targetGroupItems: []
    }

    methods.callForTargetGroups.call(ctx)
    await flushPromises()

    expect(ctx.targetGroupItems).toEqual([
      {
        text: 'Group A',
        value: 'g-1',
        disabled: true,
        attrs: {
          usedLdapName: 'Used by sync'
        }
      }
    ])
  })

  it('validateForm respects selected LDAP groups and server-side selection state', () => {
    expect(
      methods.validateForm.call({
        selectedRadioGroupIndex: 1,
        selectedLDAPItems: [],
        getServerSideSelectionParams: () => ({ isSelectedAllEver: false }),
        $refs: { refForm: { validate: () => true } }
      })
    ).toBeFalsy()

    expect(
      methods.validateForm.call({
        selectedRadioGroupIndex: 1,
        selectedLDAPItems: [],
        getServerSideSelectionParams: () => ({ isSelectedAllEver: true }),
        $refs: { refForm: { validate: () => true } }
      })
    ).toBe(true)
  })

  it('handleTableSelectionChange and radio clicks emit expected selection state', () => {
    const emit = jest.fn()
    const handleServerSideSelectionParams = jest.fn()
    const handleTableSelectionChange = jest.fn()

    methods.handleTableSelectionChange.call({ $emit: emit }, [{ resourceId: '1' }])
    methods.handleTableSelectionChange.call({ $emit: emit }, [])

    expect(emit).toHaveBeenCalledWith('update:isLDAPGroupsValid', true)
    expect(emit).toHaveBeenCalledWith('update:selectedLDAPItems', [{ resourceId: '1' }])
    expect(emit).toHaveBeenCalledWith('update:isLDAPGroupsValid', false)
    expect(emit).toHaveBeenCalledWith('update:selectedLDAPItems', [])

    methods.handleRadioGroupItemClick.call(
      {
        radioGroupItems: [{ label: 'ENTIRE LDAP' }, { label: 'SELECT LDAP GROUPS' }],
        handleTableSelectionChange,
        $emit: emit,
        handleServerSideSelectionParams
      },
      { label: 'ENTIRE LDAP' }
    )

    expect(handleTableSelectionChange).toHaveBeenCalledWith([])
    expect(handleServerSideSelectionParams).toHaveBeenCalledWith({
      isSelectedAllEver: false,
      excludedResourceIdList: []
    })
  })
})

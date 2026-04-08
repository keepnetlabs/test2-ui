jest.mock('@/api/ldap', () => ({
  getLDAPConfigDetail: jest.fn(() => Promise.resolve({ data: { data: {} } })),
  createLDAPConfig: jest.fn(() => Promise.resolve()),
  updateLDAPSchedule: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    getDefaultAxiosPayload: jest.fn(() => ({
      filter: {
        FilterGroups: [{ id: 'default-1' }, { id: 'default-2' }]
      }
    })),
    getDefaultFilter: jest.fn(() => ({
      FilterGroups: []
    }))
  }
})

import TargetUserLDAPImportModal from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModal.vue'
import LDAPService from '@/api/ldap'
import { getDefaultAxiosPayload } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUserLDAPImportModal.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handleClose emits on-close', () => {
    const ctx = { $emit: jest.fn() }
    TargetUserLDAPImportModal.methods.handleClose.call(ctx)
    expect(ctx.$emit).toHaveBeenCalledWith('on-close')
  })

  it('getSelectedUsersLength returns selectedUsers length', () => {
    const ctx = { selectedUsers: [{ id: 1 }, { id: 2 }] }
    expect(TargetUserLDAPImportModal.computed.getSelectedUsersLength.call(ctx)).toBe(2)
  })

  it('isNextButtonDisabled returns true when step1Step 0 and not valid', () => {
    const ctx = {
      step1Step: 0,
      isLDAPGroupsValid: false,
      selectedLDAPItems: [],
      serverSideSelectionParams: { isSelectedAllEver: false }
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(true)
  })

  it('isNextButtonDisabled returns false when step1Step 0 and valid', () => {
    const ctx = {
      step1Step: 0,
      isLDAPGroupsValid: true,
      selectedLDAPItems: []
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(false)
  })

  it('isNextButtonDisabled returns false when step1Step 1 and isSelectedAllEver', () => {
    const ctx = {
      step1Step: 1,
      serverSideSelectionParams: { isSelectedAllEver: true },
      selectedLDAPItems: []
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(false)
  })

  it('isNextButtonDisabled returns false when step1Step 1 and has selectedLDAPItems', () => {
    const ctx = {
      step1Step: 1,
      serverSideSelectionParams: { isSelectedAllEver: false },
      selectedLDAPItems: [{ filterValue: 'g1' }]
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(false)
  })

  it('isNextButtonDisabled returns true when step1Step 1 and no selection', () => {
    const ctx = {
      step1Step: 1,
      serverSideSelectionParams: { isSelectedAllEver: false },
      selectedLDAPItems: []
    }
    expect(TargetUserLDAPImportModal.computed.isNextButtonDisabled.call(ctx)).toBe(true)
  })

  it('created calls callForData only for edit mode with resource id', () => {
    const editableCtx = {
      isEdit: true,
      selectedRow: { resourceId: 'row-1' },
      callForData: jest.fn()
    }
    TargetUserLDAPImportModal.created.call(editableCtx)
    expect(editableCtx.callForData).toHaveBeenCalled()

    const createCtx = {
      isEdit: false,
      selectedRow: { resourceId: 'row-1' },
      callForData: jest.fn()
    }
    TargetUserLDAPImportModal.created.call(createCtx)
    expect(createCtx.callForData).not.toHaveBeenCalled()
  })

  it('callForData fills edit state from grouped filters and selected LDAP groups', async () => {
    LDAPService.getLDAPConfigDetail.mockResolvedValueOnce({
      data: {
        data: {
          targetGroupResourceId: 'group-1',
          ldapSettingResourceId: 'ldap-setting-1',
          filter: {
            filterGroups: [
              { filterItems: [{ fieldName: 'Department' }] },
              { filterItems: [] }
            ]
          },
          groupFilterValues: ['ldap-group-1'],
          status: 1
        }
      }
    })
    const ctx = {
      selectedRow: { resourceId: 'row-1' },
      step2Step: null,
      editedScheduledFilter: null,
      $refs: {
        refStep1: {
          targetGroupResourceId: '',
          isActive: false,
          selectedRadioGroupIndex: 0,
          $refs: {
            refImportTable: {
              initialGroupFilterValues: []
            }
          }
        }
      },
      $nextTick: (cb) => cb()
    }

    TargetUserLDAPImportModal.methods.callForData.call(ctx)
    await flushPromises()

    expect(LDAPService.getLDAPConfigDetail).toHaveBeenCalledWith('row-1')
    expect(ctx.step2Step).toBe(0)
    expect(ctx.editedScheduledFilter).toEqual({
      filterGroups: [{ filterItems: [{ fieldName: 'Department' }] }, { filterItems: [] }]
    })
    expect(ctx.$refs.refStep1.targetGroupResourceId).toBe('group-1')
    expect(ctx.$refs.refStep1.isActive).toBe(true)
    expect(ctx.selectedRow.ldapSettingResourceId).toBe('ldap-setting-1')
    expect(ctx.$refs.refStep1.selectedRadioGroupIndex).toBe(1)
    expect(ctx.$refs.refStep1.$refs.refImportTable.initialGroupFilterValues).toEqual([
      'ldap-group-1'
    ])
  })

  it('callForData falls back to default filter when grouped filters are missing', async () => {
    LDAPService.getLDAPConfigDetail.mockResolvedValueOnce({
      data: {
        data: {
          targetGroupResourceId: 'group-2',
          ldapSettingResourceId: 'ldap-setting-2',
          filter: {},
          groupFilterValues: [],
          status: 0
        }
      }
    })
    const ctx = {
      selectedRow: { resourceId: 'row-2' },
      step2Step: null,
      editedScheduledFilter: null,
      $refs: {
        refStep1: {
          targetGroupResourceId: '',
          isActive: true,
          selectedRadioGroupIndex: 0,
          $refs: {
            refImportTable: {
              initialGroupFilterValues: []
            }
          }
        }
      },
      $nextTick: jest.fn()
    }

    TargetUserLDAPImportModal.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.step2Step).toBe(1)
    expect(ctx.editedScheduledFilter).toEqual(getDefaultAxiosPayload().filter)
    expect(ctx.$refs.refStep1.selectedRadioGroupIndex).toBe(0)
    expect(ctx.$nextTick).not.toHaveBeenCalled()
  })

  it('handleValidateStep1 runs callback for valid form and resets totals when needed', () => {
    const callback = jest.fn()
    const ctx = {
      $refs: {
        refStep1: {
          validateForm: jest.fn(() => true)
        }
      },
      selectedUsers: [{ resourceId: 'u1' }],
      totalNumberOfRecords: 12,
      isEdit: false,
      step2Step: 0,
      serverSideSelectionParams: { isSelectedAllEver: false },
      selectedLDAPItems: [],
      isLDAPGroupsValid: true
    }

    TargetUserLDAPImportModal.methods.handleValidateStep1.call(ctx, callback)

    expect(ctx.selectedUsers).toEqual([])
    expect(ctx.totalNumberOfRecords).toBe(0)
    expect(callback).toHaveBeenCalled()
  })

  it('handleValidateStep1 marks LDAP groups invalid when form fails and nothing is selected', () => {
    const callback = jest.fn()
    const ctx = {
      $refs: {
        refStep1: {
          validateForm: jest.fn(() => false)
        }
      },
      selectedUsers: [],
      totalNumberOfRecords: 7,
      isEdit: false,
      step2Step: 0,
      serverSideSelectionParams: { isSelectedAllEver: false },
      selectedLDAPItems: [],
      isLDAPGroupsValid: true
    }

    TargetUserLDAPImportModal.methods.handleValidateStep1.call(ctx, callback)

    expect(callback).not.toHaveBeenCalled()
    expect(ctx.isLDAPGroupsValid).toBe(false)
  })

  it('getPayloadFilter returns the expected source for each step mode', () => {
    const queryFilter = { FilterGroups: [{ id: 'query' }] }
    const manualFilter = { FilterGroups: [{ id: 'manual' }] }

    expect(
      TargetUserLDAPImportModal.methods.getPayloadFilter.call({
        isEdit: true,
        step2Step: 0,
        $refs: { refStep2: { $refs: { refQuery: { getPayloadFilter: () => queryFilter } } } }
      })
    ).toBe(queryFilter)

    expect(
      TargetUserLDAPImportModal.methods.getPayloadFilter.call({
        isEdit: true,
        step2Step: 1,
        $refs: {}
      })
    ).toEqual(getDefaultAxiosPayload().filter)

    expect(
      TargetUserLDAPImportModal.methods.getPayloadFilter.call({
        isEdit: false,
        step2Step: 1,
        $refs: { refStep2: { $refs: { refQuery: { getPayloadFilter: () => queryFilter } } } }
      })
    ).toBe(queryFilter)

    expect(
      TargetUserLDAPImportModal.methods.getPayloadFilter.call({
        isEdit: false,
        step2Step: 2,
        $refs: {}
      })
    ).toEqual(getDefaultAxiosPayload().filter)

    expect(
      TargetUserLDAPImportModal.methods.getPayloadFilter.call({
        isEdit: false,
        step2Step: 0,
        $refs: {
          refStep2: {
            $refs: {
              refManually: {
                $refs: {
                  refTable: {
                    axiosPayload: { filter: manualFilter }
                  }
                }
              }
            }
          }
        }
      })
    ).toBe(manualFilter)
  })

  it('submit stops early when query form validation fails', () => {
    const ctx = {
      isSubmitDisabled: false,
      isEdit: false,
      step2Step: 1,
      resourceId: 'ldap-1',
      selectedUsers: [],
      serverSideSelectionParams: { isSelectedAllEver: false, excludedResourceIdList: [] },
      getPayloadFilter: jest.fn(() => ({ FilterGroups: [] })),
      $refs: {
        refStep1: {
          targetGroupResourceId: 'target-1'
        },
        refStep2: {
          step2Step: 1,
          transactionId: 'tx-1',
          groupFilterValues: ['group-1'],
          $refs: {
            refQuery: {
              $refs: {
                refForm: {
                  validate: jest.fn(() => false)
                }
              }
            }
          }
        }
      }
    }

    TargetUserLDAPImportModal.methods.submit.call(ctx, 0)

    expect(ctx.isSubmitDisabled).toBe(false)
    expect(LDAPService.createLDAPConfig).not.toHaveBeenCalled()
  })

  it('submit creates LDAP config and includes selected ids for partial import', async () => {
    const ctx = {
      isSubmitDisabled: false,
      isEdit: false,
      step2Step: 0,
      resourceId: 'ldap-1',
      selectedUsers: [{ resourceId: 'user-1' }, { resourceId: 'user-2' }],
      serverSideSelectionParams: { isSelectedAllEver: true, excludedResourceIdList: ['user-3'] },
      getPayloadFilter: jest.fn(() => ({ FilterGroups: [{ id: 'manual' }] })),
      handleClose: jest.fn(),
      $emit: jest.fn(),
      $refs: {
        refStep1: {
          targetGroupResourceId: 'target-1'
        },
        refStep2: {
          step2Step: 0,
          transactionId: 'tx-1',
          groupFilterValues: ['group-1'],
          $refs: {
            refManually: {
              $refs: {
                refTable: {
                  axiosPayload: { filter: { FilterGroups: [] } }
                }
              }
            }
          }
        }
      }
    }

    TargetUserLDAPImportModal.methods.submit.call(ctx, 1)
    await flushPromises()

    expect(LDAPService.createLDAPConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        ldapSettingResourceId: 'ldap-1',
        importType: 1,
        isSchedule: false,
        selectAll: true,
        excludedItems: ['user-3'],
        selectedUserResourceIds: ['user-1', 'user-2']
      })
    )
    expect(ctx.handleClose).toHaveBeenCalled()
    expect(ctx.$emit).toHaveBeenCalledWith('on-close-with-update')
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit updates LDAP schedule in edit mode with status', async () => {
    const ctx = {
      isSubmitDisabled: false,
      isEdit: true,
      step2Step: 1,
      resourceId: 'ldap-1',
      selectedRow: { resourceId: 'row-3' },
      selectedUsers: [],
      serverSideSelectionParams: { isSelectedAllEver: false, excludedResourceIdList: [] },
      getPayloadFilter: jest.fn(() => ({ FilterGroups: [{ id: 'default' }] })),
      $emit: jest.fn(),
      $refs: {
        refStep1: {
          targetGroupResourceId: 'target-1',
          isActive: true
        },
        refStep2: {
          step2Step: 1,
          transactionId: 'tx-9',
          groupFilterValues: ['group-9'],
          $refs: {
            refQuery: {
              $refs: {
                refForm: {
                  validate: jest.fn(() => true)
                }
              }
            }
          }
        }
      }
    }

    TargetUserLDAPImportModal.methods.submit.call(ctx, 0)
    await flushPromises()

    expect(LDAPService.updateLDAPSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        ldapSettingResourceId: 'ldap-1',
        status: 1,
        isSchedule: true
      }),
      'row-3'
    )
    expect(ctx.$emit).toHaveBeenCalledWith('on-close-with-update')
  })
})

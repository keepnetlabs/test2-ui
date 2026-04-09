jest.mock('@/api/ldap', () => ({
  __esModule: true,
  default: {
    createLDAPConfig: jest.fn(),
    updateLDAPSchedule: jest.fn(),
    getLDAPConfigDetail: jest.fn()
  }
}))

import LDAPService from '@/api/ldap'
import TargetUserLDAPImportModal from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModal.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUserLDAPImportModal.vue', () => {
  const { computed, methods, created } = TargetUserLDAPImportModal

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computes selected user count and next button disabled state across branches', () => {
    expect(computed.getSelectedUsersLength.call({ selectedUsers: [{}, {}] })).toBe(2)

    expect(
      computed.isNextButtonDisabled.call({
        step1Step: 0,
        isLDAPGroupsValid: true
      })
    ).toBe(false)

    expect(
      computed.isNextButtonDisabled.call({
        step1Step: 1,
        serverSideSelectionParams: { isSelectedAllEver: false },
        selectedLDAPItems: []
      })
    ).toBe(true)

    expect(
      computed.isNextButtonDisabled.call({
        step1Step: 1,
        serverSideSelectionParams: { isSelectedAllEver: true },
        selectedLDAPItems: []
      })
    ).toBe(false)
  })

  it('created loads existing config only in edit mode with a selected row id', () => {
    const callForData = jest.fn()

    created.call({ isEdit: true, selectedRow: { resourceId: 'cfg-1' }, callForData })
    created.call({ isEdit: true, selectedRow: {}, callForData })
    created.call({ isEdit: false, selectedRow: { resourceId: 'cfg-1' }, callForData })

    expect(callForData).toHaveBeenCalledTimes(1)
  })

  it('callForData hydrates step refs from existing LDAP schedule config', async () => {
    LDAPService.getLDAPConfigDetail.mockResolvedValueOnce({
      data: {
        data: {
          targetGroupResourceId: 'tg-1',
          ldapSettingResourceId: 'ldap-setting-1',
          filter: {
            filterGroups: [{ filterItems: [{ FieldName: 'Status' }] }, { filterItems: [] }]
          },
          groupFilterValues: ['group-a'],
          status: 1
        }
      }
    })
    const refStep1 = {
      targetGroupResourceId: '',
      isActive: false,
      selectedRadioGroupIndex: 0,
      $refs: {
        refImportTable: {
          initialGroupFilterValues: []
        }
      }
    }
    const nextTick = jest.fn((cb) => cb())
    const ctx = {
      selectedRow: { resourceId: 'schedule-1' },
      step2Step: 1,
      editedScheduledFilter: null,
      $refs: { refStep1 },
      $nextTick: nextTick
    }

    methods.callForData.call(ctx)
    await flushPromises()

    expect(LDAPService.getLDAPConfigDetail).toHaveBeenCalledWith('schedule-1')
    expect(ctx.step2Step).toBe(0)
    expect(ctx.editedScheduledFilter).toEqual({
      filterGroups: [{ filterItems: [{ FieldName: 'Status' }] }, { filterItems: [] }]
    })
    expect(refStep1.targetGroupResourceId).toBe('tg-1')
    expect(refStep1.isActive).toBe(true)
    expect(ctx.selectedRow.ldapSettingResourceId).toBe('ldap-setting-1')
    expect(refStep1.selectedRadioGroupIndex).toBe(1)
    expect(refStep1.$refs.refImportTable.initialGroupFilterValues).toEqual(['group-a'])
  })

  it('handleValidateStep1 resets counts, clears selections, and flags invalid LDAP groups', () => {
    const callback = jest.fn()
    const ctx = {
      isEdit: false,
      step2Step: 0,
      totalNumberOfRecords: 12,
      selectedUsers: [{ resourceId: 'u-1' }],
      serverSideSelectionParams: { isSelectedAllEver: false },
      selectedLDAPItems: [],
      isLDAPGroupsValid: true,
      $refs: {
        refStep1: {
          validateForm: () => false
        }
      }
    }

    methods.handleValidateStep1.call(ctx, callback)

    expect(ctx.selectedUsers).toEqual([])
    expect(ctx.totalNumberOfRecords).toBe(0)
    expect(ctx.isLDAPGroupsValid).toBe(false)
    expect(callback).not.toHaveBeenCalled()
  })

  it('getPayloadFilter returns query, manual, or default filters for each mode', () => {
    const queryFilter = { q: 1 }
    const manualFilter = { m: 1 }

    expect(
      methods.getPayloadFilter.call({
        isEdit: true,
        step2Step: 0,
        $refs: { refStep2: { $refs: { refQuery: { getPayloadFilter: () => queryFilter } } } }
      })
    ).toBe(queryFilter)

    expect(
      methods.getPayloadFilter.call({
        isEdit: true,
        step2Step: 1,
        $refs: {}
      })
    ).toEqual(expect.objectContaining({ FilterGroups: expect.any(Array) }))

    expect(
      methods.getPayloadFilter.call({
        isEdit: false,
        step2Step: 1,
        $refs: { refStep2: { $refs: { refQuery: { getPayloadFilter: () => queryFilter } } } }
      })
    ).toBe(queryFilter)

    expect(
      methods.getPayloadFilter.call({
        isEdit: false,
        step2Step: 2,
        $refs: {}
      })
    ).toEqual(expect.objectContaining({ FilterGroups: expect.any(Array) }))

    expect(
      methods.getPayloadFilter.call({
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

  it('submit aborts on invalid query form and re-enables submit button', () => {
    const ctx = {
      isEdit: false,
      step2Step: 1,
      isSubmitDisabled: false,
      resourceId: 'ldap-1',
      serverSideSelectionParams: { isSelectedAllEver: false, excludedResourceIdList: [] },
      $refs: {
        refStep1: { targetGroupResourceId: 'tg-1' },
        refStep2: {
          step2Step: 1,
          transactionId: 'trx-1',
          groupFilterValues: [],
          $refs: {
            refQuery: {
              getPayloadFilter: () => ({ query: true }),
              $refs: {
                refForm: {
                  validate: () => false
                }
              }
            }
          }
        }
      },
      getPayloadFilter: methods.getPayloadFilter
    }

    methods.submit.call(ctx, 0)

    expect(ctx.isSubmitDisabled).toBe(false)
    expect(LDAPService.createLDAPConfig).not.toHaveBeenCalled()
  })

  it('submit creates config for partial import and closes on success', async () => {
    LDAPService.createLDAPConfig.mockResolvedValueOnce({})
    const handleClose = jest.fn()
    const emit = jest.fn()
    const ctx = {
      isEdit: false,
      step2Step: 0,
      isSubmitDisabled: false,
      resourceId: 'ldap-1',
      selectedUsers: [{ resourceId: 'u-1' }, { resourceId: 'u-2' }],
      serverSideSelectionParams: { isSelectedAllEver: false, excludedResourceIdList: ['u-3'] },
      handleClose,
      $emit: emit,
      getPayloadFilter: () => ({ manual: true }),
      $refs: {
        refStep1: { targetGroupResourceId: 'tg-1' },
        refStep2: {
          step2Step: 0,
          transactionId: 'trx-1',
          groupFilterValues: ['group-a'],
          $refs: {
            refManually: {
              $refs: {
                refTable: {
                  axiosPayload: { filter: { manual: true } }
                }
              }
            }
          }
        }
      }
    }

    methods.submit.call(ctx, 1)
    expect(ctx.isSubmitDisabled).toBe(true)
    await flushPromises()

    expect(LDAPService.createLDAPConfig).toHaveBeenCalledWith({
      ldapSettingResourceId: 'ldap-1',
      targetGroupResourceId: 'tg-1',
      transactionId: 'trx-1',
      importType: 1,
      groupFilterValues: ['group-a'],
      filter: { manual: true },
      isSchedule: false,
      selectAll: false,
      excludedItems: ['u-3'],
      selectedUserResourceIds: ['u-1', 'u-2']
    })
    expect(handleClose).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('on-close-with-update')
    expect(ctx.isSubmitDisabled).toBe(false)
  })

  it('submit updates schedule in edit mode with status', async () => {
    LDAPService.updateLDAPSchedule.mockResolvedValueOnce({})
    const emit = jest.fn()
    const ctx = {
      isEdit: true,
      step2Step: 0,
      isSubmitDisabled: false,
      resourceId: 'ldap-setting-1',
      selectedRow: { resourceId: 'schedule-1' },
      serverSideSelectionParams: { isSelectedAllEver: true, excludedResourceIdList: [] },
      getPayloadFilter: () => ({ query: true }),
      $emit: emit,
      $refs: {
        refStep1: { targetGroupResourceId: 'tg-2', isActive: true },
        refStep2: {
          step2Step: 0,
          transactionId: 'trx-2',
          groupFilterValues: ['group-b'],
          $refs: {
            refQuery: {
              getPayloadFilter: () => ({ query: true }),
              $refs: {
                refForm: {
                  validate: () => true
                }
              }
            }
          }
        }
      }
    }

    methods.submit.call(ctx, 0)
    await flushPromises()

    expect(LDAPService.updateLDAPSchedule).toHaveBeenCalledWith(
      {
        ldapSettingResourceId: 'ldap-setting-1',
        targetGroupResourceId: 'tg-2',
        transactionId: 'trx-2',
        importType: 0,
        groupFilterValues: ['group-b'],
        filter: { query: true },
        isSchedule: true,
        selectAll: true,
        excludedItems: [],
        status: 1
      },
      'schedule-1'
    )
    expect(emit).toHaveBeenCalledWith('on-close-with-update')
  })
})

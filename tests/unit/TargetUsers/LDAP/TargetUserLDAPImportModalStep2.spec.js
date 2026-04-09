jest.mock('@/api/ldap', () => ({
  __esModule: true,
  default: {
    createLDAPMapping: jest.fn(),
    checkLDAPMappingStatus: jest.fn()
  }
}))

import LDAPService from '@/api/ldap'
import TargetUserLDAPImportModalStep2 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep2.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TargetUserLDAPImportModalStep2.vue', () => {
  const { computed, methods, watch, data, created } = TargetUserLDAPImportModalStep2

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('builds radio groups based on edit mode and selected step text', () => {
    const nonEdit = data.call({ isEdit: false, step1Step: 0, step2Step: 2 })
    expect(nonEdit.radioGroupItems).toHaveLength(3)
    expect(nonEdit.radioGroupItems[0].label).toBe('SELECT Manually')
    expect(nonEdit.selectedRadioGroupIndex).toBe(2)

    const edit = data.call({ isEdit: true, step1Step: 1, step2Step: 0 })
    expect(edit.radioGroupItems).toHaveLength(2)
    expect(edit.radioGroupItems[1].infoText).toContain('selected LDAP groups')
  })

  it('computes idle state and clears selected users when step changes', () => {
    expect(computed.isIdle.call({ activeStatus: 0 })).toBe(true)
    expect(computed.isIdle.call({ activeStatus: 1 })).toBe(false)

    const setSelectedUsers = jest.fn()
    const emit = jest.fn()
    watch.selectedRadioGroupIndex.call({ setSelectedUsers, $emit: emit }, 1)

    expect(setSelectedUsers).toHaveBeenCalledWith([])
    expect(emit).toHaveBeenCalledWith('update:step2Step', 1)
  })

  it('created starts LDAP mapping immediately', () => {
    const createLDAPMapping = jest.fn()

    created.call({ createLDAPMapping })

    expect(createLDAPMapping).toHaveBeenCalledTimes(1)
  })

  it('createLDAPMapping sends payload and continues with transaction status polling', async () => {
    LDAPService.createLDAPMapping.mockResolvedValueOnce({
      data: {
        data: {
          transactionId: 'trx-1'
        }
      }
    })
    const emit = jest.fn()
    const checkLDAPMappingStatus = jest.fn()
    const ctx = {
      resourceId: 'ldap-1',
      selectedLDAPItems: [{ filterValue: 'group-a' }, { filterValue: 'group-b' }],
      groupFilterValues: [],
      transactionId: '',
      $emit: emit,
      getServerSideSelectionParams: () => ({
        isSelectedAllEver: true,
        excludedResourceIdList: ['u-1']
      }),
      checkLDAPMappingStatus
    }

    methods.createLDAPMapping.call(ctx)
    await flushPromises()

    expect(emit).toHaveBeenCalledWith('update:isLoading', true)
    expect(LDAPService.createLDAPMapping).toHaveBeenCalledWith({
      ldapSettingId: 'ldap-1',
      groupFilterValues: ['group-a', 'group-b'],
      selectAll: true,
      excludedItems: ['u-1']
    })
    expect(ctx.transactionId).toBe('trx-1')
    expect(checkLDAPMappingStatus).toHaveBeenCalledWith('trx-1')
  })

  it('createLDAPMapping stops loading when mapping request fails', async () => {
    LDAPService.createLDAPMapping.mockRejectedValueOnce(new Error('failed'))
    const emit = jest.fn()
    const ctx = {
      resourceId: 'ldap-1',
      selectedLDAPItems: [],
      groupFilterValues: [],
      $emit: emit,
      getServerSideSelectionParams: () => null
    }

    methods.createLDAPMapping.call(ctx)
    await flushPromises()

    expect(emit).toHaveBeenCalledWith('update:isLoading', true)
    expect(emit).toHaveBeenCalledWith('update:isLoading', false)
  })

  it('checkLDAPMappingStatus handles finished-with-error and expired statuses', async () => {
    LDAPService.checkLDAPMappingStatus
      .mockResolvedValueOnce({
        data: {
          data: {
            existingUserCount: 1,
            newUserCount: 2,
            invalidUserCount: 3,
            status: 5
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            existingUserCount: 0,
            newUserCount: 0,
            invalidUserCount: 1,
            status: 3
          }
        }
      })
    const dispatch = jest.fn()
    const emit = jest.fn()
    const ctx = {
      processedUserCount: 0,
      mappingObject: {},
      activeStatus: 0,
      $store: { dispatch },
      $emit: emit
    }

    methods.checkLDAPMappingStatus.call(ctx, 'trx-error')
    await flushPromises()
    expect(ctx.processedUserCount).toBe(6)
    expect(ctx.activeStatus).toBe(5)
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: 'Something went wrong. Finished With Error'
      })
    )
    expect(emit).toHaveBeenCalledWith('on-error')

    methods.checkLDAPMappingStatus.call(ctx, 'trx-expired')
    await flushPromises()
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({
        message: 'Expired'
      })
    )
  })

  it('checkLDAPMappingStatus finishes loading or retries when status is pending', async () => {
    LDAPService.checkLDAPMappingStatus
      .mockResolvedValueOnce({
        data: {
          data: {
            existingUserCount: 1,
            newUserCount: 1,
            invalidUserCount: 0,
            status: 4
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            existingUserCount: 0,
            newUserCount: 1,
            invalidUserCount: 0,
            status: 1
          }
        }
      })
    const emit = jest.fn()
    const retry = jest.fn()
    const timeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })
    const ctx = {
      processedUserCount: 0,
      mappingObject: {},
      activeStatus: 0,
      $store: { dispatch: jest.fn() },
      $emit: emit,
      checkLDAPMappingStatus: retry
    }

    methods.checkLDAPMappingStatus.call(ctx, 'trx-finished')
    await flushPromises()
    expect(emit).toHaveBeenCalledWith('update:isLoading', false)

    methods.checkLDAPMappingStatus.call(ctx, 'trx-pending')
    await flushPromises()
    expect(timeoutSpy).toHaveBeenCalled()
    expect(retry).toHaveBeenCalledWith('trx-pending')

    timeoutSpy.mockRestore()
  })
})

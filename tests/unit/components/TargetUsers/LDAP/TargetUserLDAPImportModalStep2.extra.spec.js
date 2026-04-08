jest.mock('@/api/ldap', () => {
  const createLDAPMapping = jest.fn(() =>
    Promise.resolve({ data: { data: { transactionId: 'tx-1' } } })
  )
  const checkLDAPMappingStatus = jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          existingUserCount: 5,
          newUserCount: 3,
          invalidUserCount: 0,
          status: 4
        }
      }
    })
  )
  return {
    __esModule: true,
    default: { createLDAPMapping, checkLDAPMappingStatus }
  }
})

import { shallowMount } from '@vue/test-utils'
import TargetUserLDAPImportModalStep2 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep2.vue'
import LDAPService from '@/api/ldap'

describe('TargetUserLDAPImportModalStep2.vue (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createWrapper = (propsData = {}, inject = {}) =>
    shallowMount(TargetUserLDAPImportModalStep2, {
      propsData: {
        selectedLDAPItems: [{ filterValue: 'f1' }],
        step2Step: 0,
        step1Step: 0,
        isLoading: false,
        ...propsData
      },
      provide: {
        resourceId: inject.resourceId ?? 'res-1',
        isEdit: inject.isEdit ?? false,
        setSelectedUsers: inject.setSelectedUsers ?? jest.fn(),
        getServerSideSelectionParams: inject.getServerSideSelectionParams ?? (() => ({}))
      },
      mocks: {
        $store: { dispatch: jest.fn() }
      },
      stubs: {
        KButtonRadioGroup: true,
        TargetUserLDAPImportLoader: true,
        TargetUserLdapImportManuallyStep: true,
        TargetUserLDAPImportSyncByQueryStep: true
      }
    })

  it('isIdle returns true when activeStatus is 0', () => {
    const wrapper = createWrapper()
    wrapper.setData({ activeStatus: 0 })
    expect(wrapper.vm.isIdle).toBe(true)
  })

  it('isIdle returns false when activeStatus is not 0', () => {
    const wrapper = createWrapper()
    wrapper.setData({ activeStatus: 1 })
    expect(wrapper.vm.isIdle).toBe(false)
  })

  it('watch selectedRadioGroupIndex emits update:step2Step and calls setSelectedUsers', async () => {
    const setSelectedUsers = jest.fn()
    const wrapper = createWrapper({}, { setSelectedUsers })
    wrapper.setData({ selectedRadioGroupIndex: 1 })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:step2Step')).toEqual([[1]])
    expect(setSelectedUsers).toHaveBeenCalledWith([])
  })

  it('createLDAPMapping sends mapping payload and starts status polling', async () => {
    const checkLDAPMappingStatus = jest.fn()
    const emit = jest.fn()
    const ctx = {
      selectedLDAPItems: [{ filterValue: 'group-a' }, { filterValue: 'group-b' }],
      groupFilterValues: [],
      getServerSideSelectionParams: () => ({
        isSelectedAllEver: true,
        excludedResourceIdList: ['user-1']
      }),
      resourceId: 'ldap-1',
      $emit: emit,
      checkLDAPMappingStatus,
      transactionId: ''
    }

    TargetUserLDAPImportModalStep2.methods.createLDAPMapping.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(emit).toHaveBeenCalledWith('update:isLoading', true)
    expect(LDAPService.createLDAPMapping).toHaveBeenCalledWith({
      ldapSettingId: 'ldap-1',
      groupFilterValues: ['group-a', 'group-b'],
      selectAll: true,
      excludedItems: ['user-1']
    })
    expect(ctx.transactionId).toBe('tx-1')
    expect(checkLDAPMappingStatus).toHaveBeenCalledWith('tx-1')
  })

  it('createLDAPMapping stops loading when mapping request fails', async () => {
    LDAPService.createLDAPMapping.mockRejectedValueOnce(new Error('fail'))
    const emit = jest.fn()
    const ctx = {
      selectedLDAPItems: [{ filterValue: 'group-a' }],
      groupFilterValues: [],
      getServerSideSelectionParams: () => ({}),
      resourceId: 'ldap-1',
      $emit: emit,
      checkLDAPMappingStatus: jest.fn()
    }

    TargetUserLDAPImportModalStep2.methods.createLDAPMapping.call(ctx)
    await Promise.resolve()
    await Promise.resolve()

    expect(emit).toHaveBeenCalledWith('update:isLoading', true)
    expect(emit).toHaveBeenCalledWith('update:isLoading', false)
    expect(ctx.checkLDAPMappingStatus).not.toHaveBeenCalled()
  })

  it('checkLDAPMappingStatus emits loading false when transaction finishes', async () => {
    LDAPService.checkLDAPMappingStatus.mockResolvedValueOnce({
      data: {
        data: {
          existingUserCount: 1,
          newUserCount: 2,
          invalidUserCount: 3,
          status: 4
        }
      }
    })
    const emit = jest.fn()
    const ctx = {
      processedUserCount: 0,
      mappingObject: {},
      activeStatus: 0,
      $emit: emit,
      $store: { dispatch: jest.fn() }
    }

    TargetUserLDAPImportModalStep2.methods.checkLDAPMappingStatus.call(ctx, 'tx-1')
    await Promise.resolve()
    await Promise.resolve()

    expect(ctx.processedUserCount).toBe(6)
    expect(ctx.activeStatus).toBe(4)
    expect(ctx.mappingObject.status).toBe(4)
    expect(emit).toHaveBeenCalledWith('update:isLoading', false)
  })

  it('checkLDAPMappingStatus handles finished-with-error and expired states', async () => {
    LDAPService.checkLDAPMappingStatus
      .mockResolvedValueOnce({
        data: {
          data: {
            existingUserCount: 0,
            newUserCount: 0,
            invalidUserCount: 1,
            status: 5
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            existingUserCount: 0,
            newUserCount: 0,
            invalidUserCount: 0,
            status: 3
          }
        }
      })

    const dispatch = jest.fn()
    const emit = jest.fn()

    const errorCtx = {
      processedUserCount: 0,
      mappingObject: {},
      activeStatus: 0,
      $emit: emit,
      $store: { dispatch }
    }
    TargetUserLDAPImportModalStep2.methods.checkLDAPMappingStatus.call(errorCtx, 'tx-1')
    await Promise.resolve()
    await Promise.resolve()

    const expiredCtx = {
      processedUserCount: 0,
      mappingObject: {},
      activeStatus: 0,
      $emit: emit,
      $store: { dispatch }
    }
    TargetUserLDAPImportModalStep2.methods.checkLDAPMappingStatus.call(expiredCtx, 'tx-2')
    await Promise.resolve()
    await Promise.resolve()

    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Something went wrong. Finished With Error' })
    )
    expect(dispatch).toHaveBeenCalledWith(
      'common/createSnackBar',
      expect.objectContaining({ message: 'Expired' })
    )
    expect(emit).toHaveBeenCalledWith('on-error')
  })

  it('checkLDAPMappingStatus schedules another poll when transaction is still running', async () => {
    LDAPService.checkLDAPMappingStatus.mockResolvedValueOnce({
      data: {
        data: {
          existingUserCount: 1,
          newUserCount: 1,
          invalidUserCount: 0,
          status: 1
        }
      }
    })
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
      fn()
      return 1
    })
    const repeatedCheck = jest.fn()
    const ctx = {
      processedUserCount: 0,
      mappingObject: {},
      activeStatus: 0,
      $emit: jest.fn(),
      $store: { dispatch: jest.fn() },
      checkLDAPMappingStatus: repeatedCheck
    }

    TargetUserLDAPImportModalStep2.methods.checkLDAPMappingStatus.call(ctx, 'tx-3')
    await Promise.resolve()
    await Promise.resolve()

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2500)
    expect(repeatedCheck).toHaveBeenCalledWith('tx-3')
    setTimeoutSpy.mockRestore()
  })
})

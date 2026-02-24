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

describe('TargetUserLDAPImportModalStep2.vue (extra coverage)', () => {
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
})

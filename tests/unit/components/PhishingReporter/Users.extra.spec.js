import Users from '@/components/PhishingReporter/Users.vue'
import {
  searchPhishingReporterUser,
  exportPhishingReporterUserList,
  deletePhishingReporterUser,
  bulkDeletePhishingUsers
} from '@/api/phishingReporter'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'

jest.mock('@/api/phishingReporter', () => ({
  searchPhishingReporterUser: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  exportPhishingReporterUserList: jest.fn(() => Promise.resolve({ data: 'mock-file' })),
  deletePhishingReporterUser: jest.fn(() => Promise.resolve()),
  bulkDeletePhishingUsers: jest.fn(() => Promise.resolve())
}))

const createObjectURL = jest.fn(() => 'blob:mock')
beforeAll(() => {
  window.URL.createObjectURL = createObjectURL
})

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('PhishingReporter Users.vue (extra coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUserName', () => {
    it('returns "This user" when selectedRow has no firstName or lastName', () => {
      const ctx = { selectedRow: {}, isMultipleDelete: false }
      expect(Users.computed.getUserName.call(ctx)).toBe('This user')
    })

    it('returns firstName only when lastName is missing', () => {
      const ctx = { selectedRow: { firstName: 'John' }, isMultipleDelete: false }
      expect(Users.computed.getUserName.call(ctx)).toContain('John')
    })

    it('returns lastName only when firstName is missing', () => {
      const ctx = { selectedRow: { lastName: 'Doe' }, isMultipleDelete: false }
      expect(Users.computed.getUserName.call(ctx)).toContain('Doe')
    })
  })

  describe('getStatusTooltipMessage', () => {
    const baseRow = {
      osVersion: 'Win10',
      hklmLoadBehaviorValue: '3',
      osAccountLoadBehaviorValue: '3',
      bootTime: 100,
      outlookVersion: '16',
      outlookArchitecture: 'x64'
    }

    it('returns Online message when addInStatusName is Online', () => {
      const row = { ...baseRow, [PROPERTY_STORE.ADDINSTATUSNAME]: 'Online' }
      const result = Users.methods.getStatusTooltipMessage.call({}, row)
      expect(result).toContain('Add-in is installed and active')
      expect(result).toContain('HKLM')
      expect(result).toContain('HKCU')
      expect(result).toContain('Boot time')
    })

    it('returns Inactive message when addInStatusName is Inactive', () => {
      const row = { ...baseRow, [PROPERTY_STORE.ADDINSTATUSNAME]: 'Inactive' }
      const result = Users.methods.getStatusTooltipMessage.call({}, row)
      expect(result).toContain('Addin is inactivated by user')
      expect(result).toContain('User is offline')
    })

    it('returns Offline message when addInStatusName is Offline', () => {
      const row = { ...baseRow, [PROPERTY_STORE.ADDINSTATUSNAME]: 'Offline' }
      const result = Users.methods.getStatusTooltipMessage.call({}, row)
      expect(result).toContain('Add-in is installed')
      expect(result).toContain('User is offline')
    })

    it('returns Disabled message when addInStatusName is Disabled', () => {
      const row = {
        ...baseRow,
        [PROPERTY_STORE.ADDINSTATUSNAME]: 'Disabled',
        addInDisabledReason: 'Policy',
        addInDisabledLastDisabledTime: '2024-01-01'
      }
      const result = Users.methods.getStatusTooltipMessage.call({}, row)
      expect(result).toContain('Add-in is installed but disabled')
      expect(result).toContain('Cause: Policy')
      expect(result).toContain('Disabled time: 2024-01-01')
    })

    it('returns NotInstalled message when addInStatusName is NotInstalled', () => {
      const row = { [PROPERTY_STORE.ADDINSTATUSNAME]: 'NotInstalled' }
      const result = Users.methods.getStatusTooltipMessage.call({}, row)
      expect(result).toBe('Add-in has not been installed')
    })

    it('returns N/A message when addInStatusName is N/A', () => {
      const row = { [PROPERTY_STORE.ADDINSTATUSNAME]: 'N/A' }
      const result = Users.methods.getStatusTooltipMessage.call({}, row)
      expect(result).toBe('This user is not an active user in your active directory')
    })

    it('returns empty string for unknown status', () => {
      const row = { [PROPERTY_STORE.ADDINSTATUSNAME]: 'Unknown' }
      const result = Users.methods.getStatusTooltipMessage.call({}, row)
      expect(result).toBe('')
    })
  })

  describe('getDateValue', () => {
    it('pads single digit with zero', () => {
      expect(Users.methods.getDateValue.call({}, 5)).toBe('05')
      expect(Users.methods.getDateValue.call({}, '5')).toBe('05')
    })

    it('returns as-is for two or more digits', () => {
      expect(Users.methods.getDateValue.call({}, 12)).toBe('12')
      expect(Users.methods.getDateValue.call({}, '12')).toBe('12')
    })
  })

  describe('deleteUser', () => {
    it('calls callForDeletePhishingReporterUser when single delete', () => {
      const callForDeletePhishingReporterUser = jest.fn()
      const ctx = {
        isMultipleDelete: false,
        selectedRow: { resourceId: 'u1' },
        isWantToDelete: true,
        callForDeletePhishingReporterUser
      }
      Users.methods.deleteUser.call(ctx)
      expect(callForDeletePhishingReporterUser).toHaveBeenCalled()
      expect(ctx.isWantToDelete).toBe(false)
    })

    it('calls callForMultipleDelete when isMultipleDelete', () => {
      const callForMultipleDelete = jest.fn()
      const ctx = {
        isMultipleDelete: true,
        callForMultipleDelete
      }
      Users.methods.deleteUser.call(ctx)
      expect(callForMultipleDelete).toHaveBeenCalled()
    })
  })

  describe('handleMultipleDeleteOfPhishingUsers', () => {
    it('sets multiple delete state with items when not selectAll', () => {
      const ctx = {
        isMultipleDelete: false,
        multipleDeletedUserCount: 0,
        multipleSystemUserPayload: {},
        serverSideProps: { totalNumberOfRecords: 100 },
        axiosPayload: { filter: {} }
      }
      const items = [{ resourceId: 'u1' }, { resourceId: 'u2' }]
      Users.methods.handleMultipleDeleteOfPhishingUsers.call(ctx, items, [], false)
      expect(ctx.isMultipleDelete).toBe(true)
      expect(ctx.multipleDeletedUserCount).toBe(2)
      expect(ctx.multipleSystemUserPayload.items).toEqual(['u1', 'u2'])
      expect(ctx.multipleSystemUserPayload.selectAll).toBe(false)
      expect(ctx.isWantToDelete).toBe(true)
    })

    it('sets total count when selectAll', () => {
      const ctx = {
        isMultipleDelete: false,
        multipleDeletedUserCount: 0,
        multipleSystemUserPayload: {},
        serverSideProps: { totalNumberOfRecords: 50 },
        axiosPayload: { filter: {} }
      }
      Users.methods.handleMultipleDeleteOfPhishingUsers.call(ctx, [], ['ex1'], true)
      expect(ctx.multipleDeletedUserCount).toBe(50)
      expect(ctx.multipleSystemUserPayload.selectAll).toBe(true)
      expect(ctx.multipleSystemUserPayload.items).toEqual([])
    })
  })

  describe('callForDeletePhishingReporterUser', () => {
    it('calls deletePhishingReporterUser and refreshes data', async () => {
      const unSelectRow = jest.fn()
      const changeServerSideSelectionCount = jest.fn()
      const callForData = jest.fn()
      const ctx = {
        selectedRow: { resourceId: 'u1' },
        $refs: {
          refUsersList: {
            unSelectRow,
            changeServerSideSelectionCount
          }
        },
        callForData
      }
      Users.methods.callForDeletePhishingReporterUser.call(ctx)
      await flushPromises()
      expect(deletePhishingReporterUser).toHaveBeenCalledWith('u1')
      expect(unSelectRow).toHaveBeenCalledWith({ resourceId: 'u1' })
      expect(changeServerSideSelectionCount).toHaveBeenCalledWith(-1)
      expect(callForData).toHaveBeenCalled()
    })
  })

  describe('callForMultipleDelete', () => {
    it('calls bulkDeletePhishingUsers and resets state', async () => {
      const resetSelectableParams = jest.fn()
      const callForData = jest.fn()
      const ctx = {
        multipleSystemUserPayload: { items: ['u1', 'u2'], selectAll: false },
        deleteButtonDisabled: false,
        isWantToDelete: true,
        $refs: { refUsersList: { resetSelectableParams } },
        callForData
      }
      Users.methods.callForMultipleDelete.call(ctx)
      await flushPromises()
      expect(bulkDeletePhishingUsers).toHaveBeenCalledWith({
        items: ['u1', 'u2'],
        selectAll: false
      })
      expect(ctx.isWantToDelete).toBe(false)
      expect(resetSelectableParams).toHaveBeenCalled()
      expect(callForData).toHaveBeenCalled()
      expect(ctx.deleteButtonDisabled).toBe(false)
    })
  })

  describe('callForData', () => {
    it('emits callForPhishingReporterSummary when not init', async () => {
      const emit = jest.fn()
      searchPhishingReporterUser.mockResolvedValueOnce({
        data: {
          data: {
            results: [],
            totalNumberOfRecords: 0,
            totalNumberOfPages: 0,
            pageNumber: 1
          }
        }
      })
      const ctx = {
        isLoading: false,
        isInit: false,
        axiosPayload: {},
        serverSideProps: {},
        tableOptions: { table: [] },
        $emit: emit
      }
      Users.methods.callForData.call(ctx)
      await flushPromises()
      expect(emit).toHaveBeenCalledWith('callForPhishingReporterSummary')
    })

    it('sets isLoading false on catch', async () => {
      searchPhishingReporterUser.mockRejectedValueOnce(new Error('API error'))
      const ctx = {
        isLoading: true,
        isInit: true,
        axiosPayload: {},
        serverSideProps: {},
        tableOptions: { table: [] }
      }
      Users.methods.callForData.call(ctx)
      await flushPromises()
      expect(ctx.isLoading).toBe(false)
    })

    it('maps NotInstalled diagnosticToolStatus to label', async () => {
      searchPhishingReporterUser.mockResolvedValueOnce({
        data: {
          data: {
            results: [{ diagnosticToolStatus: 'NotInstalled', resourceId: '1' }],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      })
      const ctx = {
        isLoading: true,
        isInit: true,
        axiosPayload: {},
        serverSideProps: {},
        tableOptions: { table: [] }
      }
      Users.methods.callForData.call(ctx)
      await flushPromises()
      expect(ctx.tableOptions.table[0].diagnosticToolStatus).toBeDefined()
    })
  })

  describe('exportPhishingReporterUserList', () => {
    it('calls export with reportAllPages and filter when reportAllPages is true', async () => {
      const ctx = {
        axiosPayload: {
          orderBy: 'LastSeen',
          ascending: true,
          filter: { FilterGroups: [{ FilterItems: [] }] }
        },
        tableOptions: { table: [{ resourceId: 'r1' }] }
      }
      Users.methods.exportPhishingReporterUserList.call(ctx, {
        exportTypes: ['CSV'],
        reportAllPages: true,
        pageNumber: 1,
        pageSize: 10
      })
      await flushPromises()
      expect(exportPhishingReporterUserList).toHaveBeenCalled()
      const payload = exportPhishingReporterUserList.mock.calls[0][0]
      expect(payload.reportAllPages).toBe(true)
      expect(payload.filter).toBeDefined()
    })

    it('adds ResourceId filter when reportAllPages is false', async () => {
      const ctx = {
        axiosPayload: {
          orderBy: 'LastSeen',
          ascending: true,
          filter: { FilterGroups: [{ FilterItems: [] }] }
        },
        tableOptions: { table: [{ resourceId: 'r1' }, { resourceId: 'r2' }] }
      }
      Users.methods.exportPhishingReporterUserList.call(ctx, {
        exportTypes: ['XLS'],
        reportAllPages: false,
        pageNumber: 1,
        pageSize: 10
      })
      await flushPromises()
      const payload = exportPhishingReporterUserList.mock.calls[0][0]
      expect(payload.reportAllPages).toBe(false)
      const resourceIdFilter = payload.filter.FilterGroups[0].FilterItems.find(
        (f) => f.FieldName === 'ResourceId'
      )
      expect(resourceIdFilter).toEqual({
        FieldName: 'ResourceId',
        Operator: 'Include',
        Value: 'r1,r2'
      })
      expect(payload.exportType).toBe('Excel')
    })
  })

  describe('isWantToDelete watcher', () => {
    it('clears selectedRow and isMultipleDelete when isWantToDelete becomes false', async () => {
      const { shallowMount } = require('@vue/test-utils')
      const wrapper = shallowMount(Users, {
        stubs: { AppDialog: true, DataTable: true, AppDialogFooter: true, Badge: true },
        mocks: {
          $store: { getters: { 'permissions/getPhishingReporterDeleteUserPermissions': true } }
        }
      })
      await wrapper.vm.$nextTick()
      wrapper.setData({
        isWantToDelete: true,
        selectedRow: { resourceId: '1' },
        isMultipleDelete: true
      })
      await wrapper.vm.$nextTick()
      wrapper.setData({ isWantToDelete: false })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.selectedRow).toBeNull()
      expect(wrapper.vm.isMultipleDelete).toBe(false)
    })
  })
})

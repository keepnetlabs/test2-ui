jest.mock('@/api/phishingsimulator', () => ({
  exportCampaignManager: jest.fn(() => Promise.resolve({ data: new ArrayBuffer(0) })),
  searchCampaignManager: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable.vue'
import { exportCampaignManager } from '@/api/phishingsimulator'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('CampaignManagerParentTable.vue (extra branch coverage)', () => {
  describe('getMethodDetail', () => {
    it('returns parsed object when valid JSON', () => {
      const ctx = {}
      const methodDetail = JSON.stringify([{ method: 'Click', count: 5 }])
      expect(CampaignManagerParentTable.methods.getMethodDetail.call(ctx, methodDetail)).toEqual([
        { method: 'Click', count: 5 }
      ])
    })
    it('returns {} when methodDetail is null', () => {
      const ctx = {}
      expect(CampaignManagerParentTable.methods.getMethodDetail.call(ctx, null)).toEqual({})
    })
    it('returns {} when JSON parse throws', () => {
      const ctx = {}
      expect(CampaignManagerParentTable.methods.getMethodDetail.call(ctx, 'invalid json')).toEqual({})
    })
  })

  describe('getRecordsButtonSingleLabel', () => {
    it('returns empty string when status is Idle', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Idle',
          frequency: 1
        })
      ).toBe('')
    })
    it('returns empty string when recurring (frequency !== 0)', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Complete',
          frequency: 1
        })
      ).toBe('')
    })
    it('returns View Report when not Idle and not recurring', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Complete',
          frequency: 0
        })
      ).toBe('View Report')
    })
  })

  describe('getTooltipDisabilityStatus', () => {
    it('returns false when status is Error and has jobResultMessage', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call(ctx, {
          status: 'Error',
          jobResultMessage: 'Failed'
        })
      ).toBe(false)
    })

    it('returns true when status is not Error (tooltip disabled)', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call(ctx, {
          status: 'Running',
          jobResultMessage: ''
        })
      ).toBe(true)
    })

    it('returns true when status is Error but jobResultMessage is empty', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getTooltipDisabilityStatus.call(ctx, {
          status: 'Error',
          jobResultMessage: ''
        })
      ).toBe(true)
    })
  })

  describe('getErrorMessage', () => {
    it('returns jobResultMessage when status is Error', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getErrorMessage.call(ctx, {
          status: 'Error',
          jobResultMessage: 'Custom'
        })
      ).toBe('Custom')
    })

    it('returns empty string when status is not Error', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getErrorMessage.call(ctx, {
          status: 'Running',
          jobResultMessage: 'ignored'
        })
      ).toBe('')
    })

    it('returns empty string when Error but jobResultMessage missing', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getErrorMessage.call(ctx, {
          status: 'Error'
        })
      ).toBe('')
    })
  })

  describe('isTargetUsersShowGroups', () => {
    it('returns true for Idle status', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'Idle' })
      ).toBe(true)
    })
    it('returns true for Scheduled and lowercase scheduled (API casing)', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'Scheduled' })
      ).toBe(true)
      expect(
        CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'scheduled' })
      ).toBe(true)
    })
    it('returns false for other status', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'Complete' })
      ).toBe(false)
    })
    it('returns false when status is missing', () => {
      const ctx = {}
      expect(CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, {})).toBe(false)
    })
  })

  describe('handleTargetUsersGroupsClick', () => {
    it('emits full row for parent dialog payload', () => {
      const emit = jest.fn()
      const row = {
        resourceId: 'camp-99',
        campaignType: 2,
        instanceGroup: 'ig-7',
        status: 'Idle'
      }
      CampaignManagerParentTable.methods.handleTargetUsersGroupsClick.call({ $emit: emit }, row)
      expect(emit).toHaveBeenCalledWith('on-target-users-groups-click', row)
    })

    it('emits row with campaignType 0 and numeric instanceGroup without mutation', () => {
      const emit = jest.fn()
      const row = {
        resourceId: 'camp-zero',
        campaignType: 0,
        instanceGroup: 0,
        status: 'Scheduled'
      }
      CampaignManagerParentTable.methods.handleTargetUsersGroupsClick.call({ $emit: emit }, row)
      expect(emit).toHaveBeenCalledWith('on-target-users-groups-click', row)
      expect(row.instanceGroup).toBe(0)
    })
  })

  describe('exportCampaignManagerList', () => {
    it('calls api and handles Excel conversion', () => {
      const ctx = {
        getCampaignManagerParentExportPermissions: true,
        axiosPayload: { orderBy: 'n', ascending: true, filter: {} }
      }
      
      if (!globalThis.URL.createObjectURL) {
        globalThis.URL.createObjectURL = jest.fn(() => 'blob')
      }
      const click = jest.fn()
      jest.spyOn(document, 'createElement').mockImplementation(() => ({ click, href: '', download: '' }))

      CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
        exportTypes: ['XLS'],
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: true
      })

      expect(exportCampaignManager).toHaveBeenCalledWith(expect.objectContaining({ exportType: 'Excel' }))
    })

    it('calls api with PDF export type and sets .pdf download name', async () => {
      jest.clearAllMocks()
      const ctx = {
        getCampaignManagerParentExportPermissions: true,
        axiosPayload: { orderBy: 'n', ascending: true, filter: {} }
      }
      if (!globalThis.URL.createObjectURL) {
        globalThis.URL.createObjectURL = jest.fn(() => 'blob')
      }
      const click = jest.fn()
      const link = { click, href: '', download: '' }
      jest.spyOn(document, 'createElement').mockImplementation(() => link)

      CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
        exportTypes: ['PDF'],
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: false
      })
      await flushPromises()

      expect(exportCampaignManager).toHaveBeenCalledWith(expect.objectContaining({ exportType: 'PDF' }))
      expect(link.download).toBe('Campaign-Manager.pdf')
    })
  })

  describe('handleSearchChange', () => {
    it('renames CategoryDistributionType to ScenarioDistribution in filters', () => {
      const ctx = {
        axiosPayload: { 
          filter: { 
            FilterGroups: [{}, { FilterItems: [] }] 
          } 
        },
        resetPageNumber: jest.fn(),
        callForData: jest.fn()
      }
      const searchFilter = {
        filter: {
          FilterGroups: [{
            FilterItems: [{ FieldName: 'CategoryDistributionType', Value: 'v' }]
          }]
        }
      }
      
      CampaignManagerParentTable.methods.handleSearchChange.call(ctx, searchFilter)
      
      const item = ctx.axiosPayload.filter.FilterGroups[1].FilterItems[0]
      expect(item.FieldName).toBe('ScenarioDistribution')
      expect(ctx.resetPageNumber).toHaveBeenCalled()
      expect(ctx.callForData).toHaveBeenCalled()
    })
  })

  describe('getMethodDetail edge cases', () => {
    it('returns {} when methodDetail is empty string (invalid JSON)', () => {
      const ctx = {}
      expect(CampaignManagerParentTable.methods.getMethodDetail.call(ctx, '')).toEqual({})
    })
  })

  describe('getRecordsButtonSingleLabel frequency null (one-time)', () => {
    it('returns View Report when frequency is null and status is not Idle', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.getRecordsButtonSingleLabel.call(ctx, {
          status: 'Running',
          frequency: null
        })
      ).toBe('View Report')
    })
  })

  describe('watch statusItems (parent table)', () => {
    it('does not update filters when status list is empty', () => {
      const wrapper = {
        $set: jest.fn(),
        $refs: { refTable: { reRenderFilters: jest.fn() } },
        tableOptions: {
          columns: [{ property: 'status' }]
        }
      }
      CampaignManagerParentTable.watch.statusItems.call(wrapper, [])
      expect(wrapper.$set).not.toHaveBeenCalled()
    })
  })

  describe('setLoading', () => {
    it('emits update:is-loading with boolean flag', () => {
      const emit = jest.fn()
      CampaignManagerParentTable.methods.setLoading.call({ $emit: emit }, true)
      expect(emit).toHaveBeenCalledWith('update:is-loading', true)
      CampaignManagerParentTable.methods.setLoading.call({ $emit: emit })
      expect(emit).toHaveBeenCalledWith('update:is-loading', false)
    })
  })

  describe('exportCampaignManagerList permissions', () => {
    it('skips API when export permission is false', () => {
      jest.clearAllMocks()
      const ctx = {
        getCampaignManagerParentExportPermissions: false,
        axiosPayload: { orderBy: 'n', ascending: true, filter: {} }
      }
      CampaignManagerParentTable.methods.exportCampaignManagerList.call(ctx, {
        exportTypes: ['PDF'],
        pageNumber: 1,
        pageSize: 10,
        reportAllPages: false
      })
      expect(exportCampaignManager).not.toHaveBeenCalled()
    })
  })
})

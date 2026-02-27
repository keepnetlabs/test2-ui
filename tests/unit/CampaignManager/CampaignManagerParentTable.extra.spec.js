jest.mock('@/api/phishingsimulator', () => ({
  exportCampaignManager: jest.fn(() => Promise.resolve({ data: new Blob() })),
  searchCampaignManager: jest.fn(() => Promise.resolve({ data: { data: {} } }))
}))

import CampaignManagerParentTable from '@/components/CampaignManager/CampaignManagerParentTable.vue'
import { exportCampaignManager } from '@/api/phishingsimulator'

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
  })

  describe('isTargetUsersShowGroups', () => {
    it('returns true for Idle status', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'Idle' })
      ).toBe(true)
    })
    it('returns false for other status', () => {
      const ctx = {}
      expect(
        CampaignManagerParentTable.methods.isTargetUsersShowGroups.call(ctx, { status: 'Complete' })
      ).toBe(false)
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
})
